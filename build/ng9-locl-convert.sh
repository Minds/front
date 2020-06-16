#!/bin/sh

# 1st parameter is browser bundle folder
BROWSER_PATH=${1:-dist/browser}

# 2nd parameter is locale folder
LOCALE_PATH=${2:-src/locale}

# Translation file codes
CODES=`echo $LOCALE_PATH/Minds.*.xlf | sed 's/[a-z\/]*\/Minds.\([a-z][a-z]\).xlf/\1/g'`

mkdir -p $BROWSER_PATH/assets/locale

for CODE in $CODES
do
  npx locl convert -s="$LOCALE_PATH/Minds.$CODE.xlf" -f=json -o="$BROWSER_PATH/assets/locale/Minds.$CODE.json"
done
