#!/bin/sh
set -e

# Check if node_modules directory exists; if not, install dependencies.
if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Running yarn install..."
  npm install
fi

npm run build
# Run the start script
exec npm run start
