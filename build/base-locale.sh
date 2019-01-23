#!/bin/sh
ng build --prod --vendor-chunk --output-path="$1/en/" --deploy-url="$2/en/" --build-optimizer=false --source-map=false
