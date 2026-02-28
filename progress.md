Original prompt: 포트폴리오 용 사이트를 만들어야. 기술 스택은 webgpu canvas 및 mouse interaction 통한 mesh 조작이야. c++ 빌드 및 wasm으로 import해서 사용할거고, mouse interaction 통한 mesh 조작과 UI 조작을 목표로 할거야. 주제는 3d 갤러리 공간과 같이 화면 곳곳을 google map의 거리뷰와 같은 형식으로 이동하면서, 각 액자에 3d scene을 render to texture로 보여주고, 해당 액자를 통해 실제 해당 scene으로 이동할 수 있도록 만들거야.

- Direction updated by user: start with developer-friendly folder layout and Nx monorepo integration first.
- Converted repository into Nx-managed monorepo layout:
  - apps/gallery-web
  - packages/engine
  - packages/wasm-core
- Added root workspace configs: nx.json, pnpm-workspace.yaml, tsconfig.base.json.
- Added Nx project definitions with targets for serve/build/typecheck.
- Added WebGPU starter app that boots canvas and validates WASM fallback path.
- Added wasm-core C++ source and emcc build script outputting into apps/gallery-web/public/wasm.

TODO (next agent or next step):
- Implement actual gallery movement controls (WASD + mouse look) in packages/engine + gallery-web.
- Implement frame portals and render-to-texture previews in WebGPU pipeline.
- Integrate scene transition and mouse-based mesh manipulation.
- Implement deterministic simulation loop behind window.advanceTime(ms).
- Add Playwright loop run using develop-web-game skill script after interactive features are added.

Validation:
- `pnpm nx show projects` -> gallery-web, engine, wasm-core confirmed.
- `pnpm typecheck` -> passed.
- `pnpm build:web` -> passed.
- `pnpm build:wasm` not executed yet (depends on local Emscripten/emcc setup).

- Added implementation planning docs under docs/implementation:
  - 000-portfolio-product-plan.md
  - 010-technical-stack-architecture.md
  - 020-implementation-steps.md
- Implemented Step 1 core interaction loop:
  - engine camera/input/simulation model
  - WASD + Shift movement
  - pointer-lock mouse look
  - focused portal detection + enter/return mode flow
  - deterministic window.advanceTime(ms)
  - expanded render_game_to_text payload
- Validation run for Step 1:
  - `pnpm typecheck`: passed
  - `pnpm build:web`: passed
  - Tried skill Playwright client execution, but module resolution failed because the client script is outside workspace and cannot resolve local `playwright` package.
- Added `playwright` as workspace devDependency for future local validation flows.
