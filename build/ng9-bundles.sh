#!/bin/sh

BROWSER_PATH=${1:-dist/browser}
EMBED_PATH=${1:-dist/embed}
SERVER_PATH=${3:-dist/server}

# Allow Node.js to use up to 4G
export NODE_OPTIONS="--max-old-space-size=4096"

# Build
npx gulp build.sass --deploy-url="/static/en/"
npm run build -- --stats-json --outputPath=$BROWSER_PATH
npm run build:embed -- --stats-json --outputPath=$EMBED_PATH
npm run build:ssr -- --outputPath=$SERVER_PATH
