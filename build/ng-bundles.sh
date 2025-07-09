#!/bin/sh

MINDS_PATH=${1:-dist/minds}
EMBED_PATH=${1:-dist/embed}
STORYBOOK_PATH=${3:-dist/storybook}

# Allow Node.js to use up to 6G
export NODE_OPTIONS="--max_old_space_size=8192"

# Build global CSS
npx gulp build.sass --deploy-url="/static/en/"

# Build front
npm run build -- --stats-json --output-path=$MINDS_PATH --i18n-missing-translation=ignore
if [ "$?" != "0" ]; then exit 1; fi

# Fix SSR Polyfills
node ../scripts/fix-ssr-polyfills.js

# Build embed
npm run build:embed -- --stats-json --output-path=$EMBED_PATH
if [ "$?" != "0" ]; then exit 1; fi

# Build Storybook
npm run build-storybook
if [ "$?" != "0" ]; then exit 1; fi
mv "storybook-static/" $STORYBOOK_PATH
