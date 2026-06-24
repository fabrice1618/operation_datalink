# Opération Datalink — grille de correction (CONFIDENTIEL enseignant)

Barème indicatif sur **20 points** : 10 pts pour les jetons (2 pts/preuve),
6 pts pour la qualité du PV (localisation, identification des protagonistes,
timeline, qualification juridique), 4 pts pour la phase 2.

> Le jeton prouve que l'étudiant a *trouvé* la pièce ; les points « PV » valident
> qu'il *sait l'exploiter* (localisation + raisonnement). Ne validez le flag que
> s'il est correctement **localisé**.

---

## Preuve P1 — Coordination du trafic *(scellé 01)*
- **Flag :** `DATALINK{RDV_QUAI17_14MAI_0300}`
- **Piège pédagogique :** dans la capture, le code est **URL-encodé**
  (`DATALINK%7BRDV_QUAI17_14MAI_0300%7D`). N'acceptez le flag qu'une fois
  **décodé** (`%7B`→`{`, `%7D`→`}`). Tolérance : si l'étudiant rend la forme
  encodée mais explique le décodage, accepter.
- **Localisation attendue :** flux HTTP (port 80), requête `POST /post` de
  `10.13.37.20` (Sofia) → `10.13.37.50`.
- **Qualification :** trafic de stupéfiants / coordination (art. 222-37 CP) ;
  élément d'association de malfaiteurs (art. 450-1 CP).

## Preuve P2 — Exfiltration de la base clients *(scellé 02)*
- **Flag :** `DATALINK{4213_CLIENTS_RGPD_EXFILTRES}`
- **Localisation attendue :** FTP (port 21) de `10.13.37.10` (Marc) →
  `10.13.37.200` ; commandes `USER depot` / `PASS Pr1nt3mps2026!` /
  `STOR clients_nordexport.csv` ; fichier reconstitué via le **canal de données
  passif** (ports 30000-30009) ou *Exporter des objets*. Jeton dans la 1re ligne.
- **Attendu en plus :** ~**4213** victimes ; données = IBAN, e-mail, état civil.
- **Qualification :** collecte/transfert illicites de données personnelles
  (art. 226-18 / 226-22 CP), atteinte au RGPD ; recel.

## Preuve P3 — Menaces / chantage *(scellé 01)*
- **Flag :** `DATALINK{RANCON_50000E_BTC}`
- **Localisation attendue :** SMTP (port 25) de `10.13.37.20` → `10.13.37.50` ;
  `MAIL FROM:<s.lenoir@nordexport.lan>`, `RCPT TO:<directeur@groupe-rival.example>`,
  objet « Derniere mise en garde ». Pièce jointe `conditions_diffusion.txt`
  **base64** à décoder.
- **Attendu en plus :** montant **50 000 EUR en BTC**, délai 72 h.
- **Qualification :** chantage (art. 312-10 CP) / menaces (art. 222-17 CP).

## Preuve P4 — Intrusion dans le serveur *(scellé 01)*
- **Flag :** `DATALINK{STAD_ROOT_NORDEXPORT}`
- **Localisation attendue :** scan = ~**102** paquets SYN de `10.13.37.66` vers
  les ports 1-100 + 443 de `10.13.37.50`
  (`tcp.flags.syn==1 && tcp.flags.ack==0 && ip.src==10.13.37.66`). Puis session
  **telnet** (port 23) : login `admin` / `Adm1n-NordExport!`, commande
  `cat /root/access.txt` révélant le jeton.
- **Qualification :** accès et maintien frauduleux dans un STAD (art. 323-1 CP).

## Preuve P5 — Canal caché DNS *(scellé 02)*
- **Flag :** `DATALINK{TUNNEL_DNS_C2_ACTIF}`
- **Localisation attendue :** DNS (UDP 53) de `10.13.37.10` → `10.13.37.200` ;
  requête **TXT** `status.darkdrop-exchange.net`, jeton dans la valeur du TXT
  (`v=c2; cmd=exfil; key=DATALINK{...}`).
- **Attendu en plus :** explique que le DNS, souvent autorisé en sortie et peu
  inspecté, permet de faire transiter commandes/données discrètement
  (tunneling / canal de C2).
- **Qualification :** élément matériel du C2 / association de malfaiteurs.

## Identification des protagonistes (points PV)
Attendu : tableau IP ↔ MAC ↔ rôle, reconstruit via **ARP** et **DNS**.
Cf. `flags.txt` pour la correspondance.

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
- Confusion canal de contrôle / canal de données en FTP.
- Oubli du décodage URL (P1) ou base64 (P3).
- Confusion entre l'IP de l'intrus (.66) et celle du serveur (.50).
