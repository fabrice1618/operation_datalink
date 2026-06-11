FROM python:3.12-slim
WORKDIR /opt/darkdrop
RUN pip install --no-cache-dir pyftpdlib==1.5.10 dnslib==0.9.25
COPY ftp_server.py dns_server.py start.sh ./
RUN chmod +x start.sh && mkdir -p /srv/incoming
# 21 = FTP (controle), 30000-30009 = FTP passif, 53 = DNS
EXPOSE 21 53/udp 30000-30009
CMD ["./start.sh"]
