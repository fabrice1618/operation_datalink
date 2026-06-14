# Guide d'utilisation de Wireshark

## 1. Lancer une capture

1. Ouvrir Wireshark
2. Sélectionner une interface réseau (Wi-Fi, Ethernet, etc.)
3. Cliquer sur **Start Capturing Packets** (icône requin )
4. Laisser tourner la capture ou générer du trafic
5. Cliquer sur **Stop** pour arrêter

---

## 2. Filtrage des paquets

### Filtre de capture (avant capture)

Dans la barre de capture (BPF syntaxe) :

```bash
port 80
host 192.168.1.1
tcp
udp
```

Exemple :
```bash
tcp port 443
```

---

### Filtre d'affichage (après capture)

Dans la barre de filtre (Display Filter) :

```bash
ip.addr == 192.168.1.1
tcp.port == 80
http
dns
```

Exemples utiles :

```bash
ip.src == 192.168.1.10
ip.dst == 8.8.8.8
tcp.flags.syn == 1
http.request
dns.flags.response == 1
```

Astuce : les filtres deviennent verts s’ils sont valides

---

## 3. Exporter les données filtrées

### Exporter les paquets filtrés

1. Appliquer un filtre
2. Aller dans **File > Export Specified Packets**
3. Choisir :
   - *Displayed* (paquets filtrés)
   - Format : `.pcapng` ou `.pcap`
4. Sauvegarder

---

### Exporter en texte / CSV

1. Aller dans **File > Export Packet Dissections > As CSV**
2. Choisir les champs à exporter
3. Sauvegarder

---

### Exporter des objets (HTTP, etc.)

1. Aller dans **File > Export Objects**
2. Choisir le protocole (HTTP, SMB, etc.)
3. Sélectionner un fichier
4. Cliquer sur **Save**

---

## 4. Fonctions courantes

### Suivre un flux (Follow Stream)

Permet de reconstruire une communication :

- Clic droit sur un paquet
- **Follow > TCP Stream** / UDP / HTTP

---

### Statistiques réseau

Menu **Statistics** :

- **Protocol Hierarchy** → vue globale des protocoles
- **Conversations** → échanges entre machines
- **Endpoints** → liste des IP
- **IO Graphs** → trafic dans le temps

---

### Colorisation

- Menu **View > Coloring Rules**
- Permet d’identifier rapidement certains types de trafic

---

### Inspection des paquets

Interface en 3 parties :

1. Liste des paquets
2. Détails (protocoles)
3. Données brutes (hex)

---

## 5. Astuces pratiques

- Utiliser `Ctrl + F` pour rechercher dans les paquets
- Clic droit → **Apply as Filter** pour créer un filtre rapidement
- Utiliser `tcp contains "text"` pour chercher du contenu
- Sauvegarder régulièrement les captures

---

## 6. Exemples de cas d’usage

### Analyse HTTPS

```bash
tcp.port == 443
```

---

### Analyse DNS

```bash
dns
```

---

### Détection SYN flood

```bash
tcp.flags.syn == 1 and tcp.flags.ack == 0
```

---

### Téléchargements HTTP

```bash
http.response.code == 200
```

---

## Conclusion

Wireshark est un outil puissant pour :

- analyser le trafic réseau
- diagnostiquer des problèmes
- investiguer des incidents de sécurité

La maîtrise des filtres est la clé
