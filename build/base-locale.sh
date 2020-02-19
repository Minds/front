#!/bin/sh
export NODE_OPTIONS="--max-old-space-size=3584"
ng build --prod --output-path="$1/en/" --deploy-url="$2/en/" --build-optimizer=true --stats-json 
