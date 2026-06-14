import os
import sqlite3
import pathlib
import markdown
from flask import (
    Flask, render_template, request, redirect, url_for,
    session, jsonify, abort, flash, send_from_directory
)
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "datalink-portal-secret-2024")
# dev — recharge les templates Jinja modifies sans reconstruire (opt-in via env)
app.config["TEMPLATES_AUTO_RELOAD"] = os.environ.get("TEMPLATES_AUTO_RELOAD") == "1"


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

FLAGS = {
    "P1": os.environ.get("FLAG_P1", ""),
    "P2": os.environ.get("FLAG_P2", ""),
    "P3": os.environ.get("FLAG_P3", ""),
    "P4": os.environ.get("FLAG_P4", ""),
    "P5": os.environ.get("FLAG_P5", ""),
    "P6": os.environ.get("FLAG_P6", ""),
}

PHASE_LABELS = {
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
    ("scelle-01_serveur-interne.pcap", "Scellé n° 01 — sonde serveur interne"),
    ("scelle-02_passerelle.pcap", "Scellé n° 02 — sonde passerelle"),
]
CAPTURE_NAMES = {name for name, _ in CAPTURES}

# Le pipeline judiciaire (étapes ordonnées) — pilote le stepper et le footer.
PIPELINE = [
    ("saisine",      "Saisine"),
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
                flag_text TEXT NOT NULL,
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


def validate_flag(flag_text: str) -> str | None:
    """Retourne la phase (P1..P6) si le flag est correct, sinon None."""
    normalized = flag_text.strip()
    for phase, expected in FLAGS.items():
        if expected and normalized == expected:
            return phase
    return None


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
        phases=phases, found=found, group=group, phase_num=1,
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
        phases=phases, found=found, group=group, phase_num=2,
    )


@app.route("/api/flag", methods=["POST"])
def api_flag():
    if not session.get("group_name"):
        return jsonify({"error": "Groupe non défini"}), 401
    data = request.get_json(force=True, silent=True) or {}
    flag_text = (data.get("flag") or "").strip()
    if not flag_text:
        return jsonify({"error": "Flag vide"}), 400

    group_name = session["group_name"]
    group_id = get_or_create_group(group_name)

    phase = validate_flag(flag_text)
    correct = phase is not None

    with get_db() as conn:
        already = conn.execute(
            "SELECT id FROM flag_submissions WHERE group_id = ? AND correct = 1 AND phase = ?",
            (group_id, phase or ""),
        ).fetchone()
        if not already:
            conn.execute(
                "INSERT INTO flag_submissions (group_id, phase, flag_text, correct) VALUES (?,?,?,?)",
                (group_id, phase or "?", flag_text, int(correct)),
            )

    if correct:
        return jsonify({"correct": True, "phase": phase, "label": PHASE_LABELS[phase]})
    return jsonify({"correct": False})


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
        submissions = conn.execute(
            "SELECT group_id, phase, correct, submitted_at FROM flag_submissions ORDER BY submitted_at"
        ).fetchall()
        pvs = conn.execute(
            "SELECT group_id, filename, submitted_at FROM pv_uploads ORDER BY submitted_at"
        ).fetchall()

    found_by_group = {}
    for s in submissions:
        if s["correct"]:
            found_by_group.setdefault(s["group_id"], set()).add(s["phase"])

    pvs_by_group = {}
    for p in pvs:
        pvs_by_group.setdefault(p["group_id"], []).append(p)

    return render_template(
        "dashboard.html",
        groups=groups,
        phases=PHASE_LABELS,
        found_by_group=found_by_group,
        pvs_by_group=pvs_by_group,
        token=token,
    )


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=False)
