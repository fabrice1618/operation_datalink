#!/usr/bin/env bash
#
# Genere les scellTs PCAP : demarre les serveurs, lance les sondes tcpdump,
# rejoue le scenario via les postes acteurs, puis arrete proprement la capture
# et copie les .pcap dans scelles/.
#
# L'infrastructure (srv + darkdrop) reste ensuite disponible pour la phase 2.
set -euo pipefail

cd "$(dirname "$0")/infra"

echo "[*] Construction des images..."
docker compose build

echo "[*] Nettoyage d'une eventuelle execution precedente..."
docker compose down -v --remove-orphans >/dev/null 2>&1 || true
rm -f capture/*.pcap

echo "[*] Demarrage des serveurs (srv, darkdrop)..."
docker compose up -d --wait srv darkdrop

echo "[*] Demarrage des sondes de capture..."
docker compose up -d cap-srv cap-darkdrop
sleep 4   # laisse tcpdump s'initialiser avant le premier paquet utile

echo "[*] Rejeu du scenario (postes acteurs)..."
docker compose up -d poste-sofia poste-marc poste-intrus

echo "[*] Attente de la fin du scenario..."
docker wait datalink-poste-sofia datalink-poste-marc datalink-poste-intrus >/dev/null
sleep 3   # flush des derniers paquets

echo "[*] Arret des sondes..."
docker compose stop cap-srv cap-darkdrop >/dev/null

echo "[*] Copie des scelles..."
cp capture/scelle-01_serveur-interne.pcap ../scelles/
cp capture/scelle-02_passerelle.pcap      ../scelles/

echo
echo "[+] Scelles generes :"
ls -lh ../scelles/*.pcap
echo
echo "[i] Les serveurs srv et darkdrop tournent toujours (phase 2)."
echo "    Arret complet : (cd infra && docker compose down -v)"
