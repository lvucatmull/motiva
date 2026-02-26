#!/usr/bin/env bash
set -euo pipefail

if ! command -v emcc >/dev/null 2>&1; then
  echo "[wasm-core] emcc not found. Install Emscripten first."
  echo "Output path reserved: apps/gallery-web/public/wasm"
  exit 1
fi

OUT_DIR="apps/gallery-web/public/wasm"
mkdir -p "$OUT_DIR"

emcc \
  packages/wasm-core/src/gallery.cpp \
  -O3 \
  -s WASM=1 \
  -s MODULARIZE=1 \
  -s EXPORT_ES6=1 \
  -s ENVIRONMENT='web' \
  -s EXPORTED_FUNCTIONS='["_damp_rotation","_clampf"]' \
  -s EXPORTED_RUNTIME_METHODS='["cwrap"]' \
  -o "$OUT_DIR/gallery_wasm.js"

echo "[wasm-core] built -> $OUT_DIR/gallery_wasm.js (.wasm generated alongside)"
