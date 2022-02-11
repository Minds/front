#!/bin/sh
export NODE_OPTIONS="--max_old_space_size=3584"

do_locale_build () {
    ng build --prod --vendor-chunk --output-path="$2/$1/" --deploy-url="$3/$1/" --build-optimizer=false --source-map=false \
        --i18nFile="./src/locale/Minds.$1.xliff" --i18nFormat=xlf --i18nLocale="$1"
}

do_locale_build vi $1 $2
