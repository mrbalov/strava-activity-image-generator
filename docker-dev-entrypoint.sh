#!/bin/sh
set -e

# Inject GitHub Packages auth token into .npmrc if GITHUB_TOKEN is set
if [ -n "$GITHUB_TOKEN" ]; then
  echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc
fi

# Execute the passed command
exec "$@"
