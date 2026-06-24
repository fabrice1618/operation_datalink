FROM python:3.12-slim
WORKDIR /opt/scenario
RUN apt-get update \
    && apt-get install -y --no-install-recommends nmap \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir dnslib==0.9.25 scapy==2.5.0
COPY sofia.py marc.py intrus.py bruit.py ./
COPY data/ /opt/scenario/data/
