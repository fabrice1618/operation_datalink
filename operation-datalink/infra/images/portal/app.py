import os
import hashlib
import sqlite3
import pathlib
import markdown
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from flask import (
    Flask, render_template, request, redirect, url_for,
    session, jsonify, abort, flash, send_from_directory
)
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "datalink-portal-secret-2024")
# dev — recharge les templates Jinja modifies sans reconstruire (opt-in via env)
app.config["TEMPLATES_AUTO_RELOAD"] = os.environ.get("TEMPLATES_AUTO_RELOAD") == "1"

# Affichage des horodatages : SQLite stocke en UTC (CURRENT_TIMESTAMP) ; on
# convertit en heure locale pour l'affichage (gère l'heure d'été/hiver).
LOCAL_TZ = ZoneInfo(os.environ.get("PORTAL_TZ", "Europe/Paris"))


def to_local(ts):
    """Horodatage SQLite UTC ('YYYY-MM-DD HH:MM:SS') → heure locale, même format."""
    if not ts:
        return ts
    dt = datetime.fromisoformat(ts).replace(tzinfo=timezone.utc).astimezone(LOCAL_TZ)
    return dt.strftime("%Y-%m-%d %H:%M:%S")


@app.after_request
def _dev_no_cache(resp):
    """dev — empeche le navigateur de servir une version en cache des pages."""
    if app.config["TEMPLATES_AUTO_RELOAD"]:
        resp.headers["Cache-Control"] = "no-store, must-revalidate"
        resp.headers["Pragma"] = "no-cache"
        resp.headers["Expires"] = "0"
    return resp

ENONCE_DIR = pathlib.Path("/data/enonce")
CAPTURE_DIR = pathlib.Path(os.environ.get("CAPTURE_DIR", "/data/captures"))
DATA_DIR = pathlib.Path("/data")
PV_DIR = DATA_DIR / "pvs"
DB_PATH = DATA_DIR / "submissions.db"

ALLOWED_EXTENSIONS = {"pdf", "txt", "md", "odt", "docx"}

DASHBOARD_TOKEN = os.environ.get("DASHBOARD_TOKEN", "prof2024")
ACCESS_CODE = os.environ.get("ACCESS_CODE", "DATALINK-2026")

