#!/usr/bin/env python3
"""Poste de Sofia Lenoir (gerante) - 10.13.37.20.

Timeline :
  - coordonne la livraison via le chat HTTP (port 80) du serveur interne
  - envoie un e-mail de menace/chantage via SMTP (port 25), avec une piece
    jointe encodee en base64
"""
import smtplib
import time
import urllib.parse
import urllib.request
from email.message import EmailMessage

SRV = "10.13.37.50"

# Preuve P1 : la coordination de la livraison se lit directement dans le chat
# HTTP en clair. L'enquete ne cherche plus un jeton mais quatre faits a relever
# en reconstituant la conversation (et en ecartant le bruit du poste IT) :
#   - les noms des deux suspects (Sofia Lenoir / Marc Vidal)
#   - le transporteur (Transports Caron)
#   - la date de chargement (14/05/2026, dans la nuit du 14 mai a 03h00)
#   - le numero de colis (NX-4417)
# Preuve P3 : l'enquete ne cherche plus de jeton mais releve les faits du mail de
# chantage (destinataire, montant 50 000 EUR, paiement en BTC, delai 72 heures,
# nom de la piece jointe). Montant/delai sont lus dans la piece jointe base64.


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
    sleep_until(t0, 8)
    chat("Sofia", "Ici Sofia Lenoir. Marc, tu es en ligne ? On finalise la livraison de cette nuit.")
    sleep_until(t0, 14)
    chat("Sofia", "Transporteur confirme : Transports Caron, comme la derniere fois.")
    sleep_until(t0, 22)
    chat("Sofia", "On garde la nuit du 14 mai a 03h00. Date de chargement : 14/05/2026.")
    sleep_until(t0, 26)
    chat("Sofia", "La marchandise part sous le colis NX-4417. Ne note ce numero nulle part ailleurs.")
    sleep_until(t0, 30)
    chat("Sofia", "On efface ce canal demain. Rien par ecrit en dehors d'ici.")

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
        "Delai : 72 heures pour repondre.\n"
        "Sans quoi les documents seront diffuses a la presse.\n"
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
