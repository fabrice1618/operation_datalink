#!/bin/sh
set -e
python3 /opt/darkdrop/dns_server.py &
exec python3 /opt/darkdrop/ftp_server.py