def sha256_hex(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _load_flag_hash(phase: str) -> str:
    """SHA-256 attendu pour une preuve.

    Le portail ne connaît jamais les flags en clair : seule leur empreinte
    SHA-256 est embarquée (cf. evolution1.md, P1) — aucune fuite de source même
    si l'on inspecte l'environnement du conteneur. On lit FLAG_P*_SHA256 ; en
    secours (dev/local), un FLAG_P* en clair est haché à la volée au démarrage.
    """
    h = os.environ.get(f"FLAG_{phase}_SHA256", "").strip().lower()
    if h:
        return h
    plain = os.environ.get(f"FLAG_{phase}", "").strip()
    return sha256_hex(plain) if plain else ""


# Empreintes SHA-256 des flags attendus (jamais le flag en clair).
FLAG_HASHES = {p: _load_flag_hash(p) for p in ("P0", "P1", "P2", "P3", "P4", "P5", "P6")}

PHASE_LABELS = {
    "P0": "Réquisition 0 — Prise en main (entraînement)",
    "P1": "Réquisition 1 — Coordination du trafic (HTTP)",
    "P2": "Réquisition 2 — Exfiltration base clients (FTP)",
    "P3": "Réquisition 3 — Menaces et chantage (SMTP)",
    "P4": "Réquisition 4 — Intrusion serveur (Telnet)",
    "P5": "Réquisition 5 — Canal caché (DNS)",
    "P6": "Phase 2 — Séquestre : exfiltration persistante",
}

# Découpage des preuves par phase de la procédure.
PHASE_GROUPS = {
    1: ["P1", "P2", "P3", "P4", "P5"],
    2: ["P6"],
}

# Noms d'équipe imposés — lettres grecques.
GREEK_TEAMS = [
    ("ALPHA", "Α"), ("BÊTA", "Β"), ("GAMMA", "Γ"), ("DELTA", "Δ"),
    ("EPSILON", "Ε"), ("ZÊTA", "Ζ"), ("ÊTA", "Η"), ("THÊTA", "Θ"),
    ("IOTA", "Ι"), ("KAPPA", "Κ"), ("LAMBDA", "Λ"), ("MU", "Μ"),
]
GREEK_NAMES = {name for name, _ in GREEK_TEAMS}

# Scellés numériques téléchargeables sur l'écran de saisine.
CAPTURES = [
    ("scelle-00_formation.pcap", "Scellé d'entraînement — prise en main"),
    ("scelle-01_serveur-interne.pcap", "Scellé n° 01 — sonde serveur interne"),
    ("scelle-02_passerelle.pcap", "Scellé n° 02 — sonde passerelle"),
]
CAPTURE_NAMES = {name for name, _ in CAPTURES}

# Le pipeline judiciaire (étapes ordonnées) — pilote le stepper et le footer.
PIPELINE = [
    ("saisine",      "Saisine"),
    ("prise_en_main", "Prise en main"),
    ("requisitions", "Réquisitions"),
    ("preuves",      "Preuves P1"),
    ("phase2",       "Phase 2"),
    ("preuves2",     "Preuves P2"),
    ("pv",           "Procès-verbal"),
    ("fin",          "Fin"),
]


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    PV_DIR.mkdir(parents=True, exist_ok=True)
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS groups (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS flag_submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                group_id INTEGER NOT NULL,
                phase TEXT NOT NULL,
                flag_text TEXT NOT NULL,   -- SHA-256 du flag soumis (jamais en clair)
                correct INTEGER NOT NULL,
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES groups(id)
            );
            CREATE TABLE IF NOT EXISTS pv_uploads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                group_id INTEGER NOT NULL,
                filename TEXT NOT NULL,
                filepath TEXT NOT NULL,
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES groups(id)
            );
        """)


def get_or_create_group(name: str) -> int:
    with get_db() as conn:
        row = conn.execute("SELECT id FROM groups WHERE name = ?", (name,)).fetchone()
        if row:
            return row["id"]
        cur = conn.execute("INSERT INTO groups (name) VALUES (?)", (name,))
        return cur.lastrowid or 0


def validate_flag(flag_text: str, phase: str) -> bool:
    """Vrai si le flag correspond à l'empreinte attendue pour CETTE réquisition.

    Chaque preuve est rattachée à une réquisition précise : on compare le
    SHA-256 du flag soumis à l'empreinte de la phase ciblée, et à elle seule.
    Un flag correct mais versé dans la mauvaise case — ou réutilisé d'une case
    à l'autre — est donc rejeté. Aucun flag en clair n'est conservé côté
    serveur au-delà de la requête courante.
    """
    expected = FLAG_HASHES.get(phase)
    return bool(expected) and sha256_hex(flag_text.strip()) == expected


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def render_md(slug: str) -> str:
    """Rend un fichier d'énoncé en HTML."""
    path = ENONCE_DIR / slug
    if not path.exists():
        abort(404)
    return markdown.markdown(
        path.read_text(encoding="utf-8"),
        extensions=["tables", "fenced_code", "nl2br"],
    )


def found_phases(group_name: str) -> set:
    """Ensemble des phases déjà validées par l'équipe."""
    group_id = get_or_create_group(group_name)
    with get_db() as conn:
        rows = conn.execute(
            "SELECT phase, correct FROM flag_submissions WHERE group_id = ?",
            (group_id,),
        ).fetchall()
    return {r["phase"] for r in rows if r["correct"]}


# Preuves comptabilisées au classement (l'entraînement P0 reste hors-concours).
SCORED_PHASES = PHASE_GROUPS[1] + PHASE_GROUPS[2]   # P1..P6


def gather_solves():
    """Première résolution correcte par équipe et par preuve.

    Renvoie un couple :
      - solves      : {group_id: {phase: solved_at}}
      - first_blood : {phase: group_id} — 1re équipe à verser la preuve
    Le `MIN(submitted_at)` neutralise d'éventuels doublons historiques.
    """
    placeholders = ",".join("?" * len(SCORED_PHASES))
    with get_db() as conn:
        rows = conn.execute(
            "SELECT group_id, phase, MIN(submitted_at) AS solved_at "
            "FROM flag_submissions "
            f"WHERE correct = 1 AND phase IN ({placeholders}) "
            "GROUP BY group_id, phase",
            SCORED_PHASES,
        ).fetchall()
    solves: dict = {}
    first_blood: dict = {}
    best: dict = {}
    for r in rows:
        solves.setdefault(r["group_id"], {})[r["phase"]] = r["solved_at"]
        ph, at = r["phase"], r["solved_at"]
        if ph not in best or at < best[ph]:
            best[ph] = at
            first_blood[ph] = r["group_id"]
    return solves, first_blood


