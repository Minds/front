###
# Before running this container, ensure the server is built
###
FROM node:13-alpine

COPY . /dist

CMD node "--max-old-space-size=2048" /dist/server

VOLUME ["/dist"]