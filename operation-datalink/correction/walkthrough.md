# Opération Datalink — solution détaillée (CONFIDENTIEL enseignant)

Solution complète, avec l'équivalent **Wireshark** (UI) et **tcpdump** (CLI,
pour vérifier sans Wireshark). Commandes à lancer depuis `scelles/`.

## Vue d'ensemble rapide

Depuis cette version, **aucun vrai jeton n'apparaît en clair** dans les scellés :
chaque preuve impose de reconstituer le flux du protocole *puis* de décoder. La
recherche naïve ne renvoie donc **que le leurre** (cf. « Bruit de fond & leurre ») :

```bash
strings scelle-01_serveur-interne.pcap scelle-02_passerelle.pcap \
  | grep -o 'DATALINK{[^}]*}' | sort -u
# => DATALINK{ARCHIVE_SAUVEGARDE_2025}   (LEURRE — à rejeter)
```

Une transformation distincte par preuve (pour qu'aucune recherche unique ne les
révèle toutes) :

| Preuve | Protocole | Camouflage | Décodage |
|--------|-----------|------------|----------|
| P1 | HTTP chat | 2 moitiés + ROT13     | recoller + ROT13 |
| P2 | FTP       | jeton écrit à l'envers | lire à l'envers (`rev`) |
| P3 | SMTP      | pièce jointe base64    | `base64 -d` |
| P4 | Telnet    | jeton en hexadécimal   | `xxd -r -p` |
| P5 | DNS TXT   | valeur en base64       | `base64 -d` |

---

## P1 — Coordination (HTTP, scellé 01) → `DATALINK{RDV_QUAI17_14MAI_0300}`

Le code n'est plus donné en clair : Sofia (`10.13.37.20`) l'envoie en **deux
moitiés**, chacune **chiffrée en ROT13**. Il faut reconstituer le chat, recoller
les deux moitiés puis appliquer ROT13.

**Wireshark :** filtre `http` → *Suivre → Flux HTTP* sur un `POST /post`. Les deux
messages utiles (de `10.13.37.20`) :
- `Code (1/2, ROT13) : QNGNYVAX{EQI_DH`
- `Code (2/2, ROT13) : NV17_14ZNV_0300}`

**tcpdump :**
```bash
tcpdump -A -r scelle-01_serveur-interne.pcap 'tcp port 80' | grep -o 'texte=[^&]*'
```
Recollage + ROT13 :
```bash
echo 'QNGNYVAX{EQI_DHNV17_14ZNV_0300}' | tr 'A-Za-z' 'N-ZA-Mn-za-m'
# => DATALINK{RDV_QUAI17_14MAI_0300}
```
Le corps du POST est aussi URL-encodé (`%7B`/`%7D`…) — ce que Wireshark/`tcpdump`
restituent ; le ROT13 porte sur le texte une fois recollé.

