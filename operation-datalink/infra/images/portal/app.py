import os
import re
import json
import hashlib
import sqlite3
import pathlib
import unicodedata
import markdown
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from flask import (
    Flask, render_template, request, redirect, url_for,
    session, jsonify, abort, flash, send_from_directory
)

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

DASHBOARD_TOKEN = os.environ.get("DASHBOARD_TOKEN", "prof2024")
ACCESS_CODE = os.environ.get("ACCESS_CODE", "DATALINK-2026")

# Scénario à deux phases. La phase 2 (réquisition P6) exige l'infra Docker live,
# inaccessible à certains étudiants : désactivée par défaut, le portail se limite
# alors à la phase 1 (analyse des scellés PCAP). Activer avec PHASE2_ENABLED=1.
PHASE2_ENABLED = os.environ.get("PHASE2_ENABLED", "0") == "1"

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

# Réquisitions « relevé d'enquête » — depuis cette version, toute la phase 1 (R1 à
# R5) relève des faits lus dans le flux plutôt qu'une chasse au jeton :
#   R1 — chat HTTP (scellé 01)        R2 — transfert FTP (scellé 02)
#   R3 — e-mail SMTP (scellé 01)      R4 — scan + telnet (scellé 01)
#   R5 — canal caché DNS (scellé 02)
# Chaque champ a sa propre empreinte ; l'étape n'est validée (et versée au
# classement) que lorsque TOUS ses champs sont corrects, et seuls les champs
# corrects sont verrouillés.
#
# Format d'un champ : (clé, libellé, indice, exemple). Les clés sont uniques
# toutes réquisitions confondues (la table r1_fields est partagée).
RELEVE_FIELDS = {
    "P1": [
        ("suspects",     "Noms des suspects",
         "Les deux personnes qui coordonnent la livraison — prénom + nom, séparés par une virgule.",
         "Prénom Nom, Prénom Nom"),
        ("transporteur", "Transporteur",
         "La société chargée d'acheminer la marchandise.",
         "Société"),
        ("date",         "Date de chargement",
         "Au format JJ/MM/AAAA.",
         "JJ/MM/AAAA"),
        ("colis",        "Numéro de colis",
         "La référence du colis, telle qu'écrite dans le chat.",
         "réf. colis"),
    ],
    "P2": [
        ("clients",    "Clients impactés",
         "Le nombre d'enregistrements de clients contenus dans le fichier reconstitué.",
         "nombre"),
        ("ftp_user",   "Identifiant FTP",
         "Le compte utilisé pour ouvrir la session sur le serveur de dépôt.",
         "login"),
        ("ftp_pass",   "Mot de passe FTP",
         "Le mot de passe transmis en clair sur le canal de contrôle.",
         "mot de passe"),
        ("ip_serveur", "IP du serveur",
         "L'adresse du serveur externe qui reçoit le fichier (destination du transfert).",
         "0.0.0.0"),
        ("ip_user",    "IP de l'utilisateur",
         "L'adresse du poste interne qui envoie le fichier (source du transfert).",
         "0.0.0.0"),
    ],
    "P3": [
        ("destinataire", "Destinataire du mail",
         "L'adresse à qui le message de menace est adressé (RCPT TO).",
         "nom@domaine"),
        ("montant",      "Montant exigé",
         "La somme réclamée, en chiffres (lue dans la pièce jointe décodée).",
         "nombre"),
        ("crypto",       "Mode de paiement",
         "La monnaie dans laquelle la rançon doit être versée.",
         "monnaie"),
        ("delai",        "Délai imparti",
         "Le temps laissé pour répondre aux conditions.",
         "ex. 24 heures"),
        ("piece_jointe", "Nom de la pièce jointe",
         "Le nom de fichier joint au message (en-tête de la pièce jointe).",
         "fichier.ext"),
    ],
    "P4": [
        ("ip_intrus",  "IP de l'intrus",
         "L'adresse de la machine qui scanne puis se connecte au serveur.",
         "0.0.0.0"),
        ("nb_ports",   "Ports scannés",
         "Le nombre de ports testés par la machine pendant la reconnaissance.",
         "nombre"),
        ("admin_user", "Identifiant d'administration",
         "Le compte utilisé pour ouvrir la session telnet sur le serveur.",
         "login"),
        ("admin_pass", "Mot de passe",
         "Le mot de passe transmis en clair lors de la connexion telnet.",
         "mot de passe"),
    ],
    "P5": [
        ("c2_domaine",     "Domaine du C2",
         "Le domaine du serveur externe avec lequel le poste dialogue.",
         "domaine.tld"),
        ("c2_ip",          "IP résolue du C2",
         "L'adresse IP renvoyée pour ce domaine (réponse A).",
         "0.0.0.0"),
        ("dns_type",       "Type d'enregistrement détourné",
         "Le type de requête DNS qui sert de canal caché.",
         "ex. A / TXT / MX"),
        ("c2_sousdomaine", "Sous-domaine de contrôle",
         "Le nom complet interrogé pour le canal caché (FQDN).",
         "sous.domaine.tld"),
        ("c2_ordre",       "Ordre transmis (champ key=)",
         "La valeur du champ key= de la réponse TXT, décodée du base64.",
         "valeur décodée"),
    ],
}
RELEVE_FIELD_KEYS = {p: [k for k, *_ in fields] for p, fields in RELEVE_FIELDS.items()}


