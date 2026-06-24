# Opération Datalink — grille de correction (CONFIDENTIEL enseignant)

Barème indicatif sur **20 points** : 10 pts pour les preuves (2 pts/réquisition —
R1 = relevé des 4 faits, R2 = relevé des 5 faits, R3 à R5 = jeton), 6 pts pour la qualité du PV
(localisation, identification des protagonistes, timeline, qualification
juridique), 4 pts pour la phase 2.

> La preuve (jeton ou relevé) prouve que l'étudiant a *trouvé* la pièce ; les
> points « PV » valident qu'il *sait l'exploiter* (localisation + raisonnement).
> Ne validez une preuve que si elle est correctement **localisée**.

---

## Preuve P1 — Coordination du trafic *(scellé 01)*
- **Relevé d'enquête (4 faits, plus de jeton) :**
  - **Suspects :** Sofia Lenoir (`10.13.37.20`) et Marc Vidal (`10.13.37.10`).
  - **Transporteur :** Transports Caron (alias « Caron » accepté).
  - **Date de chargement :** 14/05/2026 (nuit du 14 mai, 03h00 ; alias
    « 14/5/2026 », « 14 mai 2026 »).
  - **N° de colis :** NX-4417 (alias « nx4417 »).
- **Saisie portail :** formulaire d'enquête de la réquisition 1. L'étape (P1)
  n'est validée que si les **4 champs** sont exacts ; seuls les champs corrects
  sont verrouillés (saisie insensible casse/accents/ordre).
- **Piège pédagogique :** un message anodin signé **IT-Support** évoque une
  *autre* tournée (Transports **Brel**, le **12/05**, colis **RH-0090**) : c'est
  un **leurre**. N'acceptez que les faits échangés entre les deux suspects.
- **Localisation attendue :** flux HTTP (port 80), requêtes `POST /post` entre
  `10.13.37.20` (Sofia) et `10.13.37.10` (Marc) → serveur `10.13.37.50`.
- **Qualification :** trafic de stupéfiants / coordination (art. 222-37 CP) ;
  élément d'association de malfaiteurs (art. 450-1 CP).

## Preuve P2 — Exfiltration de la base clients *(scellé 02)*
- **Relevé d'enquête (5 faits, plus de jeton) :**
  - **Clients impactés :** **10** (enregistrements du CSV reconstitué).
  - **Identifiant FTP :** `depot`.
  - **Mot de passe FTP :** `Pr1nt3mps2026!`.
  - **IP du serveur :** `10.13.37.200` (darkdrop, destination du transfert).
  - **IP de l'utilisateur :** `10.13.37.10` (poste de Marc, source).
- **Saisie portail :** formulaire d'enquête de la réquisition 2. L'étape (P2)
  n'est validée que si les **5 champs** sont exacts ; seuls les champs corrects
  sont verrouillés (saisie insensible casse/accents).
- **Localisation attendue :** FTP (port 21) de `10.13.37.10` (Marc) →
  `10.13.37.200` ; commandes `USER depot` / `PASS Pr1nt3mps2026!` /
  `STOR clients_nordexport.csv` ; fichier reconstitué via le **canal de données
  passif** (ports 30000-30009) ou *Exporter des objets*. Le fichier reconstitué
  compte **10 enregistrements** de clients ; données = IBAN, e-mail, état civil.
- **Qualification :** collecte/transfert illicites de données personnelles
  (art. 226-18 / 226-22 CP), atteinte au RGPD ; recel.

## Preuve P3 — Menaces / chantage *(scellé 01)*
- **Flag :** `DATALINK{RANCON_50000E_BTC}`
- **Localisation attendue :** SMTP (port 25) de `10.13.37.20` → `10.13.37.50` ;
  `MAIL FROM:<s.lenoir@nordexport.lan>`, `RCPT TO:<directeur@groupe-rival.example>`,
  objet « Derniere mise en garde ». Pièce jointe `conditions_diffusion.txt`
  **base64** à décoder.
- **Attendu en plus :** montant **50 000 EUR en BTC**, délai 72 h.
- **Bonus — usurpation :** l'en-tête `From:` affiche `m.vidal@nordexport.lan`
  (Marc), mais le vrai émetteur est **Sofia** — IP source `10.13.37.20`, enveloppe
  `MAIL FROM:<s.lenoir@nordexport.lan>`. Valoriser qui ne se fie pas à l'en-tête.
  En socle, tolérer toute identification d'expéditeur corroborée par l'IP source.
- **Qualification :** chantage (art. 312-10 CP) / menaces (art. 222-17 CP).

