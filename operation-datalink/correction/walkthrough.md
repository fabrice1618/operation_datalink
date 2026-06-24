# Opération Datalink — solution détaillée (CONFIDENTIEL enseignant)

Solution complète, avec l'équivalent **Wireshark** (UI) et **tcpdump** (CLI,
pour vérifier sans Wireshark). Commandes à lancer depuis `scelles/`.

## Vue d'ensemble rapide

Depuis cette version, **aucun vrai jeton n'apparaît en clair** dans les scellés :
les réquisitions 3 à 5 imposent de reconstituer le flux du protocole *puis* de
décoder. Les **réquisitions 1 et 2** ne livrent plus de jeton du tout : ce sont des
**relevés de faits** — R1 (suspects, transporteur, date, n° de colis) lus dans le
chat HTTP ; R2 (nombre de clients, identifiant/mot de passe FTP, IP serveur et
poste) lus dans le transfert FTP —, à saisir dans le formulaire d'enquête du
portail. La recherche naïve ne renvoie donc **que le leurre** (cf. « Bruit de fond
& leurre ») :

```bash
strings scelle-01_serveur-interne.pcap scelle-02_passerelle.pcap \
  | grep -o 'DATALINK{[^}]*}' | sort -u
# => DATALINK{ARCHIVE_SAUVEGARDE_2025}   (LEURRE — à rejeter)
```

Une transformation distincte par preuve (pour qu'aucune recherche unique ne les
révèle toutes) :

| Preuve | Protocole | Camouflage | Décodage |
|--------|-----------|------------|----------|
| P1 | HTTP chat | relevé de faits (pas de jeton) | lire la conversation, écarter le leurre |
| P2 | FTP       | relevé de faits (pas de jeton) | lire le canal de contrôle + reconstituer le fichier |
| P3 | SMTP      | pièce jointe base64    | `base64 -d` |
| P4 | Telnet    | jeton en hexadécimal   | `xxd -r -p` |
| P5 | DNS TXT   | valeur en base64       | `base64 -d` |

---

## P1 — Coordination (HTTP, scellé 01) → relevé d'enquête (4 faits)

Plus de jeton : on **reconstitue la conversation** entre Sofia (`10.13.37.20`) et
Marc (`10.13.37.10`) et on relève quatre faits, à saisir dans le formulaire
d'enquête du portail (l'étape n'est validée que si les 4 sont exacts) :

| Champ | Valeur attendue | Alias acceptés |
|-------|-----------------|----------------|
| Suspects | **Sofia Lenoir** + **Marc Vidal** | ordre indifférent |
| Transporteur | **Transports Caron** | « Caron » |
| Date de chargement | **14/05/2026** | « 14/5/2026 », « 14 mai 2026 » |
| N° de colis | **NX-4417** | « nx4417 » |

**Wireshark :** filtre `http` → *Suivre → Flux HTTP* sur les `POST /post`.

**tcpdump :**
```bash
tcpdump -A -r scelle-01_serveur-interne.pcap 'tcp port 80' | grep -o 'texte=[^&]*'
```
Les messages utiles proviennent de `10.13.37.20` (Sofia) et `10.13.37.10` (Marc) :
transporteur « Transports Caron », chargement « nuit du 14 mai à 03h00 /
14/05/2026 », colis « NX-4417 ». Le corps du POST est URL-encodé (`%7B`/`%7D`…),
restitué par Wireshark/`tcpdump`.

> ⚠️ **Leurre :** un message signé `IT-Support` évoque une *autre* tournée —
> **Transports Brel**, le **12/05**, colis **RH-0090**. À écarter : ce ne sont
> pas les faits des suspects. (Le même poste plante aussi le faux jeton
> `DATALINK{ARCHIVE_SAUVEGARDE_2025}`, sans rapport avec R1.)

---

## P2 — Exfiltration (FTP, scellé 02) → relevé d'enquête (5 faits)

Plus de jeton : on **reconstitue le transfert FTP** de Marc (`10.13.37.10`) vers
darkdrop (`10.13.37.200`) et on relève cinq éléments, à saisir dans le formulaire
d'enquête du portail (l'étape n'est validée que si les 5 sont exacts) :

| Champ | Valeur attendue |
|-------|-----------------|
| Clients impactés | **10** (enregistrements du CSV reconstitué) |
| Identifiant FTP | **depot** |
| Mot de passe FTP | **Pr1nt3mps2026!** |
| IP du serveur | **10.13.37.200** (destination) |
| IP de l'utilisateur | **10.13.37.10** (source) |

**Wireshark :** filtre `ftp` (canal de contrôle : `USER`, `PASS`, `STOR` — révèle
l'identifiant, le mot de passe et les deux IP). Puis `ftp-data`, ou *Fichier →
Exporter des objets* / *Suivre le flux TCP* sur la connexion de données
(ports 30000-30009) pour reconstituer le CSV : son en-tête donne le volume.

**tcpdump :**
```bash
tcpdump -A -r scelle-02_passerelle.pcap 'tcp port 21' | grep -E 'USER|PASS|STOR'
tcpdump -nn -r scelle-02_passerelle.pcap 'tcp port 21' | head   # IP source / destination
tcpdump -A -r scelle-02_passerelle.pcap 'tcp portrange 30000-30010' | grep -A2 'EXPORT CONFIDENTIEL'
```
Identifiants : `depot` / `Pr1nt3mps2026!`. Le fichier reconstitué compte
**10 enregistrements** de clients (IBAN, e-mail, état civil inclus). Plus aucun
jeton n'est inscrit dans le fichier.

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
