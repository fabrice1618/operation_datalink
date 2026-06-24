#!/usr/bin/env python3
"""Poste de Sofia Lenoir (gerante) - 10.13.37.20.

Timeline :
  - coordonne la livraison via le chat HTTP (port 80) du serveur interne
  - envoie un e-mail de menace/chantage via SMTP (port 25), avec une piece
    jointe encodee en base64
"""
import codecs
import smtplib
import time
import urllib.parse
import urllib.request
from email.message import EmailMessage

SRV = "10.13.37.50"

# Preuve P1 : code de rendez-vous glisse dans la conversation. Il n'est jamais
# donne en clair : il est decoupe en deux moities et chacune est chiffree en
# ROT13 (decalage de 13 lettres). Reconstitution attendue : recoller le flux
# HTTP des deux messages, puis appliquer ROT13.
RDV_CODE = "DATALINK{RDV_QUAI17_14MAI_0300}"
# Preuve P3 : reference de la rancon, dans la piece jointe
RANSOM_FLAG = "DATALINK{RANCON_50000E_BTC}"


def rot13(texte):
    return codecs.encode(texte, "rot13")


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

    # --- Coordination du trafic via le chat (P1) ---
    mid = len(RDV_CODE) // 2
    sleep_until(t0, 8)
    chat("Sofia", "Marc, la marchandise arrive cette nuit. Tu confirmes le point de chute ?")
    sleep_until(t0, 14)
    chat("Sofia", "Comme d'habitude : depot sur darkdrop. Je passe le code en deux fois, decale facon ROT13.")
    sleep_until(t0, 18)
    chat("Sofia", "Code (1/2, ROT13) : " + rot13(RDV_CODE[:mid]))
    sleep_until(t0, 22)
    chat("Sofia", "Code (2/2, ROT13) : " + rot13(RDV_CODE[mid:]))
    sleep_until(t0, 28)
    chat("Sofia", "Ne mets RIEN par ecrit ailleurs. On efface ce canal demain.")

    # --- Menace / chantage par e-mail (P3) ---
    # Usurpation (defi bonus) : l'en-tete "From" est falsifie pour faire accuser
    # Marc, alors que l'enveloppe SMTP (MAIL FROM) et l'IP source reelle (.20)
    # trahissent la veritable expeditrice, Sofia.
    sleep_until(t0, 45)
    msg = EmailMessage()
    msg["From"] = "m.vidal@nordexport.lan"
    msg["To"] = "directeur@groupe-rival.example"
    msg["Subject"] = "Derniere mise en garde"
    msg.set_content(
        "Vous savez ce que nous detenons sur vous.\n"
        "Vous avez 72 heures pour repondre a nos conditions.\n"
        "Les details et la preuve sont en piece jointe.\n"
    )
    piece = (
        "CONDITIONS\n"
        "==========\n"
        "Montant exige : 50 000 EUR en BTC\n"
        "Sans quoi les documents seront diffuses a la presse.\n"
        "Reference de dossier : " + RANSOM_FLAG + "\n"
    )
    msg.add_attachment(
        piece.encode(),
        maintype="application",
        subtype="octet-stream",
        filename="conditions_diffusion.txt",
    )

    with smtplib.SMTP(SRV, 25, timeout=10) as s:
        s.send_message(
            msg,
            from_addr="s.lenoir@nordexport.lan",
            to_addrs=["directeur@groupe-rival.example"],
        )

    print("sofia: termine")


if __name__ == "__main__":
    main()
