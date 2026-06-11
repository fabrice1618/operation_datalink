FROM python:3.12-slim
WORKDIR /opt/srv
COPY http_chat.py smtp_server.py telnet_server.py start.sh ./
RUN chmod +x start.sh
# 80 = chat intranet, 25 = SMTP, 23 = telnet d'administration
EXPOSE 80 25 23
CMD ["./start.sh"]