def _load_releve_hashes(phase: str, field: str) -> set:
    """Empreintes SHA-256 acceptées pour un champ de relevé.

    On admet plusieurs valeurs par champ (variantes de saisie : 14/05/2026 ou
    « 14 mai 2026 »…), séparées par des espaces/virgules dans la variable
    d'environnement FLAG_<PHASE>_<CHAMP>_SHA256. Comme pour les jetons, le portail
    ne connaît jamais la réponse en clair, seulement son empreinte normalisée.
    """
    raw = os.environ.get(f"FLAG_{phase}_{field.upper()}_SHA256", "")
    return {h.strip().lower() for h in re.split(r"[\s,]+", raw) if h.strip()}


RELEVE_FIELD_HASHES = {
    phase: {k: _load_releve_hashes(phase, k) for k in keys}
    for phase, keys in RELEVE_FIELD_KEYS.items()
}

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

# ── Procès-verbal saisi dans la plateforme ──────────────────────────────────
# Le PV n'est plus un fichier déposé : il est saisi en ligne (faits déjà validés
# + raisonnement libre) puis regénéré pour le juge. Tout le raisonnement est lu
# par l'enseignant (jamais auto-noté), stocké en clair dans la table pv_fields.
#
# Narratif rattaché à chaque preuve P1–P5 (saisi sur l'écran « Preuves »).
PV_NARRATIVE = [
    ("localisation", "Localisation",
     "N° de trame, protocole, IP src→dst, port, horodatage."),
    ("infraction", "Infraction caractérisée",
     "Quelle infraction cette preuve établit-elle ?"),
]
# En-tête du PV (saisi sur l'écran « Procès-verbal »).
PV_ENTETE = [
    ("enqueteurs", "Enquêteurs (binôme)", "Prénom Nom, Prénom Nom"),
    ("outils", "Outils utilisés", "Wireshark, tcpdump, nmap…"),
]
# Grilles tabulaires : lignes fixes côté formulaire, sérialisées en JSON en base.
PV_PROTAGONISTES_COLS = [
    ("ip", "Adresse IP"), ("mac", "Adresse MAC"),
    ("hote", "Nom / hôte"), ("role", "Rôle présumé"),
]
PV_TIMELINE_COLS = [
    ("ts", "Horodatage"), ("acteur", "Acteur (IP)"),
    ("action", "Action observée"), ("scelle", "Scellé"),
]
PV_PROTAGONISTES_ROWS = 6
PV_TIMELINE_ROWS = 8

