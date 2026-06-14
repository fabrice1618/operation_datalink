# Opération Datalink — Évolution n° 1 : propositions pédagogiques et ludiques

> Compte rendu d'analyse du TP CTF « Opération Datalink » et propositions pour le
> rendre **plus didactique** (apprentissage TCP/IP) et **plus ludique** (engagement,
> jeu, immersion). Document de travail enseignant — ne pas distribuer.
>
> Date : 2026-06-11 · Périmètre analysé : `enonce/`, `correction/`, `infra/`.

---

## 1. Objet et méthode

Le TP existant est solide : narration d'enquête judiciaire crédible, alignement net
sur le cours TCP/IP, infrastructure Docker **reproductible** (`make capture`), cinq
preuves couvrant HTTP, FTP, SMTP, scan/telnet et DNS, plus une phase 2 sur infra
vivante. La correction (flags, grille, walkthrough) est complète et bien pensée
(double approche Wireshark / `tcpdump`).

Ce document part de cet existant et propose des évolutions **incrémentales**,
classées par axe, chacune avec : intention pédagogique, description concrète,
ancrage dans l'infra actuelle, et estimation impact/effort. L'objectif n'est pas de
tout réécrire mais d'offrir un menu d'améliorations priorisables.

---

## 2. Forces et limites de l'existant

