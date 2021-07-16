#!/bin/sh

LOCALE_PATH=${1:-src/locale}

for xliff in $LOCALE_PATH/*; do
    [ -e "$xliff" ] || continue;

    FILENAME="${xliff##*/}";
    L10N_PATH="../l10n/front/locale/$FILENAME"

    ## Do not copy base.xliff
    if [ $FILENAME == "Base.xliff" ]; then
        continue;
    fi;

    echo "$FILENAME";

    npm run xi18n-import -- --input=$L10N_PATH

done