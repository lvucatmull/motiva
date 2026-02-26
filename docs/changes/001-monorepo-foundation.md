# 001 Monorepo Foundation

## Summary
Nx 기반 모노레포 기본 구조를 추가해 앱/라이브러리 단위로 분리 가능한 개발 기반을 만들었다.

## Scope
- Workspace 설정: `nx.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`
- Root 실행 스크립트/의존성: `package.json`, `pnpm-lock.yaml`
- 기본 안내 문서: `README.md`

## Why
- WebGPU 앱, 엔진 로직, C++/WASM 빌드 파트를 독립 타겟으로 관리하기 위함.
- 이후 기능 개발 시 `nx run <project>:<target>` 단위로 반복 개발/검증 가능.