# Clés de pv_fields que l'étudiant peut écrire via /api/pv-field (autosave). Les
# faits reproduits (fact_*) sont écrits côté serveur par api_releve, hors de cette
# liste blanche.
PV_WRITABLE_FIELDS = (
    {f"entete_{k}" for k, *_ in PV_ENTETE}
    | {f"{p}_{k}" for p in PHASE_GROUPS[1] for k, *_ in PV_NARRATIVE}
    | {"protagonistes_json", "timeline_json", "synthese"}
)

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
# Les étapes « Phase 2 » ne sont insérées que si le scénario à deux phases est
# activé (cf. PHASE2_ENABLED) ; sinon le parcours s'arrête à la phase 1.
PIPELINE = [
    ("saisine",       "Saisine"),
    ("prise_en_main", "Prise en main"),
    ("requisitions",  "Réquisitions"),
    ("preuves",       "Preuves P1" if PHASE2_ENABLED else "Preuves"),
]
if PHASE2_ENABLED:
    PIPELINE += [
        ("phase2",   "Phase 2"),
        ("preuves2", "Preuves P2"),
    ]
PIPELINE += [
    ("pv",  "Procès-verbal"),
    ("fin", "Fin"),
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
            -- Champs de relevé correctement versés (présence = champ validé).
            -- Partagée par toutes les réquisitions « relevé d'enquête » (R1 à R5) ;
            -- les clés de champ sont uniques d'une réquisition à l'autre. L'étape
            -- n'entre dans flag_submissions que lorsque TOUS les champs de la
            -- réquisition sont présents pour l'équipe.
            CREATE TABLE IF NOT EXISTS r1_fields (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                group_id INTEGER NOT NULL,
                field TEXT NOT NULL,
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(group_id, field),
                FOREIGN KEY (group_id) REFERENCES groups(id)
            );
            -- Champs libres du procès-verbal saisi en ligne (un par clé). Texte
            -- lu par le juge ; UPSERT à chaque autosave. Contient aussi les faits
            -- validés reproduits (clés fact_*), écrits par api_releve.
            CREATE TABLE IF NOT EXISTS pv_fields (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                group_id INTEGER NOT NULL,
                field TEXT NOT NULL,
                value TEXT NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(group_id, field),
                FOREIGN KEY (group_id) REFERENCES groups(id)
            );
            -- Marque le PV comme transmis au juge (remplace le décompte d'uploads).
            CREATE TABLE IF NOT EXISTS pv_submitted (
                group_id INTEGER PRIMARY KEY,
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


def _normalize(text: str) -> str:
    """Met une réponse libre sous forme canonique pour la comparaison.

    Insensible à la casse, aux accents et aux espaces multiples ; retire la
    ponctuation de bord. Les empreintes attendues sont calculées sur cette même
    forme (cf. gen-releve-hashes.py) : « Transports Caron », « transports  caron » et
    « TRANSPORTS CARON. » sont donc équivalents.
    """
    s = unicodedata.normalize("NFKD", text)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.lower().strip()
    s = re.sub(r"\s+", " ", s)
    return s.strip(" \t\r\n.,;:!?\"'`")


def _normalize_suspects(text: str) -> str:
    """Forme canonique d'une liste de noms, indépendante de l'ordre.

    Découpe sur les séparateurs usuels (virgule, « et », « & »…), normalise
    chaque nom, trie puis recolle : « Sofia Lenoir, Marc Vidal » et
    « Marc Vidal et Sofia Lenoir » donnent la même empreinte.
    """
    parts = re.split(r"[,;/&\n]+|\bet\b", text, flags=re.IGNORECASE)
    names = sorted(n for n in (_normalize(p) for p in parts) if n)
    return "|".join(names)


def validate_releve_field(phase: str, field: str, value: str) -> bool:
    """Vrai si la réponse d'un champ de relevé correspond à une empreinte attendue."""
    expected = RELEVE_FIELD_HASHES.get(phase, {}).get(field)
    if not expected:
        return False
    canon = _normalize_suspects(value) if field == "suspects" else _normalize(value)
    return bool(canon) and sha256_hex(canon) in expected


def render_md(slug: str) -> str:
    """Rend un fichier d'énoncé en HTML."""
    path = ENONCE_DIR / slug
    if not path.exists():
        abort(404)
    return markdown.markdown(
        path.read_text(encoding="utf-8"),
        extensions=["tables", "fenced_code", "nl2br"],
    )


def releve_solved_fields(group_id: int) -> set:
    """Ensemble des champs de relevé déjà validés par l'équipe (toutes réquisitions)."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT field FROM r1_fields WHERE group_id = ?", (group_id,)
        ).fetchall()
    return {r["field"] for r in rows}


def found_phases(group_name: str) -> set:
    """Ensemble des phases déjà validées par l'équipe."""
    return found_phases_by_id(get_or_create_group(group_name))


def found_phases_by_id(group_id: int) -> set:
    """Ensemble des phases validées par l'équipe (par identifiant)."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT phase FROM flag_submissions WHERE group_id = ? AND correct = 1",
            (group_id,),
        ).fetchall()
    return {r["phase"] for r in rows}


# ── Procès-verbal : lecture / écriture des champs saisis ────────────────────
def pv_get_fields(group_id: int) -> dict:
    """Tous les champs de PV de l'équipe, en {field: value}."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT field, value FROM pv_fields WHERE group_id = ?", (group_id,)
        ).fetchall()
    return {r["field"]: r["value"] for r in rows}


def pv_save_field(group_id: int, field: str, value: str) -> None:
    """UPSERT d'un champ de PV (texte libre)."""
    with get_db() as conn:
        conn.execute(
            "INSERT INTO pv_fields (group_id, field, value) VALUES (?,?,?) "
            "ON CONFLICT(group_id, field) DO UPDATE SET "
            "value = excluded.value, updated_at = CURRENT_TIMESTAMP",
            (group_id, field, value),
        )


def pv_submitted_at(group_id: int):
    """Horodatage SQLite (UTC) de transmission du PV, ou None."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT submitted_at FROM pv_submitted WHERE group_id = ?", (group_id,)
        ).fetchone()
    return row["submitted_at"] if row else None


def _pv_grid_rows(raw, cols, pad_to: int = 0):
    """Décode une grille JSON en lignes normalisées (une ligne = dict de colonnes).

    Tolère un JSON absent/invalide. Avec pad_to > 0, complète jusqu'à N lignes
    (pour préremplir un formulaire) ; sinon ne garde que les lignes non vides
    (pour l'affichage du PV).
    """
    keys = [k for k, _ in cols]
    try:
        rows = json.loads(raw or "[]")
    except (ValueError, TypeError):
        rows = []
    norm = []
    for r in rows:
        cells = {k: ((r.get(k) if isinstance(r, dict) else "") or "").strip() for k in keys}
        if pad_to or any(cells.values()):
            norm.append(cells)
    while len(norm) < pad_to:
        norm.append({k: "" for k in keys})
    return norm


def build_pv_context(group_id: int) -> dict:
    """Assemble le PV complet d'une équipe pour l'affichage (étudiant + juge)."""
    fields = pv_get_fields(group_id)
    solved = found_phases_by_id(group_id)
    preuves = []
    for phase in PHASE_GROUPS[1]:
        faits = [
            {"label": fname, "value": fields.get(f"fact_{phase}_{key}", "")}
            for key, fname, *_ in RELEVE_FIELDS.get(phase, [])
        ]
        preuves.append({
            "phase": phase,
            "label": PHASE_LABELS[phase],
            "faits": faits,
            "localisation": fields.get(f"{phase}_localisation", ""),
            "infraction": fields.get(f"{phase}_infraction", ""),
            "solved": phase in solved,
        })
    sub = pv_submitted_at(group_id)
    return {
        "entete": {k: fields.get(f"entete_{k}", "") for k, *_ in PV_ENTETE},
        "entete_def": PV_ENTETE,
        "protagonistes": _pv_grid_rows(fields.get("protagonistes_json"), PV_PROTAGONISTES_COLS),
        "protag_cols": PV_PROTAGONISTES_COLS,
        "preuves": preuves,
        "timeline": _pv_grid_rows(fields.get("timeline_json"), PV_TIMELINE_COLS),
        "timeline_cols": PV_TIMELINE_COLS,
        "synthese": fields.get("synthese", ""),
        "submitted_at": to_local(sub) if sub else None,
        "generated_at": datetime.now(LOCAL_TZ).strftime("%Y-%m-%d %H:%M:%S"),
    }


# Preuves comptabilisées au classement (l'entraînement P0 reste hors-concours ;
# la phase 2 / P6 n'entre au score que si le scénario à deux phases est activé).
SCORED_PHASES = PHASE_GROUPS[1] + (PHASE_GROUPS[2] if PHASE2_ENABLED else [])


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


@app.route("/aide/modele-pv")
def aide_modele_pv():
    redir = require_group()
    if redir:
        return redir
    return render_template(
        "guide.html",
        group=session["group_name"],
        title="Modèle de procès-verbal",
        subhead="aide-mémoire — à préparer avant la saisie",
        content=render_md("modele-proces-verbal.md"),
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
    group_id = get_or_create_group(group)
    phases = {p: PHASE_LABELS[p] for p in PHASE_GROUPS[1]}
    found = found_phases(group) & set(phases)
    return render_template(
        "preuves.html",
        title="Saisie des preuves — Phase 1",
        phases=phases, found=found, group=group, phase_num=1, cells=24,
        releve_fields=RELEVE_FIELDS, releve_done=releve_solved_fields(group_id),
        pv_narrative=PV_NARRATIVE, pv_fields=pv_get_fields(group_id),
    )


@app.route("/phase2")
def phase2():
    if not PHASE2_ENABLED:
        abort(404)
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
    if not PHASE2_ENABLED:
        abort(404)
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


@app.route("/api/releve", methods=["POST"])
def api_releve():
    """Validation des faits d'une réquisition « relevé d'enquête » (R1 à R5).

    Chaque champ est vérifié indépendamment : seuls les champs corrects sont
    enregistrés (donc verrouillés). L'étape n'est versée au dossier (et au
    classement) que lorsque TOUS les champs de la réquisition sont validés.
    """
    if not session.get("group_name"):
        return jsonify({"error": "Groupe non défini"}), 401
    data = request.get_json(force=True, silent=True) or {}
    phase = (data.get("phase") or "").strip().upper()
    fields = data.get("fields")
    if phase not in RELEVE_FIELDS or not isinstance(fields, dict):
        return jsonify({"error": "Requête invalide"}), 400

    phase_keys = RELEVE_FIELD_KEYS[phase]
    group_id = get_or_create_group(session["group_name"])
    results = {}
    with get_db() as conn:
        rows = conn.execute(
            "SELECT field FROM r1_fields WHERE group_id = ?", (group_id,)
        ).fetchall()
        solved = {r["field"] for r in rows}

        for key in phase_keys:
            if key in solved:
                results[key] = True            # déjà acquis : verrouillé
                continue
            value = (fields.get(key) or "").strip()
            if not value:
                results[key] = None            # non soumis cette fois
                continue
            ok = validate_releve_field(phase, key, value)
            results[key] = ok
            if ok:
                conn.execute(
                    "INSERT OR IGNORE INTO r1_fields (group_id, field) VALUES (?,?)",
                    (group_id, key),
                )
                # Reproduit le fait trouvé (en clair) pour le procès-verbal généré.
                conn.execute(
                    "INSERT INTO pv_fields (group_id, field, value) VALUES (?,?,?) "
                    "ON CONFLICT(group_id, field) DO UPDATE SET "
                    "value = excluded.value, updated_at = CURRENT_TIMESTAMP",
                    (group_id, f"fact_{phase}_{key}", value),
                )
                solved.add(key)

        all_correct = set(phase_keys) <= solved
        if all_correct:
            # On verse l'étape au dossier (et au classement) une seule fois.
            done = conn.execute(
                "SELECT id FROM flag_submissions WHERE group_id = ? AND correct = 1 AND phase = ?",
                (group_id, phase),
            ).fetchone()
            if not done:
                conn.execute(
                    "INSERT INTO flag_submissions (group_id, phase, flag_text, correct) VALUES (?,?,?,?)",
                    (group_id, phase, sha256_hex(f"{phase}_FIELDS_OK"), 1),
                )

    return jsonify({
        "results": results,
        "solved": sorted(solved & set(phase_keys)),
        "all_correct": all_correct,
        "phase": phase,
        "label": PHASE_LABELS[phase],
    })


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
    # Les réquisitions « relevé d'enquête » (R1 à R5) ne sont plus des chasses au
    # jeton : elles passent par /api/releve, pas par la soumission de jeton.
    if phase in RELEVE_FIELDS:
        return jsonify({"error": "Cette réquisition se valide via son formulaire d'enquête."}), 400

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
    fields = pv_get_fields(group_id)
    sub = pv_submitted_at(group_id)
    return render_template(
        "pv.html",
        group=group,
        fields=fields,
        entete=PV_ENTETE,
        protag_cols=PV_PROTAGONISTES_COLS,
        protag_rows=_pv_grid_rows(fields.get("protagonistes_json"), PV_PROTAGONISTES_COLS, PV_PROTAGONISTES_ROWS),
        timeline_cols=PV_TIMELINE_COLS,
        timeline_rows=_pv_grid_rows(fields.get("timeline_json"), PV_TIMELINE_COLS, PV_TIMELINE_ROWS),
        submitted_at=to_local(sub) if sub else None,
    )


@app.route("/api/pv-field", methods=["POST"])
def api_pv_field():
    """Autosave d'un champ de PV (texte libre ou grille JSON)."""
    if not session.get("group_name"):
        return jsonify({"error": "Groupe non défini"}), 401
    data = request.get_json(force=True, silent=True) or {}
    field = (data.get("field") or "").strip()
    value = data.get("value")
    if field not in PV_WRITABLE_FIELDS or not isinstance(value, str):
        return jsonify({"error": "Champ invalide"}), 400
    group_id = get_or_create_group(session["group_name"])
    pv_save_field(group_id, field, value.strip())
    return jsonify({"ok": True, "field": field})


@app.route("/api/pv-submit", methods=["POST"])
def api_pv_submit():
    """Marque le PV de l'équipe comme transmis au juge (idempotent)."""
    if not session.get("group_name"):
        return jsonify({"error": "Groupe non défini"}), 401
    group_id = get_or_create_group(session["group_name"])
    with get_db() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO pv_submitted (group_id) VALUES (?)", (group_id,)
        )
    sub = pv_submitted_at(group_id)
    return jsonify({"ok": True, "submitted_at": to_local(sub) if sub else None})


@app.route("/pv/apercu")
def pv_apercu():
    redir = require_group()
    if redir:
        return redir
    group = session["group_name"]
    group_id = get_or_create_group(group)
    return render_template("pv_apercu.html", group=group, pv=build_pv_context(group_id))


@app.route("/dashboard/pv/<int:group_id>")
def dashboard_pv(group_id):
    if request.args.get("token", "") != DASHBOARD_TOKEN:
        abort(403)
    with get_db() as conn:
        row = conn.execute("SELECT name FROM groups WHERE id = ?", (group_id,)).fetchone()
    if not row:
        abort(404)
    return render_template("pv_apercu.html", group=row["name"], pv=build_pv_context(group_id))


@app.route("/fin")
def fin():
    redir = require_group()
    if redir:
        return redir
    group = session["group_name"]
    group_id = get_or_create_group(group)
    found = found_phases(group)
    pv_done = pv_submitted_at(group_id) is not None
    p1_found = found & set(PHASE_GROUPS[1])
    p2_found = found & set(PHASE_GROUPS[2])
    # En mode une phase, la phase 2 / P6 disparaît du récapitulatif des scellés.
    phases = dict(PHASE_LABELS)
    if not PHASE2_ENABLED:
        for p in PHASE_GROUPS[2]:
            phases.pop(p, None)
    return render_template(
        "fin.html",
        group=group,
        phases=phases,
        phase_groups=PHASE_GROUPS,
        found=found,
        p1_count=len(p1_found), p1_total=len(PHASE_GROUPS[1]),
        p2_count=len(p2_found), p2_total=len(PHASE_GROUPS[2]),
        pv_done=pv_done,
        phase2_enabled=PHASE2_ENABLED,
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
        subs = conn.execute("SELECT group_id, submitted_at FROM pv_submitted").fetchall()

    solves, first_blood = gather_solves()
    board = ranked_scoreboard(groups, solves)

    pv_submitted = {s["group_id"]: to_local(s["submitted_at"]) for s in subs}

    return render_template(
        "dashboard.html",
        groups=groups,
        board=board,
        phases={p: PHASE_LABELS[p] for p in SCORED_PHASES},
        solves=solves,
        first_blood=first_blood,
        pv_submitted=pv_submitted,
        token=token,
    )


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=False)
