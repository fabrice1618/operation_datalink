# Opération Datalink — TP CTF d'analyse réseau (TCP/IP)

CTF de type « enquête judiciaire » pour étudiants ingénieurs, à l'issue d'un
cours TCP/IP. Les étudiants jouent des enquêteurs de la section cyber : ils
analysent des **scellés numériques** (captures réseau), collectent des preuves
de plusieurs infractions et les consignent dans un **procès-verbal** remis au
**juge d'instruction** (l'enseignant). Le juge peut rouvrir l'enquête (phase 2)
sur l'infrastructure encore active.

- **Durée visée** : séance de 3–4 h.
- **Niveau** : post-cours TCP/IP (modèle en couches, ports, TCP/UDP, ARP, DNS,
  HTTP/FTP/SMTP, notion de scan).
- **Trafic** : entièrement en clair (aucun déchiffrement requis).
- **Outils étudiants** : Wireshark (ou `tcpdump`), `nmap`, un client web/FTP, `dig`.

## Scénario

La PME-écran **NordExport SARL** (LAN `10.13.37.0/24`) est soupçonnée d'héberger
les communications d'un petit réseau criminel. Deux captures ont été saisies sur
deux points de collecte (« sondes ») :

| Scellé | Point de collecte | Preuves attendues |
|--------|-------------------|-------------------|
| `scelle-01_serveur-interne.pcap` | Serveur interne `10.13.37.50` | P1 coordination (HTTP), P3 menaces (SMTP), P4 intrusion (scan + telnet) |
| `scelle-02_passerelle.pcap` | Passerelle / serveur externe `10.13.37.200` | P2 exfiltration base clients (FTP), P5 canal caché (DNS) |

Protagonistes (à identifier par les étudiants via IP/ARP/DNS) :

| IP | Machine | Rôle |
|----|---------|------|
| `10.13.37.20` | pc-sofia | Sofia Lenoir, gérante — donne les ordres |
| `10.13.37.10` | pc-marc  | Marc Vidal, comptable — exfiltre les données |
| `10.13.37.66` | kali-op  | l'intrus — scan + intrusion |
| `10.13.37.50` | srv-nordexport | serveur interne |
| `10.13.37.200`| darkdrop-exchange | serveur externe (C2/réception) |

## Arborescence

```
operation-datalink/
├── README.md                 ← ce fichier (enseignant)
├── Makefile                  ← make capture | up | down | ps | clean
├── run-capture.sh            ← génère les scellés (build + scénario + capture)
├── infra/                    ← PRIVÉ enseignant (contient les flags en clair !)
│   ├── docker-compose.yml
│   ├── images/{srv,darkdrop,acteurs,capture}/
│   └── capture/              ← pcap bruts produits par tcpdump
├── scelles/                  ← À DISTRIBUER aux étudiants (phase 1)
│   ├── scelle-01_serveur-interne.pcap
│   └── scelle-02_passerelle.pcap
├── enonce/                   ← À DISTRIBUER aux étudiants
│   ├── 00_briefing-juge.md
│   ├── 01_sujet-phase1.md
│   ├── 02_complement-juge-phase2.md   ← à donner APRÈS validation de la phase 1
│   └── modele-proces-verbal.md
└── correction/               ← PRIVÉ enseignant
    ├── flags.txt
    ├── grille-correction.md
    └── walkthrough.md
```

> ⚠️ **Ne distribuez que `scelles/` et `enonce/`.** Les dossiers `infra/` et
> `correction/` contiennent les flags et la solution.

## Mise en route (enseignant)

Pré-requis : Docker + plugin `docker compose` v2.

```bash
# 1. (Re)générer les scellés PCAP
make capture          # build des images, rejeu du scénario, capture → scelles/

# 2. L'infra reste up pour la phase 2 ; sinon la relancer :
make up               # srv (10.13.37.50) + darkdrop (10.13.37.200)

make ps               # état des conteneurs
make down             # tout arrêter et supprimer
make clean            # down + suppression des pcap générés
```

Les scellés sont **reproductibles** : `make capture` régénère des captures
identiques sur le fond (mêmes flux, mêmes preuves).

## Déroulé pédagogique

1. **Phase 1 (≈ 2 h 30)** — distribuer `scelles/*.pcap` + `enonce/00` + `enonce/01`
   + `enonce/modele-proces-verbal.md`. Les étudiants analysent les captures,
   collectent les 5 preuves et rédigent leur PV.
2. **Remise du PV** — l'enseignant joue le juge : il valide les flags techniques
   (cf. `correction/grille-correction.md`) et lit le raisonnement.
3. **Phase 2 (≈ 45 min)** — pour les binômes ayant validé la phase 1, remettre
   `enonce/02`. Les étudiants doivent disposer d'un **accès réseau** à l'infra
   live (cf. ci-dessous) — **mais pas du code source** — et prouver que
   l'exfiltration se poursuit.

> **Portail en une ou deux phases.** Par défaut le portail s'arrête à la phase 1
> (analyse des scellés PCAP) : les écrans « Phase 2 » et « Preuves P2 » sont
> masqués et la réquisition P6 n'entre pas au classement. Pour ouvrir la phase 2,
> positionnez `PHASE2_ENABLED=1` dans `infra/.env` avant de (re)lancer le portail
> (`make portal`).

### Accès des étudiants à l'infra live (phase 2)

L'infra écoute sur le réseau Docker `10.13.37.0/24`. Deux options :

- **Poste enseignant / serveur de TP** : hébergez l'infra (`make up`) sur une
  machine du réseau de la salle et donnez aux étudiants l'IP joignable du
  serveur (NAT/route vers `10.13.37.50`), sans le dépôt.
- **Sur le poste étudiant** : si vous fournissez l'infra, donnez **uniquement**
  une image/instance déjà construite (pas les sources), ou acceptez que les plus
  curieux puissent lire les flags — réservez alors la phase 2 à une démo.

Test de joignabilité (depuis l'hôte qui héberge l'infra) :

```bash
nmap -sV 10.13.37.50
curl http://10.13.37.50/            # messagerie interne
```

## Notions TCP/IP travaillées

Réassemblage de flux TCP, ports & services, distinction TCP/UDP, ARP
(MAC↔IP), DNS (A/TXT, canal caché), HTTP (requêtes/réponses, URL-encoding),
FTP (canaux contrôle vs données, mode passif), SMTP (commandes, MIME/base64),
détection d'un scan de ports (signature SYN), telnet en clair, horodatage et
construction d'une *timeline*.
