#!/bin/sh

# Exit script wit ERRORLEVEL if any command fails
set -e

# Keep current directory ref
CURRENT_DIR=$(pwd)

# Got back to current dir if changed
cd "$CURRENT_DIR/e2e/test"

# Delete node modules
rm -rf ./node_modules

# Install packages via npm
npm install

# Copy env
cp "$ENGINE_INTEGRATION_TESTS_CONFIG" .env

# Run tests
npm run test:e2e:sandbox