def ranked_scoreboard(groups, solves):
    """Classe les équipes : score décroissant, puis dernière preuve la plus tôt.

    Chaque entrée porte rank, name, id, score, last (horodatage) et solves.
    Une équipe sans preuve est rejetée en fin de classement ('~' > tout chiffre).
    """
    rows = []
    for g in groups:
        s = solves.get(g["id"], {})
        rows.append({
            "id": g["id"], "name": g["name"],
            "score": len(s), "last": (max(s.values()) if s else None),
            "solves": s,
        })
    rows.sort(key=lambda r: (-r["score"], r["last"] or "~"))
    for i, r in enumerate(rows, 1):
        r["rank"] = i
        r["last"] = to_local(r["last"])  # tri en UTC, affichage en heure locale
    return rows


def require_group():
    """Redirige vers l'étape manquante ; renvoie None si l'équipe est identifiée."""
    if not session.get("access"):
        flash("Saisissez d'abord le code d'accès.", "warning")
        return redirect(url_for("index"))
    if not session.get("group_name"):
        flash("Choisissez d'abord votre équipe.", "warning")
        return redirect(url_for("equipe"))
    return None


@app.context_processor
def inject_pipeline():
    """Expose le pipeline (stepper + footer Retour/Continuer) à tous les templates."""
    endpoints = [s[0] for s in PIPELINE]
    cur = request.endpoint
    idx = endpoints.index(cur) if cur in endpoints else -1
    return {
        "pipeline": PIPELINE,
        "current_step": cur,
        "step_index": idx,
        "in_pipeline": idx >= 0,
        "prev_step": PIPELINE[idx - 1] if idx > 0 else None,
        "next_step": PIPELINE[idx + 1] if 0 <= idx < len(PIPELINE) - 1 else None,
        "has_group": bool(session.get("group_name")),
    }


@app.route("/")
def index():
    # Reprise de session : court-circuite vers l'étape atteinte.
    # On exige `access` avant `group_name` pour rester cohérent avec
    # require_group() ; sinon un cookie incomplet (group_name sans access)
    # provoque une boucle de redirection /  <-> /saisine.
    if session.get("access") and session.get("group_name"):
        return redirect(url_for("saisine"))
    if session.get("access"):
        return redirect(url_for("equipe"))
    return render_template("index.html")


@app.route("/access", methods=["POST"])
def do_access():
    code = request.form.get("access_code", "").strip()
    if code != ACCESS_CODE:
        flash("Code d'accès incorrect.", "danger")
        return redirect(url_for("index"))
    session["access"] = True
    return redirect(url_for("equipe"))


@app.route("/equipe")
def equipe():
    if not session.get("access"):
        flash("Saisissez d'abord le code d'accès.", "warning")
        return redirect(url_for("index"))
    return render_template(
        "equipe.html",
        teams=GREEK_TEAMS,
        current=session.get("group_name"),
    )


@app.route("/set-group", methods=["POST"])
def set_group():
    if not session.get("access"):
        flash("Saisissez d'abord le code d'accès.", "warning")
        return redirect(url_for("index"))
    name = request.form.get("group_name", "").strip().upper()
    if name not in GREEK_NAMES:
        flash("Sélectionnez une équipe dans la liste.", "danger")
        return redirect(url_for("equipe"))
    session["group_name"] = name
    get_or_create_group(name)
    return redirect(url_for("saisine"))


@app.route("/saisine")
def saisine():
    redir = require_group()
    if redir:
        return redir
    return render_template(
        "saisine.html",
        group=session["group_name"],
        content=render_md("00_briefing-juge.md"),
    )


@app.route("/captures/<name>")
def download_capture(name):
    redir = require_group()
    if redir:
        return redir
    if name not in CAPTURE_NAMES:
        abort(404)
    return send_from_directory(CAPTURE_DIR, name, as_attachment=True)


@app.route("/prise-en-main")
def prise_en_main():
    redir = require_group()
    if redir:
        return redir
    found = "P0" in found_phases(session["group_name"])
    return render_template(
        "prise-en-main.html",
        group=session["group_name"],
        content=render_md("requisition-0-prise-en-main.md"),
        training_pcap="scelle-00_formation.pcap",
        found=found,
    )


