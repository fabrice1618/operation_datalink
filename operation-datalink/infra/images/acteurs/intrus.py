#!/usr/bin/env python3
"""Poste de l'intrus - 10.13.37.66.

Timeline :
  - scan de ports SYN du serveur interne (signature visible : SYN -> RST)
  - intrusion : session telnet en clair (login + commandes + jeton d'acces)
"""
import socket
import subprocess
import time

SRV = "10.13.37.50"


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
    for cmd in ("id", "ls /root", "cat /root/access.txt", "exit"):
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

    # --- Intrusion telnet (P4, partie 2) ---
    delay = 26 - (time.time() - t0)
    if delay > 0:
        time.sleep(delay)
    telnet_session()

    print("intrus: termine")


if __name__ == "__main__":
    main()
