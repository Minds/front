FROM node:13-alpine

RUN apk add --no-cache \
    git \
    libsass

RUN npm install -g typescript @angular/cli

# Gitlab CI has limited memory
ENV NODE_OPTIONS="--max-old-space-size=1024"