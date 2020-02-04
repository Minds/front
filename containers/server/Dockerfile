###
# Before running this container, ensure the server is built
###
FROM node:13-alpine

COPY . /dist

CMD node /dist/server

VOLUME ["/dist"]