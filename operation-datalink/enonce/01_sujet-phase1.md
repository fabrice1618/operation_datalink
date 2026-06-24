# Opération Datalink — Phase 1 : analyse des scellés

**Information n° 2026/DATALINK — Réquisitions du juge d'instruction**

Vous disposez de deux scellés et du modèle de procès-verbal. Travaillez de
préférence avec **Wireshark** (filtres d'affichage, *Suivre le flux TCP/HTTP*,
*Exporter des objets*). `tcpdump`, `nmap` et un client web/FTP peuvent compléter.

Chaque réquisition décrit la preuve à rapporter et fournit un **indice**
(protocole, filtre, manœuvre) pour vous aider à la localiser. Le jeton seul ne
suffit pas : sa **localisation** (trame, protocole, IP, port) fait toujours foi.

> ⚠️ **Le réseau n'est pas « propre ».** Les captures contiennent du **trafic
> parasite** légitime (résolutions DNS anodines, consultations, mail interne) :
> à vous de **filtrer** le signal du bruit. Et **un jeton d'apparence plausible
> peut être un leurre** — seul un jeton correctement **localisé** et **cohérent**
> avec une infraction est recevable.
>
> ⚠️ **Aucun vrai jeton n'apparaît en clair.** Un simple « rechercher DATALINK »
> ne suffit plus : chaque preuve demande de **reconstituer le flux** du protocole
> *puis* de **décoder** — suivez l'indice de chaque réquisition.

---

## Réquisition n° 1 — Coordination du trafic illicite *(scellé 01)*

Deux personnes de la société échangent, via la **messagerie web interne**
(trafic HTTP en clair), au sujet d'une « livraison » qui doit avoir lieu de nuit.

- Reconstituez la conversation. Qui parle à qui (adresses IP) ?
- Un **code de rendez-vous** est transmis au transporteur. Retrouvez-le.

> *Indice :* les messages circulent en HTTP (port 80). Le code n'est **pas donné
> en clair** : il est **scindé en deux messages**, et chaque moitié est
> **chiffrée en ROT13** (décalage de 13 lettres). Reconstituez le flux, recollez
> les deux moitiés puis appliquez ROT13. (Le corps du POST est aussi URL-encodé,
> `%7B` = `{`… ; Wireshark le restitue.)

**À rapporter :** le jeton `DATALINK{...}` (le code de rendez-vous) + qualification.

---

## Réquisition n° 2 — Exfiltration de la base clients *(scellé 02)*

Un fichier a été transféré vers un serveur externe. Il contiendrait des
**données personnelles de clients** (état civil, e-mail, IBAN…).

- Identifiez le protocole de transfert, les identifiants utilisés et le nom
  du fichier.
- **Reconstituez le fichier** transféré et examinez son contenu.

> *Indice :* le protocole sépare le canal de **contrôle** du canal de
> **données**. Dans Wireshark, *Fichier → Exporter des objets* ou le suivi du
> flux de données permet de récupérer le fichier. Le jeton figure dans la 1re
> ligne d'en-tête, mais **inscrit à l'envers** : relisez-le de droite à gauche.

**À rapporter :** le jeton `DATALINK{...}` + l'estimation du nombre de victimes
+ qualification (atteinte aux données personnelles / RGPD).

---

## Réquisition n° 3 — Menaces et chantage *(scellé 01)*

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

Une machine du réseau s'est introduite **sans droit** dans le serveur interne.

- Repérez la phase de **reconnaissance** : une seule machine teste un grand
  nombre de ports en peu de temps. Quelle est son IP ? Combien de ports testés ?
- Repérez ensuite la **connexion d'administration réussie** (protocole en clair).
  Retrouvez l'identifiant, le mot de passe, et le **jeton d'accès** lu sur le
  serveur.

> *Indice :* la signature d'un scan = de nombreux paquets **SYN** depuis une même
> source vers des ports successifs (`tcp.flags.syn==1 && tcp.flags.ack==0`).
> L'administration passe par **telnet** (port 23), en clair : *Suivre le flux TCP*
> reconstitue toute la session. Attention : `access.txt` ne contient pas le jeton
> en clair mais une **chaîne hexadécimale** à décoder (le fichier `notes.txt` le
> précise).

**À rapporter :** le jeton `DATALINK{...}` (lu via `cat /root/access.txt`, puis
décodé de l'hexadécimal) + l'IP de l'intrus + qualification (accès et maintien
frauduleux dans un STAD).

---

## Réquisition n° 5 — Canal caché de commande *(scellé 02)*

Le poste qui a exfiltré les données dialogue aussi avec un **serveur de noms**
externe. Une requête particulière sert de **canal de communication caché**.

- Identifiez les domaines résolus (qui est `darkdrop-exchange.net` ?).
- Une requête de type **TXT** reçoit en réponse une chaîne suspecte. Récupérez-la.

> *Indice :* protocole DNS (UDP port 53). Filtrez `dns` et observez la réponse à
> la requête `status.darkdrop-exchange.net` (type **TXT**). La valeur du champ
> `key=` est **encodée en base64** : décodez-la pour obtenir le jeton.

**À rapporter :** le jeton `DATALINK{...}` + l'explication du mécanisme
(pourquoi le DNS permet-il un canal de communication discret ?).

---

## Défis bonus (facultatifs, non notés au socle)

Pour les binômes en avance — à mentionner dans le PV, valorisés en badges :

- **Usurpation (R3).** L'en-tête `From:` du mail de chantage désigne une
  personne ; l'IP source et l'enveloppe `MAIL FROM` en désignent une autre. Qui
  a *réellement* envoyé le message ?
- **Homme du milieu (R4).** Filtrez `arp` : une machine se fait passer pour la
  **passerelle** juste avant l'intrusion. Caractérisez l'attaque.
- **Corrélation des scellés.** Recoupez l'horodatage du transfert FTP (scellé 02)
  avec un message du chat (scellé 01). Que prouve cette concomitance ?
- **Pistes express.** Estimez le **débit d'exfiltration** FTP ; reconstituez la
  **timeline** des faits à la seconde près.

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
