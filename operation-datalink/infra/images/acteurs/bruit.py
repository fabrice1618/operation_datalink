#!/usr/bin/env python3
"""Poste de bruit de fond - 10.13.37.40 (pc-it / support informatique).

But pedagogique : ajouter du trafic LEGITIME pour que l'enquete ne se resume
plus a un "strings | grep DATALINK". Il faut filtrer le signal du bruit.

Ce poste plante aussi UN faux jeton (leurre) dans un message anodin du chat.
Comme toutes les vraies preuves sont desormais encodees, ce leurre est le seul
litteral DATALINK{...} en clair dans les scelles : qui le rend sans
localisation coherente se fait piEger -- "la localisation fait foi".

Timeline :
  - resolutions DNS anodines (meteo, maj intranet)        -> scelle 02
  - consultation legitime de la messagerie interne (GET)  -> scelle 01
  - message anodin dans le chat, contenant le LEURRE      -> scelle 01
  - petit mail interne sans interet (SMTP)                -> scelle 01
"""
import socket
import smtplib
import time
import urllib.parse
import urllib.request
from email.message import EmailMessage

from dnslib import DNSRecord

SRV = "10.13.37.50"
DARKDROP = "10.13.37.200"

# Faux jeton (leurre) : reference d'archive anodine. Volontairement NON
# enregistre cote portail : sa soumission est rejetee.
DECOY = "DATALINK{ARCHIVE_SAUVEGARDE_2025}"


def dns_query(name, qtype="A", server=DARKDROP):
    q = DNSRecord.question(name, qtype)
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(5)
    try:
        s.sendto(q.pack(), (server, 53))
        s.recvfrom(4096)
    except socket.timeout:
        pass
    finally:
        s.close()


def http_get(path):
    req = urllib.request.Request("http://%s%s" % (SRV, path))
    urllib.request.urlopen(req, timeout=5).read()


def chat(auteur, texte):
    data = urllib.parse.urlencode({"auteur": auteur, "texte": texte}).encode()
    req = urllib.request.Request("http://%s/post" % SRV, data=data)
    urllib.request.urlopen(req, timeout=5).read()


def sleep_until(t0, offset):
    delay = offset - (time.time() - t0)
    if delay > 0:
        time.sleep(delay)


def main():
    t0 = time.time()

    # --- Trafic DNS anodin (cote passerelle, scelle 02) ---
    sleep_until(t0, 5)
    dns_query("meteo.example", "A")
    time.sleep(0.4)
    dns_query("maj.intranet.lan", "A")

    # --- Consultation legitime de la messagerie interne (scelle 01) ---
    sleep_until(t0, 15)
    try:
        http_get("/")
    except Exception:
        pass

    # --- Message anodin dans le chat : contient le LEURRE (scelle 01) ---
    sleep_until(t0, 24)
    try:
        chat("IT-Support", "Maintenance terminee. Reference d'archive de sauvegarde : " + DECOY)
    except Exception:
        pass

    # --- Petit mail interne sans interet (scelle 01) ---
    sleep_until(t0, 40)
    msg = EmailMessage()
    msg["From"] = "it-support@nordexport.lan"
    msg["To"] = "equipe@nordexport.lan"
    msg["Subject"] = "Sauvegarde hebdomadaire OK"
    msg.set_content("La sauvegarde de nuit s'est terminee sans erreur.\n")
    try:
        with smtplib.SMTP(SRV, 25, timeout=10) as s:
            s.send_message(msg)
    except Exception:
        pass

    print("bruit: termine")


if __name__ == "__main__":
    main()
