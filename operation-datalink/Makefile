# Operation Datalink - orchestration du TP
#
#   make capture   genere les scelles PCAP (build + scenario + capture)
#   make up        relance l'infra live pour la phase 2 (sans recapturer)
#   make down      arrete et supprime l'infra
#   make ps        etat des conteneurs
#   make clean     down + suppression des pcap generes

COMPOSE = docker compose -f infra/docker-compose.yml

.PHONY: capture up down ps logs clean

capture:
	./run-capture.sh

up:
	$(COMPOSE) up -d --wait srv darkdrop
	@echo "[i] srv = 10.13.37.50  |  darkdrop = 10.13.37.200"

down:
	$(COMPOSE) down -v --remove-orphans

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f srv darkdrop

clean: down
	rm -f infra/capture/*.pcap
