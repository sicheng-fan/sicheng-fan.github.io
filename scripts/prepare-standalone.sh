#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STANDALONE_DIR="$ROOT_DIR/.next/standalone"

mkdir -p "$STANDALONE_DIR/.next"
rm -rf "$STANDALONE_DIR/public" "$STANDALONE_DIR/.next/static"
cp -R "$ROOT_DIR/public" "$STANDALONE_DIR/public"
cp -R "$ROOT_DIR/.next/static" "$STANDALONE_DIR/.next/static"
mkdir -p "$STANDALONE_DIR/resources/geoip"
cp "$ROOT_DIR/resources/geoip/country.bin.gz" "$ROOT_DIR/resources/geoip/NOTICE.md" "$STANDALONE_DIR/resources/geoip/"

echo "Prepared standalone assets in $STANDALONE_DIR"
