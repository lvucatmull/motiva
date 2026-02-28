# 006 Core Interaction Loop

## Summary
갤러리 이동의 핵심 루프를 구현했다. 사용자 입력(WASD/Shift/Mouse)과 엔진 상태 업데이트를 연결하고, 포털 포커스/진입/복귀 흐름의 기반을 추가했다.

## Scope
- `packages/engine/src/index.ts`
- `apps/gallery-web/src/main.ts`

## Details
- Engine에 camera/velocity/portal 모델 추가
- `updateGallerySimulation`으로 고정 timestep 이동 처리
- 마우스 시점 회전(`applyMouseLook`) 및 pitch clamp
- 포커스 포털 탐색 로직(거리 + 정면도 기반)
- `E`로 포털 진입, `G`로 갤러리 복귀
- `advanceTime(ms)`를 결정론적 스텝으로 구현
- `render_game_to_text`를 실제 조작 가능한 상태 JSON으로 확장

## Why
- 이후 render-to-texture 및 scene mesh 조작을 붙이기 전에,
  “입력 -> 상태 -> 전환”의 코어 루프를 먼저 안정화하기 위함.
