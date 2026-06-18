# Operation Datalink - orchestration du TP
#
#   make capture   genere les scelles PCAP (build + scenario + capture)
#   make up        relance l'infra live pour la phase 2 (sans recapturer)
#   make down      arrete et supprime l'infra
#   make ps        etat des conteneurs
#   make clean     down + suppression des pcap generes
#   make reset-scores  efface TOUT (points + equipes + PV) et relance le portail

COMPOSE = docker compose -f infra/docker-compose.yml

.PHONY: capture up down ps logs clean portal reset-scores

capture:
	./run-capture.sh

portal:
	$(COMPOSE) up -d --build portal
	@echo "[i] portail    = http://localhost:8080"
	@echo "[i] dashboard  = http://localhost:8080/dashboard?token=prof2024"

reset-scores:
	@printf "[!] Efface TOUT le volume portal-data : points + equipes + PV. Irreversible.\n"
	@printf "    Taper 'oui' pour confirmer : " && read ans && [ "$$ans" = "oui" ] || { echo "[i] Annule, rien n'a ete efface."; exit 1; }
	$(COMPOSE) down -v
	$(COMPOSE) up -d portal
	@echo "[i] Donnees remises a zero (points + equipes + PV)."
	@echo "[i] portail    = http://localhost:8080"
	@echo "[i] dashboard  = http://localhost:8080/dashboard?token=prof2024"
	@echo "[i] Relancer l'infra live (srv/darkdrop) si besoin : make up"

up:
	$(COMPOSE) up -d --wait srv darkdrop portal
	@echo "[i] srv        = 10.13.37.50"
	@echo "[i] darkdrop   = 10.13.37.200"
	@echo "[i] portail    = http://localhost:8080"
	@echo "[i] dashboard  = http://localhost:8080/dashboard?token=prof2024"

down:
	$(COMPOSE) down --remove-orphans
	@echo "[i] Le volume portal-data est conserve (soumissions persistees)."
	@echo "[i] Pour tout supprimer : docker compose -f infra/docker-compose.yml down -v"

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f srv darkdrop

logs-portal:
	$(COMPOSE) logs -f portal

clean: down
	rm -f infra/capture/*.pcap
