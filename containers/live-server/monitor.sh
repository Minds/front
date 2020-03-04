#!/usr/bin/env sh
set -e

cd /var/www/Minds/front
npx nodemon --delay 3 --watch dist/server.js --watch dist/server --ext js,mjs  --exec "/usr/bin/env sh" /serve.sh
