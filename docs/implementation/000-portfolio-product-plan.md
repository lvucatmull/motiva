# 000 Portfolio Product Plan

## 1. Portfolio Narrative (what this project proves)

이 프로젝트는 단순한 3D 데모가 아니라, 아래 역량을 하나의 인터랙션으로 증명하는 포트폴리오 작품이다.

- 실시간 렌더링 시스템 설계 (WebGPU)
- 고성능 연산 모듈 분리 (C++ -> WASM)
- 사용자 경험 설계 (거리뷰형 이동, 프레임 포털, 씬 전환)
- 확장 가능한 코드베이스 운영 (Nx monorepo)

결과적으로 사용자는 “가상 갤러리 탐험”을 경험하고, 리뷰어는 “그래픽스 + 엔진 + 제품적 사고”를 동시에 확인할 수 있어야 한다.

## 2. Experience Goals

- 갤러리를 걸어 다니는 느낌(Street View-like): WASD + mouse look
- 액자 속 미리보기(렌더 투 텍스처): 각 프레임이 독립 씬의 라이브 썸네일
- 액자를 포털처럼 진입: 액자 선택 -> 씬 전환 -> 조작 -> 갤러리 복귀
- 씬 안에서 객체 조작: 마우스 드래그 기반 mesh transform + UI 컨트롤

## 3. Non-goals for first milestone

- 포토리얼 PBR 품질
- 네트워크 멀티플레이
- 복잡한 에디터 기능

핵심은 “완성도 높은 인터랙션 루프”다.

## 4. Audience & Portfolio Positioning

### Recruiter / Hiring manager 관점
- 짧은 시간에 임팩트 확인: 입장 10초 내 카메라 이동/포털 진입 확인 가능

### Graphics/Engine engineer 관점
- 렌더 파이프라인/RTT/WASM 경계를 코드로 설명 가능

### Product engineer 관점
- 사용자 동선과 UI 상태 전환이 일관되고 오류 없이 작동

## 5. Deliverable Quality Bar

- 입력 반응성과 상태 전환이 끊김 없이 안정적
- `render_game_to_text`와 화면 상태가 일치
- 핵심 기능마다 재현 가능한 실행/검증 명령 제공
- 기능 단위 커밋 + 변경 설명 문서 유지
