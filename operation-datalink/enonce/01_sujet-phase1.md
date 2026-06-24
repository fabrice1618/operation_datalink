# Opération Datalink — Phase 1 : analyse des scellés

**Information n° 2026/DATALINK — Réquisitions du juge d'instruction**

Vous disposez de deux scellés et du modèle de procès-verbal. Travaillez de
préférence avec **Wireshark** (filtres d'affichage, *Suivre le flux TCP/HTTP*,
*Exporter des objets*). `tcpdump`, `nmap` et un client web/FTP peuvent compléter.

Chaque réquisition décrit la preuve à rapporter et fournit un **indice**
(protocole, filtre, manœuvre) pour vous aider à la localiser. Le fait seul ne
suffit pas : sa **localisation** (trame, protocole, IP, port) fait toujours foi.
Les **cinq réquisitions** sont des **relevés d'enquête** : elles ne livrent pas de
jeton mais un ensemble de **faits** à reconstituer dans le flux puis à saisir dans
le **formulaire d'enquête** du portail. Une réquisition n'est validée que lorsque
**tous** ses champs sont exacts ; seuls les champs corrects sont verrouillés.

> ⚠️ **Le réseau n'est pas « propre ».** Les captures contiennent du **trafic
> parasite** légitime (résolutions DNS anodines, consultations, mail interne) :
> à vous de **filtrer** le signal du bruit. Et **un jeton d'apparence plausible
> peut être un leurre** — un fait n'est recevable que correctement **localisé** et
> **cohérent** avec une infraction.
>
> ⚠️ **Aucun jeton à chasser.** Un simple « rechercher DATALINK » ne sert à rien :
> le seul littéral `DATALINK{...}` des captures est un **leurre**. Chaque preuve
> demande de **reconstituer le flux** du protocole *puis*, pour certaines, de
> **décoder** (base64) le contenu — suivez l'indice de chaque réquisition et
> relevez les faits demandés.

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

Cette réquisition ne cache **pas de jeton** : **reconstituez le message** (et sa
pièce jointe) puis **relevez les faits**. Vous les saisirez dans le **formulaire
d'enquête** du portail (réquisition 3). L'étape n'est validée que lorsque les
**cinq** éléments sont exacts ; seuls les éléments corrects sont verrouillés.

Relevez et saisissez :

1. le **destinataire** du message ;
2. le **montant exigé** (en chiffres) ;
3. le **mode de paiement** (la monnaie réclamée) ;
4. le **délai** imparti pour répondre ;
5. le **nom de la pièce jointe**.

> *Indice :* protocole SMTP (port 25), *Suivre le flux TCP*. Le **destinataire** et
> le **nom de la pièce jointe** se lisent dans les en-têtes ; le **délai** figure
> dans le corps du message ; le **montant** et le **mode de paiement** sont dans la
> pièce jointe, **encodée en base64** (`Content-Transfer-Encoding: base64`) :
> décodez le bloc pour la lire.

**À rapporter au PV :** les cinq éléments + qualification (chantage / extorsion) +
leur localisation (trames, IP src/dst, port, horodatage).

---

## Réquisition n° 4 — Intrusion dans le serveur *(scellé 01)*

Une machine du réseau s'est introduite **sans droit** dans le serveur interne.

Cette réquisition ne cache **pas de jeton** : **caractérisez le scan** puis
**reconstituez la session d'administration**, et **relevez les faits**. Vous les
saisirez dans le **formulaire d'enquête** du portail (réquisition 4). L'étape
n'est validée que lorsque les **quatre** éléments sont exacts ; seuls les éléments
corrects sont verrouillés.

Relevez et saisissez :

1. l'**adresse IP de l'intrus** ;
2. le **nombre de ports** testés pendant la reconnaissance ;
3. l'**identifiant** d'administration intercepté ;
4. le **mot de passe** intercepté.

> *Indice :* la signature d'un scan = de nombreux paquets **SYN** depuis une même
> source vers des ports successifs (`tcp.flags.syn==1 && tcp.flags.ack==0`) ;
> comptez les ports distincts visés. L'administration passe par **telnet**
> (port 23), en clair : *Suivre le flux TCP* reconstitue toute la session, dont
> l'**identifiant** et le **mot de passe** saisis à la connexion.

**À rapporter au PV :** les quatre éléments + l'IP de l'intrus + qualification
(accès et maintien frauduleux dans un STAD) + leur localisation (trames, IP
src/dst, port, horodatage).

---

## Réquisition n° 5 — Canal caché de commande *(scellé 02)*

Le poste qui a exfiltré les données dialogue aussi avec un **serveur de noms**
externe. Une requête particulière sert de **canal de communication caché**.

Cette réquisition ne cache **pas de jeton** : **identifiez le canal caché** puis
**décodez l'ordre** qu'il transporte, et **relevez les faits**. Vous les saisirez
dans le **formulaire d'enquête** du portail (réquisition 5). L'étape n'est validée
que lorsque les **cinq** éléments sont exacts ; seuls les éléments corrects sont
verrouillés.

Relevez et saisissez :

1. le **domaine** du serveur externe (C2) ;
2. l'**adresse IP** résolue de ce domaine ;
3. le **type d'enregistrement** DNS détourné ;
4. le **sous-domaine** complet de la requête de contrôle ;
5. l'**ordre transmis** (valeur du champ `key=`, décodée du base64).

> *Indice :* protocole DNS (UDP port 53). Filtrez `dns` : la réponse **A** donne
> l'IP du domaine ; repérez ensuite la requête **TXT**
> `status.darkdrop-exchange.net`. La valeur du champ `key=` est **encodée en
> base64** : décodez-la pour lire l'ordre transmis par le C2.

**À rapporter au PV :** les cinq éléments + l'explication du mécanisme (pourquoi le
DNS permet-il un canal de communication discret ?) + leur localisation.

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

1. pour chaque réquisition, les **faits relevés** — R1 : suspects, transporteur,
   date de chargement, n° de colis ; R2 : nombre de clients, identifiant, mot de
   passe, IP serveur, IP poste ; R3 : destinataire, montant, mode de paiement,
   délai, pièce jointe ; R4 : IP de l'intrus, nombre de ports, identifiant, mot de
   passe ; R5 : domaine et IP du C2, type d'enregistrement, sous-domaine, ordre
   décodé — chacun avec sa localisation (trame, protocole, IP src/dst, port,
   horodatage) ;
2. le **schéma des protagonistes** (qui est qui : IP, MAC, rôle) — utilisez les
   trames **ARP** et **DNS** pour relier adresses et identités ;
3. une **chronologie** des faits (timeline) ;
4. pour chaque preuve, l'**infraction** qu'elle caractérise.

Bonne enquête.
