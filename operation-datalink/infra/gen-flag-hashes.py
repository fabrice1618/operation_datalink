#!/usr/bin/env python3
"""Génère le bloc d'environnement SHA-256 des flags pour docker-compose.yml.

Le portail ne connaît jamais les flags en clair : seule leur empreinte SHA-256
voyage dans l'infra (cf. evolution1.md, P1) — aucune fuite de source, même en
inspectant l'environnement du conteneur `portal`. Régénérez ce bloc dès qu'un
flag change, puis recollez-le dans le service `portal` de docker-compose.yml.

Usage :
    # directement en arguments « PHASE=FLAG » (ordre libre) :
    python3 gen-flag-hashes.py P0=DATALINK{PRISE_EN_MAIN_OK} P1=DATALINK{...}

    # ou en lisant un fichier « PHASE=FLAG » (une paire par ligne, non versionné) :
    python3 gen-flag-hashes.py --file flags.local

    # ou en pipant les paires sur l'entrée standard :
    echo 'P1=DATALINK{...}' | python3 gen-flag-hashes.py -
"""
import hashlib
import sys


def parse_pairs(tokens):
    pairs = []
    for tok in tokens:
        tok = tok.strip()
        if not tok or tok.startswith("#"):
            continue
        if "=" not in tok:
            sys.exit(f"format attendu PHASE=FLAG, reçu : {tok!r}")
        phase, flag = tok.split("=", 1)
        pairs.append((phase.strip().upper(), flag.strip()))
    return pairs


def main(argv):
    args = argv[1:]
    if not args:
        sys.exit(__doc__)

    if args[0] == "--file":
        if len(args) < 2:
            sys.exit("--file attend un chemin de fichier")
        with open(args[1], encoding="utf-8") as fh:
            pairs = parse_pairs(fh.readlines())
    elif args[0] == "-":
        pairs = parse_pairs(sys.stdin.readlines())
    else:
        pairs = parse_pairs(args)

    if not pairs:
        sys.exit("aucune paire PHASE=FLAG fournie")

    for phase, flag in pairs:
        digest = hashlib.sha256(flag.encode("utf-8")).hexdigest()
        print(f'      FLAG_{phase}_SHA256: "{digest}"')


if __name__ == "__main__":
    main(sys.argv)
