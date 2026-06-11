#!/usr/bin/env python3
"""Serveur SMTP minimal en clair (port 25).

Implemente juste assez du protocole pour recevoir un mail envoye par
smtplib (EHLO/MAIL/RCPT/DATA/QUIT). Le contenu du DATA (corps + piece
jointe encodee en base64) apparait integralement dans la capture.
"""
import socketserver


class SMTPHandler(socketserver.StreamRequestHandler):
    def reply(self, line):
        self.wfile.write((line + "\r\n").encode())
        self.wfile.flush()

    def handle(self):
        self.reply("220 srv-nordexport ESMTP Postfix")
        in_data = False
        while True:
            raw = self.rfile.readline()
            if not raw:
                break
            line = raw.decode("utf-8", "replace").rstrip("\r\n")

            if in_data:
                if line == ".":
                    in_data = False
                    self.reply("250 2.0.0 Ok: queued as 4F3A1")
                continue

            cmd = line.upper()
            if cmd.startswith("EHLO") or cmd.startswith("HELO"):
                self.reply("250-srv-nordexport")
                self.reply("250 HELP")
            elif cmd.startswith("MAIL FROM"):
                self.reply("250 2.1.0 Ok")
            elif cmd.startswith("RCPT TO"):
                self.reply("250 2.1.5 Ok")
            elif cmd.startswith("DATA"):
                self.reply("354 End data with <CR><LF>.<CR><LF>")
                in_data = True
            elif cmd.startswith("RSET"):
                self.reply("250 2.0.0 Ok")
            elif cmd.startswith("NOOP"):
                self.reply("250 2.0.0 Ok")
            elif cmd.startswith("QUIT"):
                self.reply("221 2.0.0 Bye")
                break
            else:
                self.reply("250 2.0.0 Ok")


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    Server(("0.0.0.0", 25), SMTPHandler).serve_forever()
