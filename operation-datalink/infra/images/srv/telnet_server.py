#!/usr/bin/env python3
"""Service d'administration telnet en clair (port 23).

Tout transite en clair : login, mot de passe et commandes. L'intrus s'y
connecte apres son scan de ports. Le "Suivre le flux TCP" reconstitue
l'integralite de la session, y compris le jeton d'acces.
"""
import socketserver

USER = "admin"
PASSWORD = "Adm1n-NordExport!"
ACCESS_TOKEN = "DATALINK{STAD_ROOT_NORDEXPORT}"

MOTD = "Ubuntu 22.04.3 LTS (srv-nordexport)\r\n"

FILES = {
    "/root/access.txt": ACCESS_TOKEN + "\r\n",
}


class TelnetHandler(socketserver.StreamRequestHandler):
    def send(self, text):
        self.wfile.write(text.encode())
        self.wfile.flush()

    def readline(self):
        raw = self.rfile.readline()
        return raw.decode("utf-8", "replace").rstrip("\r\n") if raw else None

    def handle(self):
        self.send(MOTD)
        self.send("srv-nordexport login: ")
        user = self.readline()
        self.send("Password: ")
        pwd = self.readline()
        if user != USER or pwd != PASSWORD:
            self.send("\r\nLogin incorrect\r\n")
            return
        self.send("\r\nDernier acces : mar. 12 mai 2026, 02:14 depuis 10.13.37.66\r\n")
        self.send("root@srv-nordexport:~# ")
        while True:
            cmd = self.readline()
            if cmd is None or cmd in ("exit", "logout"):
                self.send("logout\r\n")
                break
            out = self.run(cmd.strip())
            self.send(out)
            self.send("root@srv-nordexport:~# ")

    def run(self, cmd):
        if cmd == "id":
            return "uid=0(root) gid=0(root) groups=0(root)\r\n"
        if cmd == "hostname":
            return "srv-nordexport\r\n"
        if cmd == "ls /root" or cmd == "ls":
            return "access.txt  backup_clients.sql  notes.txt\r\n"
        if cmd.startswith("cat "):
            path = cmd[4:].strip()
            return FILES.get(path, "cat: {}: No such file or directory\r\n".format(path))
        if cmd == "whoami":
            return "root\r\n"
        if cmd == "":
            return ""
        return "{}: command not found\r\n".format(cmd.split()[0])


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    Server(("0.0.0.0", 23), TelnetHandler).serve_forever()
