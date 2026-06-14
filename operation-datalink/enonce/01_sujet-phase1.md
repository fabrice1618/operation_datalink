# Opération Datalink — Phase 1 : analyse des scellés

**Information n° 2026/DATALINK — Réquisitions du juge d'instruction**

Vous disposez de deux scellés et du modèle de procès-verbal. Travaillez de
préférence avec **Wireshark** (filtres d'affichage, *Suivre le flux TCP/HTTP*,
*Exporter des objets*). `tcpdump`, `nmap` et un client web/FTP peuvent compléter.

> **Pas encore à l'aise avec Wireshark ?** Faites d'abord la
> [Réquisition 0 — prise en main](/prise-en-main) (5 min) et gardez les antisèches
> [Wireshark](/aide/wireshark) et [tcpdump](/aide/tcpdump) sous la main.

> **Méthode.** Pour chaque réquisition : repérez le bon protocole (filtre),
> reconstituez l'échange, extrayez le **jeton `DATALINK{...}`**, puis renseignez
> le PV (trame, IP source/destination, port, horodatage, infraction).

Filtres Wireshark utiles : `http`, `ftp`, `ftp-data`, `smtp`, `dns`, `telnet`,
`arp`, `tcp.flags.syn==1 && tcp.flags.ack==0`, `ip.addr==10.13.37.66`.

## Deux voies, à vous de choisir

Chaque réquisition se joue à **deux niveaux**, et **vous choisissez preuve par
preuve** :

- **▸ Voie experte** *(bonus)* — un énoncé **minimal, sans indice** : à vous de
  trouver le bon protocole et la bonne manœuvre. Tout jeton correctement
  **localisé** obtenu par cette voie rapporte un **bonus**.
- **▸ Voie guidée** *(barème standard)* — l'énoncé détaillé **plus un indice**
  (protocole, filtre, manœuvre à employer). Pour démarrer ou se débloquer sans
  rester coincé.

Rien n'est figé : tentez d'abord la voie experte ; si vous bloquez, lisez l'indice
de la voie guidée. Vous ne perdez alors que le **bonus** — jamais les points du
socle. Le jeton **et sa localisation** restent dus dans les deux cas.

---

## Réquisition n° 1 — Coordination du trafic illicite *(scellé 01)*

**▸ Voie experte** *(sans indice — bonus).* Deux personnes de la société
coordonnent une « livraison » nocturne et se transmettent un **code de
rendez-vous**. Reconstituez leur échange, dites qui parle à qui (IP) et extrayez
le jeton `DATALINK{...}` — soignez sa transcription exacte.

**▸ Voie guidée** *(barème standard).*

Deux personnes de la société échangent, via la **messagerie web interne**
(trafic HTTP en clair), au sujet d'une « livraison » qui doit avoir lieu de nuit.

- Reconstituez la conversation. Qui parle à qui (adresses IP) ?
- Un **code de rendez-vous** est transmis au transporteur. Retrouvez-le.

> *Indice :* les messages circulent en HTTP (port 80). Le code apparaît dans
> une requête ; il est **encodé pour l'URL** (`%7B` = `{`, `%7D` = `}`…),
> pensez à le décoder pour obtenir le jeton exact.

**À rapporter :** le jeton `DATALINK{...}` (le code de rendez-vous) + qualification.

---

## Réquisition n° 2 — Exfiltration de la base clients *(scellé 02)*

**▸ Voie experte** *(sans indice — bonus).* Un fichier de **données personnelles
de clients** (état civil, e-mail, IBAN…) a quitté le réseau vers un serveur
externe. Identifiez le moyen de transfert, les identifiants et le nom du fichier,
**reconstituez** le fichier et lisez son en-tête pour le jeton ; estimez le nombre
de victimes.

**▸ Voie guidée** *(barème standard).*

Un fichier a été transféré vers un serveur externe. Il contiendrait des
**données personnelles de clients** (état civil, e-mail, IBAN…).

- Identifiez le protocole de transfert, les identifiants utilisés et le nom
  du fichier.
- **Reconstituez le fichier** transféré et examinez son contenu.

> *Indice :* le protocole sépare le canal de **contrôle** du canal de
> **données**. Dans Wireshark, *Fichier → Exporter des objets* ou le suivi du
> flux de données permet de récupérer le fichier. Le jeton figure dans l'en-tête
> du fichier.

