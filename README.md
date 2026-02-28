# 3D Gallery Monorepo (Nx)

## Workspace layout

- `apps/gallery-web`: WebGPU canvas app (portfolio front-end)
- `packages/engine`: shared scene/domain state
- `packages/wasm-core`: C++ source + WASM build script

## Commands

```bash
pnpm dev          # nx run gallery-web:serve
pnpm build        # wasm-core + gallery-web build
pnpm build:wasm   # emcc needed
pnpm typecheck
```

## Dev server host/port

Default:

- host: `127.0.0.1`
- port: `4200`

Override with env vars:

```bash
VITE_HOST=0.0.0.0 VITE_PORT=4200 pnpm dev
```

## WASM setup (Emscripten)

`packages/wasm-core/scripts/build-wasm.sh` requires `emcc`.

Example setup:

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

Verify and build:

```bash
emcc -v
cd /Users/seongjoo/Desktop/portfolio/3d-gallery
pnpm build:wasm
```

## Next implementation steps

1. Gallery first-person navigation (street-view style movement)
2. Frame render-to-texture previews for each 3D scene
3. Frame focus + portal transition into selected scene
4. Mouse mesh manipulation in scene mode
5. Full WASM path for mesh transform and interaction math
