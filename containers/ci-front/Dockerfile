FROM node:14-alpine

RUN apk add --no-cache \
    git \
    libsass

RUN npm install -g typescript @angular/cli

# Gitlab CI has limited memory
ENV NODE_OPTIONS="--max_old_space_size=1024"