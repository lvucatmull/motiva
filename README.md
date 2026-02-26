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

## Next implementation steps

1. Gallery first-person navigation (street-view style movement)
2. Frame render-to-texture previews for each 3D scene
3. Frame focus + portal transition into selected scene
4. Mouse mesh manipulation in scene mode
5. Full WASM path for mesh transform and interaction math
