#!/usr/bin/env python3
"""Génère le bloc d'environnement SHA-256 des champs de la réquisition 1.

Depuis cette version, R1 n'est plus une chasse au jeton : l'étudiant relève
quatre faits lus dans le chat HTTP (scellé 01). Le portail ne connaît jamais la
réponse en clair, seulement l'empreinte de sa forme **normalisée** — la même
normalisation que `app.py` (`_normalize` / `_normalize_suspects`). Gardez les
deux en phase si vous modifiez la normalisation.

Plusieurs réponses sont admises par champ (variantes de saisie) : chaque champ
produit donc une liste d'empreintes séparées par des espaces, à recoller dans le
service `portal` de docker-compose.yml (FLAG_P1_<CHAMP>_SHA256).

Usage :
    python3 gen-r1-hashes.py            # valeurs de référence du scénario
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
FIELDS = {
    "SUSPECTS":     ([normalize_suspects("Sofia Lenoir, Marc Vidal")]),
    "TRANSPORTEUR": [normalize(v) for v in ("Transports Caron", "Caron")],
    "DATE":         [normalize(v) for v in ("14/05/2026", "14/5/2026", "14 mai 2026")],
    "COLIS":        [normalize(v) for v in ("NX-4417", "nx4417")],
}


def main():
    for field, canon in FIELDS.items():
        hashes = " ".join(h(v) for v in canon)
        print(f'      FLAG_P1_{field}_SHA256: "{hashes}"')


if __name__ == "__main__":
    main()
