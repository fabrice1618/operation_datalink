# Opération Datalink — Phase 2 : supplément d'information

**Information n° 2026/DATALINK — Ordonnance de soit-communiqué**
**À ne consulter qu'après validation de la phase 1 par le juge.**

---

Enquêteurs,

Vos premières conclusions sont versées au dossier. Elles établissent des faits
**passés** (les scellés sont figés). Or la défense soutient que l'activité a
cessé et qu'aucune donnée ne quitte plus l'entreprise.

Le serveur interne de NordExport (`10.13.37.50`) a été placé **sous séquestre
mais maintenu en fonctionnement** pour les besoins de l'enquête. Vous disposez
d'un **accès réseau** à cette machine (vous n'avez **pas** accès à sa
configuration interne).

**Réquisition complémentaire — prouvez que l'exfiltration se poursuit.**

1. **Cartographiez les services encore actifs** sur `10.13.37.50` (balayage de
   ports et identification des services). Comparez avec ce que montraient les
   scellés : un service est-il exposé que vous n'aviez pas vu « en action » ?
2. **Explorez le service web** : au-delà de la page d'accueil, le serveur expose
   une page d'**administration** qui n'apparaissait dans aucune capture (elle
   n'avait jamais été consultée pendant la période sous écoute). Trouvez-la et
   relevez ce qu'elle révèle sur l'exfiltration **en cours**.

> *Indices :* `nmap -sV 10.13.37.50` pour les services. Pour le web, pensez aux
> chemins d'administration usuels (`/admin/...`), et au fait qu'un nom de page
> évoquant le « statut » de l'« exfiltration » a pu être laissé en place par les
> mis en cause.

**À rapporter :** le **jeton** `DATALINK{...}` exposé par la page
d'administration, la **liste des services ouverts** (port + service), et une
note expliquant en quoi cet élément **postérieur aux scellés** démontre la
persistance de l'infraction (utile pour requalifier les faits en infraction
**continue**).

Fait au cabinet.
Le Juge d'instruction.
