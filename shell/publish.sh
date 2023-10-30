#!/bin/bash -e

echo "ensure you have updated package version"
set -e
echo "Running tests..."
yarn test

echo "Building package..."
yarn build

echo "Publishing Package, keep Authenticator app read for 2FA."
yarn publish:npm
