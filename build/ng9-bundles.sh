#!/bin/sh
export NODE_OPTIONS="--max-old-space-size=3584"
npm run build:client-and-server-bundles
