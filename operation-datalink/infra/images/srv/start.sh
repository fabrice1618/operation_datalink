#!/bin/sh
# Lance les trois services du serveur interne et garde le conteneur vivant.
set -e
python3 /opt/srv/smtp_server.py   &
python3 /opt/srv/telnet_server.py &
# Le chat HTTP reste au premier plan (PID 1 logique)
exec python3 /opt/srv/http_chat.py
