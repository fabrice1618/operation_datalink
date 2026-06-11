#!/usr/bin/env python3
"""Messagerie web interne de NordExport (HTTP en clair, port 80).

Les suspects coordonnent leurs activites via ce "chat" : chaque message est
un POST en clair, le journal est consultable en GET. Tout est lisible dans
la capture via "Suivre le flux TCP/HTTP".

Contient aussi une page d'administration cachee (/admin/exfil-status) qui
n'est JAMAIS consultee pendant le scenario : elle ne sert qu'a la phase 2
(enquete sur l'infrastructure encore active).
"""
import html
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs

MESSAGES = []  # liste de (auteur, texte)
LOCK = threading.Lock()

PHASE2_FLAG = "DATALINK{SEQUESTRE_EXFIL_TOUJOURS_ACTIVE}"

PAGE = """<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8">
<title>NordExport - Messagerie interne</title></head>
<body>
<h1>NordExport SARL - Messagerie interne</h1>
<p>Canal prive. Usage reserve a la direction.</p>
<hr>
<ul>
{messages}
</ul>
</body></html>
"""


class Handler(BaseHTTPRequestHandler):
    server_version = "NordExport-Intranet/1.0"

    def log_message(self, format, *args):
        pass  # silencieux

    def _send(self, code, body, ctype="text/html; charset=utf-8"):
        data = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path.startswith("/admin/exfil-status"):
            # Page reservee phase 2 : statut de l'exfiltration automatisee.
            body = (
                "STATUT EXFILTRATION AUTOMATISEE\n"
                "================================\n"
                "tache cron : actif (toutes les 6h)\n"
                "destination : darkdrop-exchange.net (FTP)\n"
                "derniere base poussee : clients_nordexport.csv\n"
                "jeton de controle : " + PHASE2_FLAG + "\n"
            )
            return self._send(200, body, "text/plain; charset=utf-8")

        with LOCK:
            items = "\n".join(
                "<li><b>{}</b> : {}</li>".format(html.escape(a), html.escape(t))
                for a, t in MESSAGES
            )
        return self._send(200, PAGE.format(messages=items))

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length).decode("utf-8", "replace")
        form = parse_qs(raw)
        auteur = form.get("auteur", ["?"])[0]
        texte = form.get("texte", [""])[0]
        with LOCK:
            MESSAGES.append((auteur, texte))
        return self._send(200, "OK\n", "text/plain; charset=utf-8")


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 80), Handler).serve_forever()
