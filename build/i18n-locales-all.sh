#!/bin/sh

do_locale_build () {
    ng build --prod --vc --output-path="$2/$1/" --deploy-url="$3/$1/" --build-optimizer=false \
        --i18nFile="./src/locale/Minds.$1.xliff" --i18nFormat=xlf --locale="$1"
}

do_locale_build vi $1 $2
