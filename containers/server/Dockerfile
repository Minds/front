###
# Before running this container, ensure the server is built
###
FROM node:20-alpine

RUN apk update && apk upgrade --no-cache

ENV PM2_MAX_MEMORY=512M
ENV PM2_INSTANCES=2

COPY . /dist

RUN npm install pm2 -g

CMD pm2-runtime /dist/server/main.js \
    --max-memory-restart $PM2_MAX_MEMORY \
    --instances $PM2_INSTANCES

VOLUME ["/dist"]
