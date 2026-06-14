# Guide d'utilisation de tcpdump

## 1. Lancer une capture

### Capture basique

```bash
sudo tcpdump
```

Capture sur l’interface par défaut

---

### Spécifier une interface

```bash
sudo tcpdump -i eth0
```

Pour lister les interfaces :

```bash
tcpdump -D
```

---

### Sauvegarder une capture

```bash
sudo tcpdump -i eth0 -w capture.pcap
```

Format compatible Wireshark

---

## 2. Filtrage des paquets

tcpdump utilise la syntaxe **BPF (Berkeley Packet Filter)**

---

### Filtres simples

```bash
tcp
udp
icmp
```

---

### Filtrer par IP

```bash
host 192.168.1.1
src host 192.168.1.10
dst host 8.8.8.8
```

---

### Filtrer par port

```bash
port 80
tcp port 443
udp port 53
```

---

### Combinaisons

```bash
tcp and port 80
host 192.168.1.1 and port 22
```

---

### Exclusion

```bash
not port 22
```

---

### Expressions complexes

```bash
(tcp port 80 or tcp port 443) and host 192.168.1.1
```

---

## 3. Exporter les données filtrées

### Sauvegarder uniquement les paquets filtrés

```bash
sudo tcpdump -i eth0 tcp port 80 -w http_only.pcap
```

---

### Export en texte lisible

```bash
sudo tcpdump -i eth0 -A
```

Affichage ASCII (utile pour HTTP)

---

### Export détaillé

```bash
sudo tcpdump -i eth0 -vvv
```

---

### Limiter la capture

```bash
sudo tcpdump -i eth0 -c 100 -w capture.pcap
```

Capture 100 paquets

---

### Rotation de fichiers

```bash
sudo tcpdump -i eth0 -w capture_%H%M.pcap -G 60
```

Nouveau fichier toutes les 60 secondes

---

## 4. Fonctions courantes

### Lire un fichier pcap

```bash
tcpdump -r capture.pcap
```

---

### Appliquer un filtre sur un fichier

```bash
tcpdump -r capture.pcap tcp port 80
```

---

### Affichage plus lisible

```bash
tcpdump -nn -i eth0
```

Désactive la résolution DNS (plus rapide)

---

### Suivi "équivalent" d’un flux

tcpdump ne reconstruit pas automatiquement les flux comme Wireshark, mais :

```bash
tcpdump -i eth0 -A host 192.168.1.1 and port 80
```

Permet de voir le contenu brut d’une session

---

### Taille des paquets

```bash
tcpdump -i eth0 -e
```

---

### Capture complète des paquets

```bash
tcpdump -i eth0 -s 0 -w full_capture.pcap
```

Capture sans troncature

---

## 5. Astuces pratiques

- Toujours utiliser `-nn` pour éviter les ralentissements
- Combiner avec `grep` :

```bash
tcpdump -i eth0 -A | grep "HTTP"
```

- Exécuter en root (`sudo`) pour accès complet
- Utiliser `-c` pour éviter les captures infinies

---

## 6. Exemples de cas d’usage

### Analyse HTTPS

```bash
tcpdump -i eth0 tcp port 443
```

---

### Analyse DNS

```bash
tcpdump -i eth0 udp port 53
```

---

### Détection SYN flood

```bash
tcpdump 'tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack == 0'
```

---

### Requêtes HTTP

```bash
tcpdump -i eth0 -A tcp port 80
```

---

### Trafic d’une machine

```bash
tcpdump host 192.168.1.10
```

---

## 7. Comparaison rapide avec Wireshark

| Fonction              | tcpdump | Wireshark |
|----------------------|----------|-------------|
| Interface graphique   | non       | oui          |
| Capture réseau        | oui       | oui          |
| Filtres puissants     | oui       | oui          |
| Analyse visuelle      | non       | oui          |
| Automatisation CLI    | oui       | non          |

---

## Conclusion

tcpdump est idéal pour :

- les serveurs (sans interface graphique)
- les scripts et automatisations
- les captures rapides et légères

Pour l’analyse approfondie, combine tcpdump + Wireshark
