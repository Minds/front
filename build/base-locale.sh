#!/bin/sh
ng build --prod --vc --output-path="$1/en/" --deploy-url="$2/en/" --build-optimizer=false