### Forces à préserver
- **Cadre narratif fort** (juge d'instruction, scellés, PV, qualification au CP) :
  c'est l'atout immersif majeur, à exploiter davantage, pas à diluer.
- **Robustesse pédagogique** : les 5 preuves sont *indépendantes*, donc un binôme
  bloqué sur l'une progresse quand même. À conserver comme garde-fou.
- **Tout en clair, reproductible** : la barrière technique est volontairement basse.
- **« Le jeton seul ne suffit pas, la localisation fait foi »** : excellent principe,
  sous-exploité — on peut le *muscler* (cf. leurres, §5).

### Limites identifiées (= opportunités)
1. **Pas de boucle de feedback immédiate.** L'étudiant ne sait pas si un flag est bon
   avant la validation par le juge. Frustrant et peu ludique.
2. **Pas de gamification** : ni tableau des scores, ni *first blood*, ni progression
   visible, ni grades. L'émulation entre binômes n'est pas outillée.
3. **Difficulté plate** : les 5 réquisitions arrivent au même niveau, sans
   échauffement ni différenciation rapides/lents.
4. **Barrière Wireshark** en début de séance : sans prise en main, on perd 30–45 min
   de tâtonnement UI au lieu d'enquêter.
5. **Réalisme forensique limité** : captures « propres », sans bruit. Or filtrer le
   signal du bruit *est* la compétence forensique. Un `strings | grep DATALINK`
   résout presque tout.
6. **ARP purement descriptif** : utilisé seulement pour la table IP↔MAC, alors qu'une
   vraie attaque ARP serait un point TCP/IP marquant.
7. **Scellés cloisonnés** : 01 et 02 s'analysent en silo, aucune preuve n'oblige à
   *corréler* les deux captures.
8. **Attribution triviale** : IP = identité, sans ambiguïté. On rate l'enseignement
   « une IP n'est pas une personne, il faut corroborer ».
9. **Boucle défensive absente** : on observe les attaques sans jamais se demander
   *comment un SOC les détecterait/préviendrait*. La moitié « bleue » manque.
10. **Phase 2 fragile à distribuer** : donner l'accès live sans livrer les flags
    sources est délicat (le README le reconnaît).

---

## 3. Axe « Ludique » — engagement, jeu, immersion

### P1. Plateforme d'auto-validation des flags + tableau des scores *(impact ★★★, effort ★★)*
**Intention :** boucle de feedback immédiate, le cœur du « fun » d'un CTF.
**Proposition :** un petit portail web (CTFd, ou une page statique + micro-service
Flask) où les binômes soumettent leurs `DATALINK{...}`. Le service ne stocke que les
**SHA-256** des flags (jamais en clair), renvoie *correct/incorrect* instantanément,
affiche une **barre de progression** et un **scoreboard** d'équipe avec horodatage
(*first blood*). Bénéfice double : motivation, et l'enseignant est libéré de la
validation technique pour se concentrer sur le **raisonnement du PV** (le vrai
apprentissage). Hébergeable sur le poste enseignant ; aucune fuite de source.

### P2. Système d'indices à coût *(impact ★★, effort ★)*
**Intention :** apprendre à chercher avant de demander, sans laisser personne bloqué.
**Proposition :** pour chaque réquisition, 3 indices gradués — *coup de pouce →
méthode → quasi-solution* — chacun coûtant des points (ex. −0,5 / −1 / −1,5). Soit via
le portail P1, soit en enveloppes scellées (cohérent avec le thème « scellés » !).

### P3. Grades et badges d'enquêteur *(impact ★, effort ★)*
**Intention :** progression visible, immersion renforcée.
**Proposition :** grades narratifs (Stagiaire → Enquêteur → Inspecteur → Commissaire)
débloqués au fil des preuves, plus des badges (*Premier scellé ouvert*, *Décodeur*
pour P1+P3, *Limier DNS*, *First blood*). Purement cosmétique mais efficace.

### P4. Compte à rebours narratif *(impact ★, effort ★)*
**Intention :** tension dramatique, time-boxing déguisé.
**Proposition :** exploiter le « **72 heures** » déjà présent dans le mail de chantage
(P3) comme horloge de la séance : « la rançon expire à H+3 h, bouclez le PV avant ».
Aucune modif d'infra, juste une mise en scène dans le briefing.

### P5. Fil rouge narratif (déverrouillage *souple*) *(impact ★★, effort ★★)*
**Intention :** que chaque découverte *serve* à la suivante → sentiment de progression.
**Proposition :** semer des indices liant les preuves, **sans rendre l'accès gating**
(on préserve l'indépendance, §2-Forces). Exemples ancrés dans l'infra actuelle :
- le chat HTTP (P1) évoque « le dépôt habituel » → oriente vers le FTP darkdrop (P2) ;
- le pied du CSV exfiltré (P2) note « synchro auto, voir statut C2 » → oriente vers le
  TXT DNS (P5) ;
- la session telnet (P4) fait déjà `ls /root` montrant `notes.txt` : un `cat notes.txt`
  pourrait teaser la page d'admin de la phase 2.
Effet : un « *aha* » à chaque étape, mais un binôme peut toujours attaquer une preuve
isolément.

---

## 4. Axe « Difficulté progressive et différenciation »

### P6. Réquisition 0 — prise en main guidée *(impact ★★★, effort ★)*
**Intention :** lever la barrière Wireshark dès la 1re demi-heure.
**Proposition :** une **mini-capture de 20–30 s** (un GET HTTP + une requête DNS + un
ping) accompagnée d'une fiche pas-à-pas : *ouvrir le pcap → appliquer le filtre
`http` → « Suivre le flux » → « Exporter un objet »*. On y dépose un flag
« d'entraînement » jetable (`DATALINK{PRISE_EN_MAIN_OK}`) pour valider que chacun
maîtrise les 4 gestes avant la vraie enquête. Réutilisable d'une promo à l'autre.

### P7. Paliers de difficulté par preuve *(impact ★★, effort ★)* — ✅ traité
**Intention :** servir à la fois les débutants et les rapides.
**Proposition :** dans `01_sujet-phase1.md`, présenter chaque réquisition en deux
niveaux : **« guidé »** (l'indice actuel) et **« expert »** (énoncé minimal, sans
indice, points bonus). Le binôme choisit. Zéro modif d'infra.

### P8. Défis bonus pour les rapides *(impact ★, effort ★★)*
**Intention :** éviter l'ennui des binômes en avance, occuper les 20 dernières minutes.
**Proposition :** pistes optionnelles non notées au socle — p. ex. estimer le débit
d'exfiltration FTP, retrouver le `User-Agent` du chat, reconstituer la *timeline* à la
seconde près, ou repérer un leurre (cf. P9). Récompense en badges.

---

## 5. Axe « Réalisme forensique » (didactique fort)

### P9. Bruit de fond + faux flag (leurre) *(impact ★★★, effort ★★)*
**Intention :** apprendre à **filtrer le signal du bruit** — la compétence forensique
réelle — et **punir le `strings | grep` aveugle**.
**Proposition :** ajouter un acteur « trafic légitime » (NTP, vérification de MAJ
HTTP vers un miroir, requêtes DNS anodines `meteo.example`, ARP gratuit, un mail
interne banal). Et glisser **1 faux jeton** plausible dans un endroit inoffensif
(p. ex. un `User-Agent` ou un fichier benin) :
`DATALINK{ARCHIVE_SAUVEGARDE_2025}`. Le binôme qui le rend *sans localisation
cohérente* est sanctionné — ce qui matérialise enfin le principe « la localisation
fait foi » déjà énoncé dans la grille. Ancrage : un service de plus dans
`docker-compose.yml` + un acteur `poste-bruit.py`.

### P10. Une preuve à corrélation inter-scellés *(impact ★★, effort ★★)*
**Intention :** enseigner la corrélation multi-sources (réflexe SOC).
**Proposition :** rendre **un même fait visible des deux côtés** pour forcer le
recoupement. Ex. : l'horodatage du `STOR` FTP (scellé 02) doit être recoupé avec le
message du chat « j'efface l'historique » (scellé 01) pour établir la concertation.
Ou : le nom `darkdrop-exchange.net` résolu en DNS (02) doit être relié à l'IP
`.200` vue en FTP (02) **et** mentionnée dans le chat (01). La réquisition de
*timeline* devient alors un vrai puzzle de corrélation, pas une simple liste.

### P11. Attribution non triviale : usurpation *(impact ★★, effort ★★★)*
**Intention :** « une IP/une adresse d'expéditeur ≠ une personne ».
**Proposition :** introduire **une usurpation** à débusquer. Deux pistes :
- *SMTP* : l'enveloppe `MAIL FROM` ne correspond pas à l'entête `From:` (expéditeur
  usurpé) → l'étudiant doit corroborer par l'IP source réelle plutôt que de croire
  l'entête. Modif triviale dans `sofia.py`.
- *ARP* : voir P12.

### P12. ARP poisoning réel comme preuve technique *(impact ★★★, effort ★★)*
**Intention :** passer d'un ARP *descriptif* à un ARP *attaque* — point TCP/IP marquant.
**Proposition :** avant sa session telnet, l'intrus (`intrus.py`) émet des **ARP
gratuits** se faisant passer pour la passerelle `.1` (ou le serveur `.50`). La capture
montre alors un **conflit IP/MAC** (Wireshark : *« duplicate use of IP address
detected »*), signature classique de MITM. Cela *explique* comment l'intrus s'est
positionné, et ajoute une réquisition « caractérisez l'attaque de l'homme du milieu ».
Implémentation : quelques paquets `scapy` dans `intrus.py` (l'image acteurs a déjà les
droits réseau).

---

## 6. Axe « Élargissement du spectre TCP/IP »

### P13. Nouveaux protocoles, à doser *(impact ★★, effort ★★)*
**Intention :** couvrir des notions du cours encore absentes, sans surcharger.
**Propositions au choix (1 ou 2, pas tout) :**
- **DHCP** : un acteur obtient son bail au démarrage → « qui a reçu quelle IP, quand »
  (attribution dynamique d'adresses).
- **ICMP** : remplacer/compléter le scan TCP par un *ping sweep* de reconnaissance, ou
  un mini *tunnel ICMP* (variante du canal caché) pour contraster avec le tunnel DNS.
- **Soupçon de TLS** : un seul flux **chiffré** (HTTPS) volontairement *illisible*,
  pour faire dire aux étudiants « ici on ne peut rien lire » → justifie *a contrario*
  pourquoi tout le reste du scénario est en clair. Excellent point de discussion.

### P14. File carving approfondi *(impact ★★, effort ★★)*
**Intention :** dépasser « Exporter un objet » vers le *carving* manuel.
**Proposition :** la pièce jointe (P3) ou le CSV (P2) embarque un **second artefact**
— p. ex. une archive ZIP concaténée, ou une image avec stéganographie légère — dont la
clé/mot de passe se trouve ailleurs dans les captures (chaînage, cf. P5). Réservé en
défi bonus (P8) pour ne pas alourdir le socle.

---

## 7. Axe « Volet défensif » (boucler la boucle pédagogique)

### P15. Débrief « côté bleu » — détection et contre-mesures *(impact ★★★, effort ★)*
**Intention :** transformer l'analyse passive en **réflexion d'ingénieur sécurité**.
**Proposition :** une fiche de débrief associant à chaque preuve sa **détection** et sa
**contre-mesure** :

| Preuve | Comment un SOC la détecte | Contre-mesure |
|--------|---------------------------|---------------|
| P1 chat HTTP en clair | DPI / proxy, mots-clés | TLS, cloisonnement |
| P2 exfil FTP clair | DLP, volume sortant FTP | SFTP/FTPS + filtrage egress |
| P3 SMTP clair / pièce jointe | passerelle mail, SPF/DKIM | chiffrement, anti-usurpation |
| P4 scan + telnet | règle IDS *portscan*, telnet=interdit | désactiver telnet → SSH, MFA |
| P5 tunnel DNS | entropie/volume des TXT, fréquence | filtrage egress DNS, RPZ |

Distribuée **après** le rendu du PV, elle ancre le « et maintenant, comment empêcher
ça ? ».

### P16. Réquisition « recommandations » dans le PV *(impact ★, effort ★)*
**Intention :** faire produire des préconisations, pas seulement des constats.
**Proposition :** ajouter une section au `modele-proces-verbal.md` : « préconisations
de sécurisation à l'attention de la direction de NordExport ». Notée sur la pertinence,
pas sur l'exhaustivité.

---

## 8. Axe « Ergonomie pédagogique et fiabilité »

### P17. Barème transparent + checklist d'emblée *(impact ★, effort ★)*
Donner aux étudiants le barème (déjà dans `grille-correction.md`, version publique) et
une checklist de rendu. Motive et cadre l'effort.

### P18. Antisèche Wireshark annexée *(impact ★★, effort ★)*
Une fiche d'une page : filtres utiles (déjà listés dans `01_sujet`), gestes clés
(*Suivre le flux*, *Exporter objets*, colonnes utiles, `Statistics → Conversations`).
Complète P6.

### P19. Phase 2 sans fuite : image pré-construite ou portail *(impact ★★, effort ★★)*
Lever la fragilité notée au README : livrer **uniquement** une image Docker déjà
construite (sans sources) **ou** exposer la phase 2 derrière le portail P1, pour que les
plus curieux ne lisent pas les flags dans le code.

### P20. `make verify` — CI du TP *(impact ★★, effort ★)*
**Intention :** garantir qu'une régénération ne casse pas le TP.
**Proposition :** une cible Makefile qui, après `make capture`, rejoue les commandes
d'extraction du `walkthrough.md` et **vérifie que les 6 flags sont extractibles** des
scellés. Tout est déjà écrit dans le walkthrough — il suffit de l'automatiser en
assertions. Sécurise les mises à jour futures (dont celles de ce document).

---

## 9. Priorisation (impact × effort)

| Réf. | Proposition | Impact | Effort | Quand |
|------|-------------|:------:|:------:|-------|
| P1  | Auto-validation + scoreboard | ★★★ | ★★ | **Palier 1** |
| P6  | Réquisition 0 (prise en main) | ★★★ | ★ | **Palier 1** |
| P15 | Débrief côté bleu | ★★★ | ★ | **Palier 1** |
| P18 | Antisèche Wireshark | ★★ | ★ | **Palier 1** |
| P20 | `make verify` (CI du TP) | ★★ | ★ | **Palier 1** |
| P2  | Indices à coût | ★★ | ★ | Palier 1 |
| P7  | Paliers guidé/expert | ★★ | ★ | Palier 1 ✅ |
| P9  | Bruit de fond + faux flag | ★★★ | ★★ | **Palier 2** |
| P12 | ARP poisoning réel | ★★★ | ★★ | **Palier 2** |
| P5  | Fil rouge (déverrouillage souple) | ★★ | ★★ | Palier 2 |
| P10 | Corrélation inter-scellés | ★★ | ★★ | Palier 2 |
| P13 | Nouveaux protocoles (DHCP/ICMP/TLS) | ★★ | ★★ | Palier 2 |
| P3/P4 | Grades, badges, compte à rebours | ★ | ★ | Palier 2 |
| P11 | Usurpation (attribution) | ★★ | ★★★ | **Palier 3** |
| P14 | File carving approfondi | ★★ | ★★ | Palier 3 |
| P8  | Défis bonus | ★ | ★★ | Palier 3 |
| P16/P17/P19 | Recommandations PV, barème, phase 2 | ★/★★ | ★/★★ | au fil de l'eau |

---

## 10. Feuille de route proposée

- **Palier 1 — « Quick wins » (≈ 1 journée, zéro/peu d'infra).** P1 (portail+scoreboard),
  P6 (réquisition 0), P15 (débrief bleu), P18 (antisèche), P20 (CI), plus P2/P7/P17 qui
  sont surtout rédactionnels. Gros gain ludique + didactique sans toucher au scénario.
- **Palier 2 — « Profondeur forensique » (≈ 2–3 jours d'infra).** P9 (bruit + leurre),
  P12 (ARP MITM), P5 (fil rouge), P10 (corrélation), P13 (1 protocole de plus), P3/P4.
  C'est ici qu'on gagne en réalisme et en rejouabilité.
- **Palier 3 — « Expert / rejouabilité » (optionnel).** P11 (usurpation), P14 (carving),
  P8 (défis bonus). Pour étoffer les promos avancées ou faire varier d'une année sur
  l'autre.

## 11. Garde-fous à respecter
- **Ne pas sacrifier l'indépendance des preuves** : tout chaînage (P5) reste *souple*
  (indice, jamais gating), pour qu'un binôme bloqué progresse.
- **Doser le bruit (P9) et les protocoles (P13)** : l'ajout doit éclairer une notion du
  cours, pas noyer les débutants. Réserver le surplus aux niveaux « expert »/bonus.
- **Tester chaque évolution avec `make verify` (P20)** avant distribution.
- **Maintenir la séparation `infra/`+`correction/` (privés) vs `scelles/`+`enonce/`** ;
  vérifier qu'aucun nouveau flag ne fuit côté distribué (cf. P19).

---

*Prochaine étape suggérée : valider le périmètre du Palier 1, puis ouvrir un
`evolution2.md` consacré à sa mise en œuvre concrète (specs du portail P1 et contenu
de la réquisition 0).*
