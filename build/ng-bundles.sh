#!/bin/sh

BROWSER_PATH=${1:-dist/browser}
EMBED_PATH=${1:-dist/embed}
SERVER_PATH=${3:-dist/server}
STORYBOOK_PATH=${3:-dist/storybook}

# Allow Node.js to use up to 6G
export NODE_OPTIONS="--max_old_space_size=6442"

# Build global CSS
npx gulp build.sass --deploy-url="/static/en/"

# generate appData for ngsw
npx gulp generate-ngsw-appData

# Build front
npm run build minds -- --stats-json --output-path=$BROWSER_PATH --i18n-missing-translation=ignore
if [ "$?" != "0" ]; then exit 1; fi

# Build embed
npm run build:embed -- --stats-json --output-path=$EMBED_PATH
if [ "$?" != "0" ]; then exit 1; fi

# Build SSR
npm run build:ssr -- --output-path=$SERVER_PATH
if [ "$?" != "0" ]; then exit 1; fi

# Build Storybook
npm run build-storybook
if [ "$?" != "0" ]; then exit 1; fi
mv "storybook-static/" $STORYBOOK_PATH