@app.route("/aide/wireshark")
def aide_wireshark():
    redir = require_group()
    if redir:
        return redir
    return render_template(
        "guide.html",
        group=session["group_name"],
        title="Antisèche Wireshark",
        subhead="aide-mémoire — analyse réseau",
        content=render_md("aide-wireshark.md"),
    )


@app.route("/aide/tcpdump")
def aide_tcpdump():
    redir = require_group()
    if redir:
        return redir
    return render_template(
        "guide.html",
        group=session["group_name"],
        title="Antisèche tcpdump",
        subhead="aide-mémoire — capture en ligne de commande",
        content=render_md("aide-tcpdump.md"),
    )


@app.route("/requisitions")
def requisitions():
    redir = require_group()
    if redir:
        return redir
    return render_template(
        "requisitions.html",
        group=session["group_name"],
        content=render_md("01_sujet-phase1.md"),
    )


@app.route("/preuves")
def preuves():
    redir = require_group()
    if redir:
        return redir
    group = session["group_name"]
    phases = {p: PHASE_LABELS[p] for p in PHASE_GROUPS[1]}
    found = found_phases(group) & set(phases)
    return render_template(
        "preuves.html",
        title="Saisie des preuves — Phase 1",
        phases=phases, found=found, group=group, phase_num=1, cells=24,
    )


@app.route("/phase2")
def phase2():
    redir = require_group()
    if redir:
        return redir
    return render_template(
        "phase2.html",
        group=session["group_name"],
        content=render_md("02_complement-juge-phase2.md"),
    )


@app.route("/preuves2")
def preuves2():
    redir = require_group()
    if redir:
        return redir
    group = session["group_name"]
    phases = {p: PHASE_LABELS[p] for p in PHASE_GROUPS[2]}
    found = found_phases(group) & set(phases)
    return render_template(
        "preuves.html",
        title="Saisie des preuves — Phase 2",
        phases=phases, found=found, group=group, phase_num=2, cells=24,
    )


@app.route("/api/flag", methods=["POST"])
def api_flag():
    if not session.get("group_name"):
        return jsonify({"error": "Groupe non défini"}), 401
    data = request.get_json(force=True, silent=True) or {}
    flag_text = (data.get("flag") or "").strip()
    phase = (data.get("phase") or "").strip().upper()
    if not flag_text:
        return jsonify({"error": "Flag vide"}), 400
    # La preuve doit cibler une réquisition connue : sans phase explicite, on ne
    # peut pas vérifier qu'elle est versée dans la bonne case.
    if phase not in PHASE_LABELS:
        return jsonify({"error": "Réquisition inconnue"}), 400

    group_name = session["group_name"]
    group_id = get_or_create_group(group_name)

    correct = validate_flag(flag_text, phase)

    # On n'archive jamais le flag soumis en clair : seul son SHA-256 est stocké
    # (la colonne flag_text conserve désormais une empreinte, cf. init_db).
    with get_db() as conn:
        already = conn.execute(
            "SELECT id FROM flag_submissions WHERE group_id = ? AND correct = 1 AND phase = ?",
            (group_id, phase),
        ).fetchone()
        if not already:
            conn.execute(
                "INSERT INTO flag_submissions (group_id, phase, flag_text, correct) VALUES (?,?,?,?)",
                (group_id, phase, sha256_hex(flag_text), int(correct)),
            )

    if correct:
        return jsonify({"correct": True, "phase": phase, "label": PHASE_LABELS[phase]})
    return jsonify({"correct": False})


@app.route("/scoreboard")
def scoreboard():
    redir = require_group()
    if redir:
        return redir
    with get_db() as conn:
        groups = conn.execute("SELECT id, name FROM groups ORDER BY created_at").fetchall()
    solves, first_blood = gather_solves()
    board = ranked_scoreboard(groups, solves)
    return render_template(
        "scoreboard.html",
        group=session["group_name"],
        board=board,
        first_blood=first_blood,
        phases=SCORED_PHASES,
        labels=PHASE_LABELS,
    )