## Preuve P4 — Intrusion dans le serveur *(scellé 01)*
- **Flag :** `DATALINK{STAD_ROOT_NORDEXPORT}`
- **Localisation attendue :** scan = ~**102** paquets SYN de `10.13.37.66` vers
  les ports 1-100 + 443 de `10.13.37.50`
  (`tcp.flags.syn==1 && tcp.flags.ack==0 && ip.src==10.13.37.66`). Puis session
  **telnet** (port 23) : login `admin` / `Adm1n-NordExport!`.
- **Piège pédagogique :** `cat /root/access.txt` n'affiche pas le jeton mais une
  **chaîne hexadécimale** à décoder (`xxd -r -p`) ; `cat /root/notes.txt` l'indique.
- **Bonus — MITM / ARP :** avant le telnet, `.66` émet des **ARP gratuits**
  usurpant la passerelle `.1` (filtre `arp`). Valoriser la caractérisation du MITM.
- **Qualification :** accès et maintien frauduleux dans un STAD (art. 323-1 CP).

## Preuve P5 — Canal caché DNS *(scellé 02)*
- **Flag :** `DATALINK{TUNNEL_DNS_C2_ACTIF}`
- **Localisation attendue :** DNS (UDP 53) de `10.13.37.10` → `10.13.37.200` ;
  requête **TXT** `status.darkdrop-exchange.net`. La valeur `key=` est **encodée
  en base64** (`key=REFUQUxJTkt7…`) : à décoder pour obtenir le jeton.
- **Attendu en plus :** explique que le DNS, souvent autorisé en sortie et peu
  inspecté, permet de faire transiter commandes/données discrètement
  (tunneling / canal de C2).
- **Qualification :** élément matériel du C2 / association de malfaiteurs.

## Identification des protagonistes (points PV)
Attendu : tableau IP ↔ MAC ↔ rôle, reconstruit via **ARP** et **DNS**.
Cf. `flags.txt` pour la correspondance. Le poste `10.13.37.40` (`pc-it`) est un
**leurre/bruit** légitime (support informatique), à distinguer des suspects.

## Leurre & bruit de fond
- Le réseau contient du **trafic parasite** (DNS anodin, GET sur la messagerie,
  mail interne banal) émis par `10.13.37.40` : c'est volontaire, pour exercer le
  **filtrage**. Un PV qui le qualifie d'« activité criminelle » est à reprendre.
- Le faux jeton `DATALINK{ARCHIVE_SAUVEGARDE_2025}` (message « IT-Support » du
  chat) est un **leurre**. Rendu **sans localisation cohérente**, il est
  irrecevable et **sanctionné** : il matérialise « la localisation fait foi ».
  Le portail le rejette de toute façon (jeton non enregistré).

## Défis bonus (non notés au socle — badges / points d'émulation)
- **Usurpation SMTP** (cf. P3) : vrai émetteur = Sofia malgré l'en-tête `From`.
- **MITM / ARP** (cf. P4) : `.66` usurpe la passerelle `.1`.
- **Corrélation inter-scellés** : STOR FTP (02) ↔ chat « j'efface l'historique »
  (01) ; `darkdrop`/`.200` relié entre chat (01), DNS et FTP (02).
- Autres pistes rapides : débit d'exfiltration FTP, timeline à la seconde.

---

## Phase 2 — Persistance de l'infraction
- **Flag :** `DATALINK{SEQUESTRE_EXFIL_TOUJOURS_ACTIVE}`
- **Attendu :** `nmap -sV 10.13.37.50` → ports 80 (HTTP), 25 (SMTP), 23 (telnet).
  Découverte de la page `/admin/exfil-status` (jamais présente dans les scellés)
  prouvant une tâche d'exfiltration toujours active.
- **Raisonnement valorisé :** distinction entre preuve figée (scellé, faits
  passés) et constat live (faits **en cours**) → infraction continue.

## Erreurs fréquentes à sanctionner légèrement
- Flag rendu sans localisation (n° de trame / IP / port) → jeton non recevable.
- **Leurre `DATALINK{ARCHIVE_SAUVEGARDE_2025}` rendu comme une vraie preuve.**
- Confusion canal de contrôle / canal de données en FTP.
- R1 : faits du **leurre IT-Support** (Transports Brel / 12/05 / RH-0090) rendus
  à la place de ceux des suspects.
- Décodage incomplet : base64 (P3, P5), hexadécimal (P4).
- Confusion entre l'IP de l'intrus (.66) et celle du serveur (.50).