**À rapporter :** le jeton `DATALINK{...}` + l'estimation du nombre de victimes
+ qualification (atteinte aux données personnelles / RGPD).

---

## Réquisition n° 3 — Menaces et chantage *(scellé 01)*

**▸ Voie experte** *(sans indice — bonus).* Un message de **menace réclamant une
rançon** est parti en clair de la société. Retrouvez l'expéditeur, le destinataire
et l'objet, puis récupérez la **pièce jointe** et lisez-la pour en tirer le jeton
et le montant exigé.

**▸ Voie guidée** *(barème standard).*

Un **e-mail de menace** a été envoyé en clair depuis la société. Il réclame une
somme d'argent sous peine de divulgation de documents.

- Retrouvez l'expéditeur, le destinataire et l'objet du message.
- Le détail de la demande se trouve dans une **pièce jointe**. Récupérez-la et
  lisez-la.

> *Indice :* protocole SMTP (port 25). La pièce jointe est **encodée en base64**
> dans le corps du message (`Content-Transfer-Encoding: base64`). Décodez le bloc
> pour révéler son contenu et le jeton.

**À rapporter :** le jeton `DATALINK{...}` (référence de dossier) + le montant
exigé + qualification (chantage / extorsion).

---

## Réquisition n° 4 — Intrusion dans le serveur *(scellé 01)*

**▸ Voie experte** *(sans indice — bonus).* Une machine du réseau s'est introduite
**sans droit** dans le serveur interne. Caractérisez la phase de
**reconnaissance** (IP de l'intrus, nombre de ports testés) puis la **connexion
d'administration réussie** ; relevez l'identifiant, le mot de passe et le **jeton
d'accès** lu sur le serveur.

**▸ Voie guidée** *(barème standard).*

Une machine du réseau s'est introduite **sans droit** dans le serveur interne.

- Repérez la phase de **reconnaissance** : une seule machine teste un grand
  nombre de ports en peu de temps. Quelle est son IP ? Combien de ports testés ?
- Repérez ensuite la **connexion d'administration réussie** (protocole en clair).
  Retrouvez l'identifiant, le mot de passe, et le **jeton d'accès** lu sur le
  serveur.

> *Indice :* la signature d'un scan = de nombreux paquets **SYN** depuis une même
> source vers des ports successifs (`tcp.flags.syn==1 && tcp.flags.ack==0`).
> L'administration passe par **telnet** (port 23), en clair : *Suivre le flux TCP*
> reconstitue toute la session.

**À rapporter :** le jeton `DATALINK{...}` (lu via `cat /root/access.txt`) +
l'IP de l'intrus + qualification (accès et maintien frauduleux dans un STAD).

---

## Réquisition n° 5 — Canal caché de commande *(scellé 02)*

**▸ Voie experte** *(sans indice — bonus).* Le poste qui a exfiltré les données
dialogue avec un service externe via un **canal de communication caché**.
Identifiez les domaines en jeu et la **requête particulière** qui transporte une
chaîne suspecte ; extrayez-en le jeton et expliquez le mécanisme.

**▸ Voie guidée** *(barème standard).*

Le poste qui a exfiltré les données dialogue aussi avec un **serveur de noms**
externe. Une requête particulière sert de **canal de communication caché**.

- Identifiez les domaines résolus (qui est `darkdrop-exchange.net` ?).
- Une requête de type **TXT** reçoit en réponse une chaîne suspecte. Récupérez-la.

> *Indice :* protocole DNS (UDP port 53). Filtrez `dns` et observez la réponse à
> la requête `status.darkdrop-exchange.net` (type **TXT**). Le jeton est dans la
> valeur de l'enregistrement.

**À rapporter :** le jeton `DATALINK{...}` + l'explication du mécanisme
(pourquoi le DNS permet-il un canal de communication discret ?).

---

## Synthèse à fournir au juge

Dans votre procès-verbal :

1. les **5 jetons** `DATALINK{...}` avec, pour chacun, sa localisation (trame,
   protocole, IP src/dst, port, horodatage) ;
2. le **schéma des protagonistes** (qui est qui : IP, MAC, rôle) — utilisez les
   trames **ARP** et **DNS** pour relier adresses et identités ;
3. une **chronologie** des faits (timeline) ;
4. pour chaque preuve, l'**infraction** qu'elle caractérise.

Bonne enquête.
