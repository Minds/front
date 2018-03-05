FROM alpine:edge

RUN apk add --no-cache \
    chromium \
    git \
    build-base \
    libstdc++ \
    make \
    g++ \
    python \
    curl \
    udev \
    nodejs=8.9.1-r0 \
    libsass

RUN npm install -g typescript gulp @angular/cli

ENV CHROME_BIN=/usr/bin/chromium-browser