# 010 Technical Stack Architecture

## 1. Stack Selection

- Rendering: WebGPU (canvas)
- Runtime app: TypeScript + Vite
- Native compute: C++ compiled to WASM (Emscripten)
- Workspace: Nx monorepo (apps + packages)

## 2. Why this stack (portfolio-fit)

### WebGPU
- modern graphics API 지식 증명
- 멀티패스 렌더링과 render-to-texture 설계 능력 어필

### C++ + WASM
- 연산 집약 로직을 네이티브 레이어로 분리하는 아키텍처 역량 증명
- 향후 물리/충돌/수치 안정성 계산 확장 기반

### Nx monorepo
- 앱/엔진/네이티브 모듈 경계를 명확히 분리
- 기능 단위 테스트/빌드 타겟 운영 용이

## 3. Responsibility split

- `apps/gallery-web`
  - Web entry, input bridge, GPU context, scene routing
- `packages/engine`
  - 상태 모델, 업데이트 루프, 입력 -> 상태 전환 규칙
- `packages/wasm-core`
  - 수학/보간/클램프/후속 충돌 계산 등 고성능 함수

## 4. Rendering architecture (target)

1. Gallery pass
- 갤러리 공간 지오메트리 렌더

2. Frame preview pass (RTT)
- 각 포털 씬을 offscreen texture로 렌더
- 액자 메시에 텍스처 적용

3. Scene pass
- 포털 진입 시 해당 씬 렌더
- mesh 조작 gizmo/UI overlay

## 5. Simulation architecture

- 고정 timestep 기반 update (`advanceTime(ms)` 지원)
- render는 update 결과를 시각화
- 자동화 테스트에서 결정론적 재현 가능
