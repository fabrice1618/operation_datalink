# Opération Datalink — Phase 1 : analyse des scellés

**Information n° 2026/DATALINK — Réquisitions du juge d'instruction**

Vous disposez de deux scellés et du modèle de procès-verbal. Travaillez de
préférence avec **Wireshark** (filtres d'affichage, *Suivre le flux TCP/HTTP*,
*Exporter des objets*). `tcpdump`, `nmap` et un client web/FTP peuvent compléter.

Chaque réquisition décrit la preuve à rapporter et fournit un **indice**
(protocole, filtre, manœuvre) pour vous aider à la localiser. Le jeton seul ne
suffit pas : sa **localisation** (trame, protocole, IP, port) fait toujours foi.
Les **réquisitions 1 et 2** font exception : elles ne livrent pas de jeton mais un
**relevé de faits** à saisir dans le formulaire d'enquête du portail.

> ⚠️ **Le réseau n'est pas « propre ».** Les captures contiennent du **trafic
> parasite** légitime (résolutions DNS anodines, consultations, mail interne) :
> à vous de **filtrer** le signal du bruit. Et **un jeton d'apparence plausible
> peut être un leurre** — seul un jeton correctement **localisé** et **cohérent**
> avec une infraction est recevable.
>
> ⚠️ **Aucun vrai jeton n'apparaît en clair.** Un simple « rechercher DATALINK »
> ne suffit plus : pour les réquisitions 3 à 5, chaque preuve demande de
> **reconstituer le flux** du protocole *puis* de **décoder** — suivez l'indice
> de chaque réquisition. Les réquisitions 1 et 2 ne cachent pas de jeton : elles
> demandent de **relever des faits** (la conversation HTTP pour R1, le transfert
> FTP pour R2).

---

## Réquisition n° 1 — Coordination du trafic illicite *(scellé 01)*

Deux personnes de la société échangent, via la **messagerie web interne**
(trafic HTTP en clair), au sujet d'une « livraison » qui doit avoir lieu de nuit.

Cette réquisition ne cache **pas de jeton** : **reconstituez la conversation**
puis **extrayez les faits**. Vous les saisirez dans le **formulaire d'enquête**
du portail (réquisition 1). L'étape n'est validée que lorsque les **quatre**
éléments sont exacts ; seuls les éléments corrects sont verrouillés.

Relevez et saisissez :

1. les **noms des deux suspects** qui coordonnent la livraison (prénom + nom) ;
2. le **transporteur** chargé d'acheminer la marchandise ;
3. la **date de chargement** (format `JJ/MM/AAAA`) ;
4. le **numéro de colis**.

> *Indice :* les messages circulent en HTTP (port 80). Dans Wireshark, filtre
> `http` → *Suivre → Flux HTTP* sur les requêtes `POST /post` ; le corps est
> URL-encodé (`%7B` = `{`…), restitué automatiquement. **Méfiez-vous du bruit :**
> un message anodin signé `IT-Support` évoque une *autre* tournée (autre
> transporteur, autre date, autre colis) — c'est un leurre. Seuls les faits
> échangés **entre les deux suspects** (`10.13.37.20` ↔ `10.13.37.10`) comptent.

**À rapporter au PV :** les quatre éléments + la qualification (entente en vue
d'un trafic illicite) + leur localisation (trames, IP src/dst, port, horodatage).

---

## Réquisition n° 2 — Exfiltration de la base clients *(scellé 02)*

Un fichier a été transféré vers un serveur externe. Il contiendrait des
**données personnelles de clients** (état civil, e-mail, IBAN…).

Cette réquisition ne cache **pas de jeton** : **reconstituez le transfert** puis
**relevez les éléments techniques** qui le caractérisent. Vous les saisirez dans
le **formulaire d'enquête** du portail (réquisition 2). L'étape n'est validée que
lorsque les **cinq** éléments sont exacts ; seuls les éléments corrects sont
verrouillés.

Relevez et saisissez :

1. le **nombre de clients impactés** (nombre d'enregistrements de la base) ;
2. l'**identifiant** de connexion utilisé ;
3. le **mot de passe** de connexion ;
4. l'**adresse IP du serveur** qui reçoit le fichier ;
5. l'**adresse IP du poste** qui l'envoie.

> *Indice :* le protocole sépare le canal de **contrôle** du canal de
> **données**. Le canal de contrôle (FTP, port 21) laisse passer en clair les
> commandes `USER` / `PASS` ainsi que les adresses des deux extrémités. Dans
> Wireshark, *Fichier → Exporter des objets* ou le suivi du flux de **données**
> permet de **reconstituer le fichier** : comptez-y les enregistrements de
> clients.

**À rapporter au PV :** les cinq éléments + qualification (atteinte aux données
personnelles / RGPD) + leur localisation (trames, IP src/dst, port, horodatage).

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

1. pour la **réquisition 1**, les **quatre faits** relevés (suspects,
   transporteur, date de chargement, n° de colis) ; pour la **réquisition 2**, les
   **cinq éléments** du transfert (nombre de clients, identifiant, mot de passe,
   IP serveur, IP poste) ; pour les **réquisitions 3 à 5**, le **jeton**
   `DATALINK{...}` — chacun avec sa localisation (trame, protocole, IP src/dst,
   port, horodatage) ;
2. le **schéma des protagonistes** (qui est qui : IP, MAC, rôle) — utilisez les
   trames **ARP** et **DNS** pour relier adresses et identités ;
3. une **chronologie** des faits (timeline) ;
4. pour chaque preuve, l'**infraction** qu'elle caractérise.

Bonne enquête.
