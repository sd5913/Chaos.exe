#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
mkdir -p dist
cp index.html style.css app.js story.js localization.js audio.js onboarding.js account.js dist/
cp -R assets dist/
