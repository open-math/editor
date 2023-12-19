#!/bin/bash

sudo rm -r -f ./editor-new/
git clone https://github.com/open-math/editor-new
cd editor-new
npm i
npm uninstall translator
npm i -D open-math/translator
npx nuxt build