#!/bin/sh

BROWSER_PATH=${1:-dist/browser}

# rm -rf $BROWSER_PATH/*/assets

for dirname in $BROWSER_PATH/*; do
    [ -e "$dirname" ] || continue;

    ## Do not delete from en
    if [ $dirname == $BROWSER_PATH/en ]; then
        continue;
    fi;

    echo "Deleting $dirname/assets";
    rm -rf $dirname/assets;

    echo "Deleting $dirname/stats.json";
    rm -rf $dirname/stats.json
done