> ⚠️ Un message du chat signé `IT-Support` contient `DATALINK{ARCHIVE_SAUVEGARDE_2025}`
> en clair : c'est le **leurre**, pas le code de rendez-vous.

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
Identifiants : `depot` / `Pr1nt3mps2026!`. La 1re ligne du CSV porte le jeton
**inscrit à l'envers** : `# ... ref(envers):}SERTLIFXE_DPGR_STNEILC_3124{KNILATAD`.
Le relire à l'envers :
```bash
echo '}SERTLIFXE_DPGR_STNEILC_3124{KNILATAD' | rev
# => DATALINK{4213_CLIENTS_RGPD_EXFILTRES}
```
(≈ 4213 clients, IBAN inclus — la 2ᵉ ligne d'en-tête confirme le volume.)

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

> 🎯 **Bonus — usurpation.** L'en-tête `From:` annonce `m.vidal@nordexport.lan`
> (Marc), mais l'enveloppe `MAIL FROM:<s.lenoir@nordexport.lan>` et surtout l'**IP
> source `10.13.37.20`** (poste de Sofia) trahissent la véritable expéditrice :
> **Sofia**. Un en-tête `From` ne prouve pas l'identité de l'émetteur.

---

## P4 — Intrusion (scan + telnet, scellé 01) → `DATALINK{STAD_ROOT_NORDEXPORT}`

**Scan.** Wireshark : `tcp.flags.syn==1 && tcp.flags.ack==0 && ip.src==10.13.37.66`
→ une rafale de SYN vers des ports successifs = scan.
```bash
tcpdump -nn -r scelle-01_serveur-interne.pcap \
  'tcp[tcpflags] & (tcp-syn|tcp-ack) == tcp-syn and src host 10.13.37.66' | wc -l
# → 102 paquets (ports 1-100 + 443)
```

**Intrusion telnet.** Wireshark : `telnet` → *Suivre le flux TCP*. La session
montre `cat /root/notes.txt` (qui révèle l'encodage) puis `cat /root/access.txt`
qui n'affiche **pas** le jeton en clair, mais une **chaîne hexadécimale** :
```
444154414c494e4b7b535441445f524f4f545f4e4f52444558504f52547d
```
La décoder :
```bash
echo 444154414c494e4b7b535441445f524f4f545f4e4f52444558504f52547d | xxd -r -p
# => DATALINK{STAD_ROOT_NORDEXPORT}
```
Login `admin` / `Adm1n-NordExport!`. IP intrus : `10.13.37.66`.

> 🎯 **Bonus — MITM / ARP.** Juste avant le telnet, filtrer `arp` : `10.13.37.66`
> émet des ARP gratuits annonçant être la passerelle `10.13.37.1` (« is-at » vers
> sa propre MAC) → empoisonnement ARP / homme du milieu (Wireshark peut signaler
> *« duplicate use of IP address detected »*).

---

## P5 — Canal caché (DNS, scellé 02) → `DATALINK{TUNNEL_DNS_C2_ACTIF}`

**Wireshark :** filtre `dns`. Au milieu de requêtes A (dont du **bruit** :
`meteo.example`, `maj.intranet.lan`), repérer la requête **TXT**
`status.darkdrop-exchange.net` et sa réponse. La valeur du champ `key=` est
**encodée en base64** :
```bash
tcpdump -A -r scelle-02_passerelle.pcap 'udp port 53' | grep -a 'key='
# v=c2; cmd=exfil; key=REFUQUxJTkt7VFVOTkVMX0ROU19DMl9BQ1RJRn0=
echo 'REFUQUxJTkt7VFVOTkVMX0ROU19DMl9BQ1RJRn0=' | base64 -d
# => DATALINK{TUNNEL_DNS_C2_ACTIF}
```

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

## Bruit de fond & leurre (scellés 01 et 02)

Un poste de support (`10.13.37.40`, `pc-it`) génère du **trafic légitime** qui se
mêle aux preuves : résolutions DNS anodines (`meteo.example`, `maj.intranet.lan`),
un `GET /` sur la messagerie, un mail interne banal (« Sauvegarde hebdomadaire OK »).
Objectif : forcer le **filtrage** (on ne peut plus tout trouver à l'œil nu).

Il poste aussi dans le chat un message anodin contenant le **leurre**
`DATALINK{ARCHIVE_SAUVEGARDE_2025}` — le seul littéral `DATALINK{…}` en clair des
captures. Un binôme qui le rend **sans localisation cohérente** (c'est une simple
« référence d'archive » d'un message de maintenance, sans rapport avec une
infraction) doit être sanctionné : « la localisation fait foi ».

## Corrélation inter-scellés (défi bonus)

À recouper entre les deux captures :
- le `STOR clients_nordexport.csv` (scellé 02, FTP) est **immédiatement suivi** du
  message de Marc « Fichier poussé sur le dépôt darkdrop. J'efface l'historique »
  (scellé 01, chat) → concertation et destruction de preuves ;
- `darkdrop-exchange.net` / `10.13.37.200`, évoqué dans le chat (01, « dépôt sur
  darkdrop »), est le serveur résolu en **DNS** et destinataire du **FTP** (02).

## Phase 2 (infra live) → `DATALINK{SEQUESTRE_EXFIL_TOUJOURS_ACTIVE}`

```bash
nmap -sV 10.13.37.50                       # 23/telnet, 25/smtp, 80/http
curl http://10.13.37.50/admin/exfil-status # page jamais vue dans les scellés
```
La page révèle une tâche d'exfiltration encore active et le jeton
`DATALINK{SEQUESTRE_EXFIL_TOUJOURS_ACTIVE}` → preuve d'une infraction **en cours**
(postérieure aux scellés).
