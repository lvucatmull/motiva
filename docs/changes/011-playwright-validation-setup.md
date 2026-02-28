# 011 Playwright Validation Setup

## Summary
웹게임 자동 검증 루프를 위해 워크스페이스에 `playwright` 개발 의존성을 추가했다.

## Scope
- `package.json`

## Why
- `develop-web-game` 스킬의 Playwright 클라이언트를 실행하려면 `playwright` 패키지가 필요하다.

## Note
- 현재 스킬 스크립트 위치(`/Users/seongjoo/.codex/skills/...`) 기준 모듈 해석 경계 때문에,
  워크스페이스에 설치된 `playwright`를 즉시 참조하지 못하는 환경 이슈가 남아 있다.
