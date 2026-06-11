import os
import sqlite3
import pathlib
import markdown
from flask import (
    Flask, render_template, request, redirect, url_for,
    session, jsonify, abort, flash
)
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "datalink-portal-secret-2024")

ENONCE_DIR = pathlib.Path("/data/enonce")
DATA_DIR = pathlib.Path("/data")
PV_DIR = DATA_DIR / "pvs"
DB_PATH = DATA_DIR / "submissions.db"

ALLOWED_EXTENSIONS = {"pdf", "txt", "md", "odt", "docx"}

DASHBOARD_TOKEN = os.environ.get("DASHBOARD_TOKEN", "prof2024")

FLAGS = {
    "P1": os.environ.get("FLAG_P1", ""),
    "P2": os.environ.get("FLAG_P2", ""),
    "P3": os.environ.get("FLAG_P3", ""),
    "P4": os.environ.get("FLAG_P4", ""),
    "P5": os.environ.get("FLAG_P5", ""),
    "P6": os.environ.get("FLAG_P6", ""),
}

PHASE_LABELS = {
    "P1": "Réquisition 1 — Trafic HTTP",
    "P2": "Réquisition 2 — Exfiltration FTP",
    "P3": "Réquisition 3 — Extorsion SMTP",
    "P4": "Réquisition 4 — Intrusion Telnet",
    "P5": "Réquisition 5 — Tunnel DNS",
    "P6": "Phase 2 — Exfiltration en cours",
}

ENONCE_FILES = [
    ("00_briefing-juge.md", "Briefing du juge"),
    ("01_sujet-phase1.md", "Phase 1 — Réquisitions"),
    ("02_complement-juge-phase2.md", "Phase 2 — Complément"),
    ("modele-proces-verbal.md", "Modèle de procès-verbal"),
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


@app.route("/")
def index():
    return render_template("index.html", group=session.get("group_name"))


@app.route("/set-group", methods=["POST"])
def set_group():
    name = request.form.get("group_name", "").strip()
    if not name:
        flash("Le nom de groupe ne peut pas être vide.", "danger")
        return redirect(url_for("index"))
    if len(name) > 50:
        flash("Nom de groupe trop long (50 caractères max).", "danger")
        return redirect(url_for("index"))
    session["group_name"] = name
    return redirect(url_for("flags"))


@app.route("/enonce/")
def enonce_list():
    return render_template("enonce_list.html", files=ENONCE_FILES)


@app.route("/enonce/<slug>")
def enonce_view(slug):
    valid_slugs = [f[0] for f in ENONCE_FILES]
    if slug not in valid_slugs:
        abort(404)
    path = ENONCE_DIR / slug
    if not path.exists():
        abort(404)
    content_html = markdown.markdown(
        path.read_text(encoding="utf-8"),
        extensions=["tables", "fenced_code", "nl2br"],
    )
    label = next((f[1] for f in ENONCE_FILES if f[0] == slug), slug)
    return render_template(
        "enonce.html",
        content=content_html,
        label=label,
        files=ENONCE_FILES,
        current=slug,
    )


@app.route("/flags")
def flags():
    if not session.get("group_name"):
        flash("Veuillez d'abord saisir votre nom de groupe.", "warning")
        return redirect(url_for("index"))
    group_name = session["group_name"]
    group_id = get_or_create_group(group_name)
    with get_db() as conn:
        rows = conn.execute(
            "SELECT phase, correct FROM flag_submissions WHERE group_id = ? ORDER BY submitted_at",
            (group_id,),
        ).fetchall()
    found = {r["phase"] for r in rows if r["correct"]}
    return render_template("flags.html", phases=PHASE_LABELS, found=found, group=group_name)


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
    if not session.get("group_name"):
        flash("Veuillez d'abord saisir votre nom de groupe.", "warning")
        return redirect(url_for("index"))
    group_name = session["group_name"]
    group_id = get_or_create_group(group_name)
    with get_db() as conn:
        uploads = conn.execute(
            "SELECT filename, submitted_at FROM pv_uploads WHERE group_id = ? ORDER BY submitted_at DESC",
            (group_id,),
        ).fetchall()
    return render_template("pv.html", group=group_name, uploads=uploads)


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
