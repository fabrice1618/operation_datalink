# Opération Datalink — Saisine du cabinet d'instruction

**TRIBUNAL JUDICIAIRE — Cabinet de Mme/M. le Juge d'instruction**
**Information judiciaire n° 2026/DATALINK**
**Mention : CONFIDENTIEL — réservé aux enquêteurs désignés**

---

Mesdames, Messieurs les enquêteurs de la section cyber,

Une information judiciaire est ouverte contre X des chefs de **trafic de
stupéfiants**, **atteinte à un système de traitement automatisé de données**,
**collecte et transfert illicites de données à caractère personnel**,
**chantage** et **association de malfaiteurs**.

Les soupçons portent sur la société **NordExport SARL**, suspectée de n'être
qu'une société-écran. Lors d'une perquisition, les services techniques ont
réalisé deux captures du trafic réseau de l'entreprise (réseau interne
`10.13.37.0/24`), placées sous scellés :

- **Scellé n° 01** — [`scelle-01_serveur-interne.pcap` ↓](/captures/scelle-01_serveur-interne.pcap) (sonde sur le serveur interne)
- **Scellé n° 02** — [`scelle-02_passerelle.pcap` ↓](/captures/scelle-02_passerelle.pcap) (sonde sur la passerelle vers l'extérieur)

Je vous confie ces scellés. **Votre mission : qualifier les infractions et
m'en rapporter les preuves matérielles.** Chaque preuve devra être :

1. **localisée** précisément dans la capture (n° de trame, protocole, IP source
   et destination, port, horodatage) ;
2. **expliquée** (que démontre-t-elle ? quelle infraction caractérise-t-elle ?) ;
3. **consignée** dans le procès-verbal type fourni (`modele-proces-verbal.md`).

Pour la plupart des preuves, un **jeton de scellé** au format `DATALINK{...}` est
présent dans les données — mais **rarement en clair** : il faut le plus souvent
reconstituer le flux du protocole, puis le **décoder**. Il atteste que vous avez
bien mis la main sur la pièce, et non sur une simple impression. Les **réquisitions
1 et 2** font exception : elles ne livrent pas de jeton mais un **relevé de faits**
à saisir dans le formulaire d'enquête du portail. Soyez vigilants : le trafic
comporte du **bruit** légitime et un éventuel **leurre** ; seule une pièce
correctement **localisée** et cohérente est recevable.

⚠️ **Rappel déontologique (chaîne de preuve).** Ne travaillez que sur des copies
des scellés. Notez systématiquement *où* vous avez trouvé chaque élément : une
preuve non localisable est irrecevable.

Vous trouverez le détail de mes réquisitions dans le document `01_sujet-phase1.md`.
Selon vos conclusions, je pourrai vous adresser un supplément d'information.

Fait au cabinet, le 10 juin 2026.
Le Juge d'instruction.
