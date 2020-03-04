#!/usr/bin/env sh
set -e

cd /var/www/Minds/front

echo Building...
npx ng run minds:server:production

echo Compiling...
npm run compile:server
