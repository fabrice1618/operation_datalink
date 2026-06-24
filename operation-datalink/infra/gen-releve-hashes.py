#!/usr/bin/env python3
"""Génère le bloc d'environnement SHA-256 des champs des réquisitions « relevé ».

Depuis cette version, toute la phase 1 (R1 à R5) relève des faits lus dans le flux
au lieu de chasser un jeton :
  R1 — chat HTTP (scellé 01)     R2 — transfert FTP (scellé 02)
  R3 — e-mail SMTP (scellé 01)   R4 — scan + telnet (scellé 01)
  R5 — canal caché DNS (scellé 02)
Le portail ne connaît jamais la réponse en clair, seulement l'empreinte de sa
forme **normalisée** — la même normalisation que `app.py` (`_normalize` /
`_normalize_suspects`). Gardez les deux en phase si vous modifiez la normalisation.

Plusieurs réponses sont admises par champ (variantes de saisie) : chaque champ
produit donc une liste d'empreintes séparées par des espaces, à recoller dans le
service `portal` de docker-compose.yml (FLAG_<PHASE>_<CHAMP>_SHA256).

Usage :
    python3 gen-releve-hashes.py            # valeurs de référence du scénario
"""
import hashlib
import re
import unicodedata


def normalize(text: str) -> str:
    s = unicodedata.normalize("NFKD", text)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.lower().strip()
    s = re.sub(r"\s+", " ", s)
    return s.strip(" \t\r\n.,;:!?\"'`")


def normalize_suspects(text: str) -> str:
    parts = re.split(r"[,;/&\n]+|\bet\b", text, flags=re.IGNORECASE)
    names = sorted(n for n in (normalize(p) for p in parts) if n)
    return "|".join(names)


def h(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


# Réponses de référence du scénario (modifiez ici, puis régénérez le bloc).
# La 1re variante de chaque champ est la forme « officielle » attendue.
RELEVE = {
    "P1": {
        "SUSPECTS":     [normalize_suspects("Sofia Lenoir, Marc Vidal")],
        "TRANSPORTEUR": [normalize(v) for v in ("Transports Caron", "Caron")],
        "DATE":         [normalize(v) for v in ("14/05/2026", "14/5/2026", "14 mai 2026")],
        "COLIS":        [normalize(v) for v in ("NX-4417", "nx4417")],
    },
    "P2": {
        "CLIENTS":    [normalize("10")],
        "FTP_USER":   [normalize("depot")],
        "FTP_PASS":   [normalize("Pr1nt3mps2026!")],
        "IP_SERVEUR": [normalize("10.13.37.200")],
        "IP_USER":    [normalize("10.13.37.10")],
    },
    "P3": {
        "DESTINATAIRE": [normalize("directeur@groupe-rival.example")],
        "MONTANT":      [normalize(v) for v in ("50000", "50 000")],
        "CRYPTO":       [normalize(v) for v in ("BTC", "bitcoin")],
        "DELAI":        [normalize(v) for v in ("72 heures", "72h", "72 h", "72")],
        "PIECE_JOINTE": [normalize("conditions_diffusion.txt")],
    },
    "P4": {
        "IP_INTRUS":  [normalize("10.13.37.66")],
        "NB_PORTS":   [normalize(v) for v in ("101", "102")],
        "ADMIN_USER": [normalize("admin")],
        "ADMIN_PASS": [normalize("Adm1n-NordExport!")],
    },
    "P5": {
        "C2_DOMAINE":     [normalize("darkdrop-exchange.net")],
        "C2_IP":          [normalize("10.13.37.200")],
        "DNS_TYPE":       [normalize("TXT")],
        "C2_SOUSDOMAINE": [normalize("status.darkdrop-exchange.net")],
        "C2_ORDRE":       [normalize(v) for v in ("purge-journaux", "purge journaux", "purge-logs")],
    },
}


def main():
    for phase, fields in RELEVE.items():
        for field, canon in fields.items():
            hashes = " ".join(h(v) for v in canon)
            print(f'      FLAG_{phase}_{field}_SHA256: "{hashes}"')


if __name__ == "__main__":
    main()
