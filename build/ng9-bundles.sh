#!/bin/sh

# 1st parameter is browser bundle folder
BROWSER_PATH=${1:-dist/browser}

# 2nd parameter is browser bundle deploy URL
BROWSER_DEPLOY_URL=${2:-/browser}

# 3rd parameter is server bundle folder
SERVER_PATH=${3:-dist/server}

# Allow Node.js to use up to 3.5G
export NODE_OPTIONS="--max-old-space-size=3584"

# Build
npx gulp build.sass --deploy-url=$BROWSER_DEPLOY_URL
npm run build -- --stats-json --outputPath=$BROWSER_PATH --deployUrl=$BROWSER_DEPLOY_URL
npm run build:ssr -- --outputPath=$SERVER_PATH
