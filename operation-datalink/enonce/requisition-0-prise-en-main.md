# Réquisition n° 0 — Prise en main guidée

**Information n° 2026/DATALINK — Avant l'ouverture des scellés**

Avant de vous confier les vraies pièces, le cabinet vous demande de **calibrer vos
outils**. Un **scellé d'entraînement** — sans valeur probante, jetable — vous est
remis : il contient une capture minuscule (une vingtaine de secondes) où circulent
un échange **HTTP**, une résolution **DNS** et un **ping** (ICMP).

Votre objectif n'est pas d'enquêter, mais de vérifier que vous maîtrisez les **quatre
gestes** que vous répéterez sur chaque réquisition. Au bout du parcours, un **jeton
d'entraînement** vous attend : reportez-le dans la case d'auto-vérification pour
confirmer que tout est en place.

> **Outils.** Travaillez avec **Wireshark** (recommandé). Gardez les deux antisèches
> sous la main : [antisèche Wireshark](/aide/wireshark) et
> [antisèche tcpdump](/aide/tcpdump). Elles restent accessibles à tout moment depuis
> le menu **Aide** en haut de page.

---

## Le scellé d'entraînement

- **Capture :** [`scelle-00_formation.pcap` ↓](/captures/scelle-00_formation.pcap)
- Trafic attendu : un poste (`10.13.37.30`) interroge un serveur interne
  (`10.13.37.50`).

Téléchargez ce fichier, puis ouvrez-le dans Wireshark (*Fichier → Ouvrir*).

---

## Les 4 gestes à maîtriser

### Geste 1 — Filtrer l'affichage

Dans la barre de **filtre d'affichage** (en haut), saisissez :

```
http
```

Validez (Entrée). La liste ne montre plus que les paquets HTTP : le `GET` du poste et
la réponse `200 OK` du serveur. Le `ping` (ICMP) et la requête DNS ont disparu de la
vue — c'est tout l'intérêt d'un filtre. Essayez aussi `dns`, puis `icmp` pour les
faire réapparaître, puis revenez à `http`.

> *Le filtre d'**affichage** ne supprime rien de la capture : il masque seulement ce
> qui ne correspond pas. Voir l'[antisèche Wireshark](/aide/wireshark), §2.*

### Geste 2 — Suivre le flux

Clic droit sur la requête `GET` → **Suivre → Flux TCP** (*Follow → TCP Stream*).
Une fenêtre reconstitue toute la conversation : la requête du poste, puis la réponse
du serveur et son contenu. C'est ainsi que vous lirez les échanges en clair.

### Geste 3 — Exporter un objet

Fermez la fenêtre de flux. Allez dans **Fichier → Exporter des objets → HTTP**
(*File → Export Objects → HTTP*). La liste affiche le fichier transporté par la
réponse : `indice-formation.txt`. Sélectionnez-le puis **Enregistrer**.

### Geste 4 — Lire le jeton

Ouvrez le fichier exporté. Il contient le **jeton d'entraînement** au format
`DATALINK{...}`. C'est exactement la démarche que vous suivrez pour récupérer les
pièces des réquisitions 1 à 5.

---

## Auto-vérification

Reportez le jeton trouvé dans la case **Auto-vérification** ci-dessous. Une réponse
`VALIDÉE` confirme que vos quatre gestes sont opérationnels : vous êtes prêts pour les
vrais scellés.

> *Ce jeton ne compte pas dans le barème de l'enquête : c'est un simple test de
> matériel.*
