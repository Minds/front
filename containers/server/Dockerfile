###
# Before running this container, ensure the server is built
###
FROM node:13-alpine

COPY . /dist

RUN npm install pm2 -g

CMD pm2-runtime /dist/server \
    --max-memory-restart 512M \
    --instances 2

VOLUME ["/dist"]