@app.route("/api/scoreboard")
def api_scoreboard():
    """Classement en JSON — alimente le rafraîchissement en direct."""
    if not session.get("group_name"):
        return jsonify({"error": "Groupe non défini"}), 401
    with get_db() as conn:
        groups = conn.execute("SELECT id, name FROM groups ORDER BY created_at").fetchall()
    solves, first_blood = gather_solves()
    board = ranked_scoreboard(groups, solves)
    return jsonify({
        "me": session["group_name"],
        "phases": SCORED_PHASES,
        "board": [
            {
                "rank": r["rank"], "name": r["name"], "score": r["score"],
                "last": r["last"],
                "cells": {
                    p: {
                        "solved": p in r["solves"],
                        "first_blood": first_blood.get(p) == r["id"],
                    }
                    for p in SCORED_PHASES
                },
            }
            for r in board
        ],
    })


@app.route("/pv")
def pv():
    redir = require_group()
    if redir:
        return redir
    group = session["group_name"]
    group_id = get_or_create_group(group)
    with get_db() as conn:
        uploads = conn.execute(
            "SELECT filename, submitted_at FROM pv_uploads WHERE group_id = ? ORDER BY submitted_at DESC",
            (group_id,),
        ).fetchall()
    uploads = [
        {"filename": u["filename"], "submitted_at": to_local(u["submitted_at"])}
        for u in uploads
    ]
    return render_template("pv.html", group=group, uploads=uploads)


@app.route("/api/pv", methods=["POST"])
def api_pv():
    if not session.get("group_name"):
        return jsonify({"error": "Groupe non défini"}), 401
    if "file" not in request.files:
        flash("Aucun fichier sélectionné.", "danger")
        return redirect(url_for("pv"))
    f = request.files["file"]
    if not f.filename:
        flash("Aucun fichier sélectionné.", "danger")
        return redirect(url_for("pv"))
    if not allowed_file(f.filename):
        flash(f"Format non autorisé. Formats acceptés : {', '.join(ALLOWED_EXTENSIONS)}", "danger")
        return redirect(url_for("pv"))

    group_name = session["group_name"]
    group_id = get_or_create_group(group_name)
    safe_group = secure_filename(group_name)
    group_dir = PV_DIR / safe_group
    group_dir.mkdir(parents=True, exist_ok=True)
    filename = secure_filename(f.filename)
    filepath = group_dir / filename
    f.save(filepath)

    with get_db() as conn:
        conn.execute(
            "INSERT INTO pv_uploads (group_id, filename, filepath) VALUES (?,?,?)",
            (group_id, filename, str(filepath)),
        )
    flash(f"Procès-verbal « {filename} » déposé avec succès.", "success")
    return redirect(url_for("pv"))


@app.route("/fin")
def fin():
    redir = require_group()
    if redir:
        return redir
    group = session["group_name"]
    group_id = get_or_create_group(group)
    found = found_phases(group)
    with get_db() as conn:
        pv_count = conn.execute(
            "SELECT COUNT(*) AS n FROM pv_uploads WHERE group_id = ?", (group_id,)
        ).fetchone()["n"]
    p1_found = found & set(PHASE_GROUPS[1])
    p2_found = found & set(PHASE_GROUPS[2])
    return render_template(
        "fin.html",
        group=group,
        phases=PHASE_LABELS,
        phase_groups=PHASE_GROUPS,
        found=found,
        p1_count=len(p1_found), p1_total=len(PHASE_GROUPS[1]),
        p2_count=len(p2_found), p2_total=len(PHASE_GROUPS[2]),
        pv_count=pv_count,
    )


@app.route("/logout")
def logout():
    session.clear()
    flash("Session fermée.", "info")
    return redirect(url_for("index"))


@app.route("/dashboard")
def dashboard():
    token = request.args.get("token", "")
    if token != DASHBOARD_TOKEN:
        abort(403)
    with get_db() as conn:
        groups = conn.execute("SELECT id, name, created_at FROM groups ORDER BY created_at").fetchall()
        pvs = conn.execute(
            "SELECT group_id, filename, submitted_at FROM pv_uploads ORDER BY submitted_at"
        ).fetchall()

    solves, first_blood = gather_solves()
    board = ranked_scoreboard(groups, solves)

    pvs_by_group = {}
    for p in pvs:
        pvs_by_group.setdefault(p["group_id"], []).append({
            "filename": p["filename"],
            "submitted_at": to_local(p["submitted_at"]),
        })

    return render_template(
        "dashboard.html",
        groups=groups,
        board=board,
        phases={p: PHASE_LABELS[p] for p in SCORED_PHASES},
        solves=solves,
        first_blood=first_blood,
        pvs_by_group=pvs_by_group,
        token=token,
    )


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=False)
