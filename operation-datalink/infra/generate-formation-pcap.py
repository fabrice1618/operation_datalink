#!/usr/bin/env python3
"""Génère le scellé d'entraînement de la Réquisition 0 (prise en main guidée).

Produit une mini-capture déterministe d'une vingtaine de secondes contenant :
  - un échange ICMP (ping / pong) ;
  - une résolution DNS (requête A + réponse) ;
  - un échange HTTP complet (poignée de main TCP, GET, 200 OK, fermeture) dont
    la réponse transporte un fichier `indice-formation.txt` contenant le jeton
    d'entraînement DATALINK{PRISE_EN_MAIN_OK}.

Le flux TCP est construit avec des numéros de séquence cohérents afin que, dans
Wireshark, « Suivre le flux TCP » ET « Exporter des objets → HTTP » fonctionnent.

Cette capture est PRÉ-GÉNÉRÉE et versionnée : elle ne dépend pas de l'infra Docker.
Pour la régénérer :

    pip install scapy
    python3 infra/generate-formation-pcap.py

Le pcap est écrit dans infra/capture/ (servi par le portail) puis copié dans scelles/.
"""
import datetime
import pathlib
import shutil

from scapy.all import (
    Ether, IP, TCP, UDP, ICMP, DNS, DNSQR, DNSRR, Raw, wrpcap,
)

# --- Acteurs de la capture d'entraînement (réseau familier 10.13.37.0/24) ---
POSTE_IP = "10.13.37.30"          # poste stagiaire
SRV_IP = "10.13.37.50"            # serveur interne (web + résolveur ici)
POSTE_MAC = "02:42:0a:0d:25:1e"
SRV_MAC = "02:42:0a:0d:25:32"

NAME = "intranet.nordexport.lan"
OBJET = "/formation/indice-formation.txt"
FLAG = "DATALINK{PRISE_EN_MAIN_OK}"

# Horodatage de base déterministe (capture reproductible à l'identique).
BASE = datetime.datetime(2026, 6, 10, 9, 0, 0, tzinfo=datetime.timezone.utc).timestamp()

OUT_NAME = "scelle-00_formation.pcap"


def eth(src, dst):
    return Ether(src=src, dst=dst)


def from_poste():
    return eth(POSTE_MAC, SRV_MAC) / IP(src=POSTE_IP, dst=SRV_IP)


def from_srv():
    return eth(SRV_MAC, POSTE_MAC) / IP(src=SRV_IP, dst=POSTE_IP)


def build():
    pkts = []

    def add(pkt, offset):
        pkt.time = BASE + offset
        pkts.append(pkt)

    # ------------------------------------------------------------------ ICMP
    add(from_poste() / ICMP(type=8, id=0x4242, seq=1) / Raw(b"datalink-formation"), 0.00)
    add(from_srv() / ICMP(type=0, id=0x4242, seq=1) / Raw(b"datalink-formation"), 0.04)

    # ------------------------------------------------------------------- DNS
    dns_q = DNS(id=0x1234, rd=1, qd=DNSQR(qname=NAME, qtype="A"))
    add(from_poste() / UDP(sport=51000, dport=53) / dns_q, 8.00)
    dns_r = DNS(
        id=0x1234, qr=1, aa=1, rd=1, ra=1,
        qd=DNSQR(qname=NAME, qtype="A"),
        an=DNSRR(rrname=NAME, type="A", ttl=300, rdata=SRV_IP),
    )
    add(from_srv() / UDP(sport=53, dport=51000) / dns_r, 8.05)

    # ------------------------------------------------------------------ HTTP
    sport = 49555
    # Numéros de séquence relatifs lisibles (Wireshark les normalise de toute façon).
    c_isn = 1000
    s_isn = 5000

    request = (
        "GET %s HTTP/1.1\r\n"
        "Host: %s\r\n"
        "User-Agent: Mozilla/5.0 (X11; Linux x86_64)\r\n"
        "Accept: */*\r\n"
        "Connection: close\r\n"
        "\r\n" % (OBJET, NAME)
    ).encode("ascii")

    body = (
        "SCELLE D'ENTRAINEMENT - OPERATION DATALINK\r\n"
        "==========================================\r\n"
        "\r\n"
        "Felicitations : vous maitrisez les 4 gestes\r\n"
        "(filtrer / suivre le flux / exporter un objet / lire le jeton).\r\n"
        "\r\n"
        "Jeton d'entrainement a reporter dans l'auto-verification :\r\n"
        "%s\r\n" % FLAG
    ).encode("ascii")
    response = (
        "HTTP/1.1 200 OK\r\n"
        "Server: NordExport-Intranet/1.0\r\n"
        "Content-Type: text/plain; charset=utf-8\r\n"
        "Content-Length: %d\r\n"
        "Content-Disposition: attachment; filename=\"indice-formation.txt\"\r\n"
        "Connection: close\r\n"
        "\r\n"
    ).encode("ascii") % len(body) + body

    def cli(seq, ack, flags, payload=None, t=0.0):
        seg = from_poste() / TCP(sport=sport, dport=80, flags=flags, seq=seq, ack=ack)
        if payload is not None:
            seg = seg / Raw(payload)
        add(seg, t)

    def srv(seq, ack, flags, payload=None, t=0.0):
        seg = from_srv() / TCP(sport=80, dport=sport, flags=flags, seq=seq, ack=ack)
        if payload is not None:
            seg = seg / Raw(payload)
        add(seg, t)

    lg = len(request)
    lr = len(response)

    # Poignée de main
    cli(c_isn, 0, "S", t=16.00)
    srv(s_isn, c_isn + 1, "SA", t=16.03)
    cli(c_isn + 1, s_isn + 1, "A", t=16.05)
    # Requête + acquittement
    cli(c_isn + 1, s_isn + 1, "PA", request, t=16.07)
    srv(s_isn + 1, c_isn + 1 + lg, "A", t=16.10)
    # Réponse + acquittement
    srv(s_isn + 1, c_isn + 1 + lg, "PA", response, t=16.12)
    cli(c_isn + 1 + lg, s_isn + 1 + lr, "A", t=16.15)
    # Fermeture (initiée par le client)
    cli(c_isn + 1 + lg, s_isn + 1 + lr, "FA", t=16.40)
    srv(s_isn + 1 + lr, c_isn + 1 + lg + 1, "A", t=16.43)
    srv(s_isn + 1 + lr, c_isn + 1 + lg + 1, "FA", t=16.45)
    cli(c_isn + 1 + lg + 1, s_isn + 1 + lr + 1, "A", t=16.47)

    return pkts


def main():
    here = pathlib.Path(__file__).resolve().parent          # .../infra
    capture_dir = here / "capture"
    scelles_dir = here.parent / "scelles"
    capture_dir.mkdir(parents=True, exist_ok=True)
    scelles_dir.mkdir(parents=True, exist_ok=True)

    out = capture_dir / OUT_NAME
    pkts = build()
    wrpcap(str(out), pkts)
    shutil.copy(out, scelles_dir / OUT_NAME)

    print("[+] %d paquets ecrits" % len(pkts))
    print("    %s" % out)
    print("    %s" % (scelles_dir / OUT_NAME))
    print("[i] Jeton d'entrainement : %s" % FLAG)


if __name__ == "__main__":
    main()
