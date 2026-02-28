# 020 Implementation Steps

## 문서별 실행 순서

1. `000-portfolio-product-plan.md`
- 목표 UX와 포트폴리오 메시지 확정
- 범위/비범위 확정

2. `010-technical-stack-architecture.md`
- 레이어별 책임 분리 확정
- 렌더/시뮬레이션 구조 확정

3. 이 문서(`020-implementation-steps.md`)
- 실제 개발 step과 커밋 단위 확정

## Step plan (with commit units)

### Step 1: Core interaction loop (gallery movement baseline)
- Engine state 확장 (camera, movement, portal focus, mode)
- WASD + mouse look + pointer lock
- deterministic `advanceTime(ms)` 구현
- `render_game_to_text`를 실제 상태 기반으로 확장
- Commit: `feat: implement gallery core interaction loop`
- Change doc: `docs/changes/006-core-interaction-loop.md`

### Step 2: Frame portals + selection flow
- 프레임 앵커 데이터 모델
- 시야 중심/거리 기반 focus 계산
- `E` 입력으로 포털 진입, `G`로 갤러리 복귀
- Commit: `feat: add frame portal focus and scene transition`
- Change doc: `docs/changes/007-frame-portal-transition.md`

### Step 3: Scene mesh manipulation
- 씬 모드에서 드래그 회전/줌/리셋
- WASM 보간/클램프 함수 적용
- Commit: `feat: add scene mesh manipulation controls`
- Change doc: `docs/changes/008-scene-mesh-manipulation.md`

### Step 4: Render-to-texture pipeline
- 프레임별 offscreen target
- 액자에 live texture 반영
- Commit: `feat: implement render-to-texture frame previews`
- Change doc: `docs/changes/009-render-to-texture-previews.md`

### Step 5: UX polish for portfolio demo
- 시작 안내 UI/성능 정보/핵심 단축키
- 60~90초 데모 동선 최적화
- Commit: `feat: polish portfolio demo flow and ui`
- Change doc: `docs/changes/010-demo-polish.md`

## Validation checklist per step

- `pnpm typecheck`
- `pnpm build:web`
- Playwright action burst + screenshot + `render_game_to_text` 확인
- console error 신규 발생 여부 확인
