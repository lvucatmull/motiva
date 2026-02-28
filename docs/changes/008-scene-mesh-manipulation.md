# 008 Scene Mesh Manipulation

## Summary
scene 모드에서 마우스 드래그 회전, 휠 줌, 리셋 키(`R`)를 추가하고, 조작 상태 보간에 WASM damp/clamp 함수를 연결했다.

## Scope
- `packages/engine/src/index.ts`
- `apps/gallery-web/src/main.ts`

## Details
- Engine에 mesh target/current 상태 분리 (`meshTargetRotation`, `meshTargetZoom`)
- scene drag 시작/종료 및 드래그 반영 함수 추가
- 줌 입력과 리셋 함수 추가
- `updateSceneManipulation`에서 보간 및 clamp 처리
- app에서 scene 입력 이벤트(`mousedown/mousemove/mouseup/wheel/R`) 연결
- `render_game_to_text`에 mesh current/target/zoom 상태 추가

## Why
- 포트폴리오에서 사용자에게 "직접 조작 가능한 3D 씬" 경험을 제공하기 위함.
- Step 4의 render-to-texture에서도 동일 mesh 상태를 프리뷰에 재사용할 수 있음.
