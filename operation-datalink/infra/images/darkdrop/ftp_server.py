#!/usr/bin/env python3
"""Serveur FTP de reception des donnees volees (port 21, clair).

Identifiants et transfert (STOR) circulent en clair. Le canal de donnees
(mode passif) transporte le fichier exfiltre : on peut le reconstituer
octet par octet depuis la capture.
"""
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer

FTP_USER = "depot"
FTP_PASS = "Pr1nt3mps2026!"


def main():
    authorizer = DummyAuthorizer()
    authorizer.add_user(FTP_USER, FTP_PASS, "/srv/incoming", perm="elradfmw")

    handler = FTPHandler
    handler.authorizer = authorizer
    handler.banner = "darkdrop-exchange FTP ready"
    # Plage de ports passifs fixe pour une capture previsible
    handler.passive_ports = range(30000, 30010)

    server = FTPServer(("0.0.0.0", 21), handler)
    server.serve_forever()


if __name__ == "__main__":
    main()
