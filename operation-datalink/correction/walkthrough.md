# Opération Datalink — solution détaillée (CONFIDENTIEL enseignant)

Solution complète, avec l'équivalent **Wireshark** (UI) et **tcpdump** (CLI,
pour vérifier sans Wireshark). Commandes à lancer depuis `scelles/`.

## Vue d'ensemble rapide

```bash
# Tous les jetons en clair (P1 et P3 n'apparaissent PAS ici : encodés)
strings scelle-01_serveur-interne.pcap scelle-02_passerelle.pcap \
  | grep -o 'DATALINK{[^}]*}' | sort -u
```

---

## P1 — Coordination (HTTP, scellé 01) → `DATALINK{RDV_QUAI17_14MAI_0300}`

**Wireshark :** filtre `http` → clic droit sur un `POST /post` →
*Suivre → Flux HTTP*. Lire les messages. Le code est URL-encodé : décoder
`%7B`→`{`, `%7D`→`}`.

**tcpdump :**
```bash
tcpdump -A -r scelle-01_serveur-interne.pcap 'tcp port 80' | grep 'texte='
```
Le 2ᵉ message (de `10.13.37.20`) contient
`...DATALINK%7BRDV_QUAI17_14MAI_0300%7D`. Décodé → `DATALINK{RDV_QUAI17_14MAI_0300}`.

---

## P2 — Exfiltration (FTP, scellé 02) → `DATALINK{4213_CLIENTS_RGPD_EXFILTRES}`

**Wireshark :** filtre `ftp` (canal de contrôle : `USER`, `PASS`, `STOR`).
Puis `ftp-data`, ou *Fichier → Exporter des objets* / *Suivre le flux TCP* sur
la connexion de données (ports 30000-30009) pour reconstituer le CSV.

**tcpdump :**
```bash
tcpdump -A -r scelle-02_passerelle.pcap 'tcp port 21' | grep -E 'USER|PASS|STOR'
tcpdump -A -r scelle-02_passerelle.pcap 'tcp portrange 30000-30010' | grep -A20 'EXPORT CONFIDENTIEL'
```
Identifiants : `depot` / `Pr1nt3mps2026!`. Le CSV débute par
`# ... ref:DATALINK{4213_CLIENTS_RGPD_EXFILTRES}` (≈ 4213 clients, IBAN inclus).

---

## P3 — Menaces (SMTP, scellé 01) → `DATALINK{RANCON_50000E_BTC}`

**Wireshark :** filtre `smtp` → *Suivre le flux TCP*. Repérer le bloc base64
(`Content-Transfer-Encoding: base64`, pièce jointe `conditions_diffusion.txt`),
le copier et le décoder.

**tcpdump :**
```bash
tcpdump -A -r scelle-01_serveur-interne.pcap 'tcp port 25' \
  | grep -oE '^[A-Za-z0-9+/]{20,}={0,2}$' | tr -d '\n' | base64 -d
```
Donne : montant 50 000 EUR en BTC, délai 72 h, et
`Reference de dossier : DATALINK{RANCON_50000E_BTC}`.

---

## P4 — Intrusion (scan + telnet, scellé 01) → `DATALINK{STAD_ROOT_NORDEXPORT}`

**Scan.** Wireshark : `tcp.flags.syn==1 && tcp.flags.ack==0 && ip.src==10.13.37.66`
→ une rafale de SYN vers des ports successifs = scan.
```bash
tcpdump -nn -r scelle-01_serveur-interne.pcap \
  'tcp[tcpflags] & (tcp-syn|tcp-ack) == tcp-syn and src host 10.13.37.66' | wc -l
# → 102 paquets (ports 1-100 + 443)
```

**Intrusion telnet.** Wireshark : `telnet` → *Suivre le flux TCP*.
```bash
tcpdump -A -r scelle-01_serveur-interne.pcap 'tcp port 23' | grep -iE 'login|admin|access'
```
Login `admin` / `Adm1n-NordExport!`, puis `cat /root/access.txt` →
`DATALINK{STAD_ROOT_NORDEXPORT}`. IP intrus : `10.13.37.66`.

---

## P5 — Canal caché (DNS, scellé 02) → `DATALINK{TUNNEL_DNS_C2_ACTIF}`

**Wireshark :** filtre `dns`. Requêtes A (`darkdrop-exchange.net`, etc.) puis la
requête **TXT** `status.darkdrop-exchange.net` et sa réponse.
```bash
tcpdump -A -r scelle-02_passerelle.pcap 'udp port 53' | grep -a 'DATALINK'
```
Réponse TXT : `v=c2; cmd=exfil; key=DATALINK{TUNNEL_DNS_C2_ACTIF}`.

---

## Protagonistes (ARP + DNS)

```bash
tcpdump -nn -e -r scelle-01_serveur-interne.pcap arp | head   # IP ↔ MAC
```
| IP | Rôle |
|----|------|
| 10.13.37.20 | Sofia (gérante) |
| 10.13.37.10 | Marc (comptable) |
| 10.13.37.66 | intrus |
| 10.13.37.50 | serveur interne |
| 10.13.37.200 | serveur externe darkdrop |

---

## Phase 2 (infra live) → `DATALINK{SEQUESTRE_EXFIL_TOUJOURS_ACTIVE}`

```bash
nmap -sV 10.13.37.50                       # 23/telnet, 25/smtp, 80/http
curl http://10.13.37.50/admin/exfil-status # page jamais vue dans les scellés
```
La page révèle une tâche d'exfiltration encore active et le jeton
`DATALINK{SEQUESTRE_EXFIL_TOUJOURS_ACTIVE}` → preuve d'une infraction **en cours**
(postérieure aux scellés).
