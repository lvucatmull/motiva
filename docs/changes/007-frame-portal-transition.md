# 007 Frame Portal Transition

## Summary
포털 선택/진입/복귀 흐름을 전환 상태 기반으로 분리하고, 포커스 강도와 전환 진행률을 시각적으로 반영했다.

## Scope
- `packages/engine/src/index.ts`
- `apps/gallery-web/src/main.ts`

## Details
- Engine에 `PortalTransition` 상태(`idle/entering/exiting`, `progress`) 추가
- `E` 입력 시 즉시 모드 전환 대신 `entering` 전환 진행 후 scene 모드 진입
- `G` 입력 시 `exiting` 전환 진행 후 gallery 모드 복귀
- 포털 포커스 결과를 `id + strength`로 계산해 상태에 저장
- 앱 렌더 clear color에 포커스 강도/전환 진행률 반영
- `render_game_to_text`에 포커스 이름, 강도, 전환 상태 추가

## Why
- 포트폴리오 관점에서 "포털을 통한 공간 전환"을 즉시 스냅이 아닌 명확한 상태 전이로 보여주기 위함.
- 이후 Step 3/4(mesh 조작, RTT)에서도 동일한 전환 상태를 공통적으로 재사용 가능.
