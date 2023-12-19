#!/bin/bash

# Loading .env variables
set -o allexport
sed -i 's/\r$//' .env
source .env
set +o allexport

# Freeing 3000 port
kill -9 $(lsof -i:3000 -t) 2> /dev/null

# Starting Nuxt production server
nohup node editor-new/.output/server/index.mjs &