# 003 WASM Core Bridge

## Summary
C++ 소스와 Emscripten 빌드 스크립트를 `wasm-core` 패키지로 분리해 웹 앱에서 WASM을 로드할 수 있는 경로를 만들었다.

## Scope
- WASM 패키지 정의: `packages/wasm-core/project.json`
- C++ 소스: `packages/wasm-core/src/gallery.cpp`
- 빌드 스크립트: `packages/wasm-core/scripts/build-wasm.sh`

## Why
- 마우스 인터랙션/메쉬 조작 계산 로직을 C++로 작성하고 웹에서 재사용하기 위한 기반.
- 산출물 경로를 `apps/gallery-web/public/wasm`으로 고정해 앱 import 흐름 단순화.
