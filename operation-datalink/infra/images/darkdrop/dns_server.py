#!/usr/bin/env python3
"""Serveur DNS du C2 (port 53/udp).

- Repond aux requetes A pour resoudre les domaines du reseau criminel.
- Repond a une requete TXT particuliere par un jeton : c'est un canal cache
  (exfiltration/commande via DNS), visible en clair dans la capture.
"""
import base64
import socketserver
from dnslib import RR, QTYPE, A, TXT, RCODE
from dnslib import DNSRecord

ZONE_A = {
    "darkdrop-exchange.net.": "10.13.37.200",
    "srv-nordexport.lan.": "10.13.37.50",
    "panel.darkdrop-exchange.net.": "10.13.37.200",
    # Domaines anodins resolus par le poste de bruit de fond (trafic parasite).
    "meteo.example.": "203.0.113.10",
    "maj.intranet.lan.": "10.13.37.50",
}

# Canal cache : la reponse TXT transporte le jeton de controle. La valeur du
# champ "key" n'est PAS en clair : elle est encodee en base64. Il faut isoler la
# reponse TXT puis decoder la chaine situee apres "key=".
_FLAG_P5 = "DATALINK{TUNNEL_DNS_C2_ACTIF}"
TXT_TOKEN = "v=c2; cmd=exfil; key=" + base64.b64encode(_FLAG_P5.encode()).decode()
TXT_NAME = "status.darkdrop-exchange.net."


class DNSHandler(socketserver.BaseRequestHandler):
    def handle(self):
        data, sock = self.request
        try:
            req = DNSRecord.parse(data)
        except Exception:
            return
        reply = req.reply()
        qname = str(req.q.qname)
        qtype = QTYPE[req.q.qtype]

        if qtype == "A" and qname in ZONE_A:
            reply.add_answer(RR(qname, QTYPE.A, ttl=60, rdata=A(ZONE_A[qname])))
        elif qtype == "TXT" and qname == TXT_NAME:
            reply.add_answer(RR(qname, QTYPE.TXT, ttl=60, rdata=TXT(TXT_TOKEN)))
        else:
            reply.header.rcode = RCODE.NXDOMAIN

        sock.sendto(reply.pack(), self.client_address)


class Server(socketserver.ThreadingUDPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    Server(("0.0.0.0", 53), DNSHandler).serve_forever()
