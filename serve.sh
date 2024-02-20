#!/bin/sh
cd $MINDSROOT/front

if [ -n "$1" ]
then
	echo "Serving with ENGINE_HOST $1"
	NODE_OPTIONS=--max_old_space_size=6096 ENGINE_SECURE=1 ENGINE_HOST=$1 ENGINE_PORT=443 npm run serve:dev
	exit 0
else
	echo "Serving local"
	NODE_OPTIONS=--max_old_space_size=5096 ENGINE_PORT=8080 npm run serve:dev
	exit 0
fi

