#!/bin/sh

BROWSER_PATH=${1:-dist/browser}
SERVER_PATH=${3:-dist/server}

# Allow Node.js to use up to 3.5G
export NODE_OPTIONS="--max-old-space-size=3584"

# Build
npx gulp build.sass --deploy-url="/static/"
npm run build -- --stats-json --outputPath=$BROWSER_PATH
npm run build:ssr -- --outputPath=$SERVER_PATH
