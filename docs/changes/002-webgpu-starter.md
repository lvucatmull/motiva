# 002 Web App Starter

## Summary
`gallery-web` 앱과 `engine` 라이브러리를 추가하고, WebGPU 캔버스 부팅 및 상태 노출 스텁을 구성했다.

## Scope
- App 구성: `apps/gallery-web/*`
- Engine 도메인 상태: `packages/engine/*`
- 테스트 루프 연동 준비: `window.render_game_to_text`, `window.advanceTime`

## Why
- 포트폴리오 목표 기능(갤러리 이동/포털/메쉬 조작)을 구현하기 위한 웹 런타임 골격이 필요함.
- `engine` 분리를 통해 앱 렌더링과 도메인 상태를 분리해 확장성을 확보.
