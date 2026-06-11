FROM alpine:3.20
RUN apk add --no-cache tcpdump
# Les arguments (interface, fichier de sortie...) sont fournis par docker-compose
ENTRYPOINT ["tcpdump"]
