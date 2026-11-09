#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STANDALONE_DIR="$ROOT_DIR/.next/standalone"

mkdir -p "$STANDALONE_DIR/.next"
rm -rf "$STANDALONE_DIR/public" "$STANDALONE_DIR/.next/static"
cp -R "$ROOT_DIR/public" "$STANDALONE_DIR/public"
cp -R "$ROOT_DIR/.next/static" "$STANDALONE_DIR/.next/static"

echo "Prepared standalone assets in $STANDALONE_DIR"
