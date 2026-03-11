# Idea-Product Platform Planning Document

> **Summary**: 아이디어 제안과 제품 개발 지원을 연결하는 플랫폼
>
> **Project**: 1st-blood
> **Author**: peteryoo-sys
> **Date**: 2026-03-11
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 아이디어를 가진 사람과 개발 역량을 가진 사람이 서로를 찾기 어렵고, 아이디어가 제품으로 발전하는 체계적 경로가 없음 |
| **Solution** | 아이디어 등록/탐색과 제품 개발 지원 신청을 하나의 플랫폼에서 제공하며, 회원/비회원 접근 레벨을 구분 |
| **Function/UX Effect** | 비로그인 사용자도 제품/아이디어 탐색 가능, 로그인 시 아이디어 등록·댓글·추천·지원 신청 기능 활성화 |
| **Core Value** | 아이디어에서 제품까지의 전환율을 높이고, 개발자-기획자 매칭을 통해 실현 가능성을 극대화 |

---

## 1. Overview

### 1.1 Purpose

아이디어를 등록하고, 진행 중인 제품에 개발 지원을 신청할 수 있는 커뮤니티 플랫폼을 구축한다. 사용자는 아이디어를 탐색·추천·댓글하고, 제품 개발에 직접 참여할 수 있다.

### 1.2 Background

- 아이디어만 있고 개발 인력이 부족한 기획자
- 프로젝트를 찾고 있는 개발자
- 두 그룹을 연결하여 실제 제품으로 발전시키는 플랫폼 필요

### 1.3 Related Documents

- Flowchart: 사용자 제공 Mermaid 플로우차트 (본 문서 기반)

---

## 2. Scope

### 2.1 In Scope

- [ ] 회원가입 / 로그인 (이메일 기반)
- [ ] 메인 홈 (비로그인/로그인 상태 분리)
- [ ] 제품 리스트 / 제품 상세 페이지
- [ ] 제품 개발 지원 신청 (폼 + 완료 안내)
- [ ] 아이디어 리스트 / 아이디어 상세 페이지
- [ ] 아이디어 등록 (로그인 필수)
- [ ] 아이디어 댓글 / 추천 기능
- [ ] 마이페이지 (내 아이디어, 내 지원 내역)
- [ ] 관리자 대시보드 (제품 관리, 아이디어 상태 관리)

### 2.2 Out of Scope

- 결제/과금 시스템
- 실시간 채팅/메시징
- 소셜 로그인 (1차 범위 외)
- 모바일 앱 (웹 우선)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 이메일 회원가입 및 로그인 | High | Pending |
| FR-02 | 비로그인 사용자: 제품/아이디어 리스트 및 상세 조회 | High | Pending |
| FR-03 | 로그인 사용자: 아이디어 등록 | High | Pending |
| FR-04 | 로그인 사용자: 아이디어 댓글/추천 | Medium | Pending |
| FR-05 | 제품 상세에서 개발 지원 신청 폼 | High | Pending |
| FR-06 | 지원 완료 후 마이페이지/제품 상세 이동 | Medium | Pending |
| FR-07 | 마이페이지: 내 아이디어 목록, 지원 내역 | Medium | Pending |
| FR-08 | 아이디어 상세에서 관련 제품 연결 | Low | Pending |
| FR-09 | 관리자: 제품 등록/수정/삭제 | High | Pending |
| FR-10 | 관리자: 아이디어 상태 관리 (검토/승인/반려) | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 페이지 로드 < 2초 | Lighthouse |
| Security | 인증 토큰 기반 접근 제어 | Manual review |
| Accessibility | WCAG 2.1 AA 기본 준수 | axe DevTools |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 모든 페이지 라우팅 완료 (플로우차트 기준 12개 화면)
- [ ] 회원가입/로그인 동작 확인
- [ ] 제품 CRUD + 지원 신청 동작 확인
- [ ] 아이디어 CRUD + 댓글/추천 동작 확인
- [ ] 마이페이지 데이터 조회 확인
- [ ] 관리자 기능 동작 확인

### 4.2 Quality Criteria

- [ ] TypeScript strict mode
- [ ] Zero lint errors
- [ ] 빌드 성공

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 백엔드 구축 복잡도 | High | Medium | BaaS(bkend.ai) 활용으로 서버 구축 최소화 |
| 관리자 권한 오남용 | Medium | Low | RBAC 기반 권한 분리 |
| 아이디어-제품 연결 로직 복잡도 | Medium | Medium | 1차에서는 수동 연결(관리자), 추후 자동화 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure | Static sites, portfolios | ☐ |
| **Dynamic** | Feature-based modules, BaaS integration | Web apps with backend, SaaS MVPs | ☑ |
| **Enterprise** | Strict layer separation, microservices | High-traffic systems | ☐ |

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js / React / Vue | Next.js 14 (App Router) | 기존 프로젝트 스택 유지 |
| State Management | Context / Zustand / Redux | Zustand | 경량, 간단한 전역 상태 |
| API Client | fetch / axios / react-query | fetch + SWR | Next.js 호환성 |
| Form Handling | react-hook-form / formik | react-hook-form | 성능, 번들 크기 |
| Styling | Tailwind / CSS Modules | Tailwind CSS | 기존 프로젝트 스택 유지 |
| Backend | BaaS / Custom Server | BaaS (bkend.ai) | 서버 구축 없이 빠른 개발 |

### 6.3 Clean Architecture Approach

```
Selected Level: Dynamic

Folder Structure Preview:
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # 메인 홈
│   ├── login/             # 로그인
│   ├── signup/            # 회원가입
│   ├── products/          # 제품 리스트 & 상세
│   ├── ideas/             # 아이디어 리스트 & 상세 & 등록
│   ├── mypage/            # 마이페이지
│   └── admin/             # 관리자 대시보드
├── components/            # 공통 컴포넌트
│   ├── ui/               # 기본 UI 프리미티브
│   ├── layout/           # 레이아웃 (Header, Footer, Nav)
│   └── forms/            # 폼 컴포넌트
├── features/              # 기능별 모듈
│   ├── auth/             # 인증 관련
│   ├── products/         # 제품 관련
│   ├── ideas/            # 아이디어 관련
│   └── admin/            # 관리자 관련
├── services/              # API 통신 레이어
├── types/                 # TypeScript 타입 정의
└── lib/                   # 유틸리티, bkend 설정
```

---

## 7. Page Map (Flowchart 기반)

| # | Page | Route | Auth Required | Description |
|---|------|-------|:---:|-------------|
| 1 | 메인 홈 | `/` | No | 비로그인/로그인 상태 분기 |
| 2 | 로그인 | `/login` | No | 이메일/비밀번호 로그인 |
| 3 | 회원가입 | `/signup` | No | 정보 입력, 가입 완료 안내 |
| 4 | 제품 리스트 | `/products` | No | 진행 중인 제품 목록 |
| 5 | 제품 상세 | `/products/[id]` | No | 제품 정보, 지원하기 버튼 |
| 6 | 제품 지원 폼 | `/products/[id]/apply` | Yes | 개발 지원 신청서 |
| 7 | 아이디어 리스트 | `/ideas` | No | 아이디어 목록, 검색/필터 |
| 8 | 아이디어 상세 | `/ideas/[id]` | No | 상세, 댓글, 추천, 관련 제품 |
| 9 | 아이디어 등록 | `/ideas/new` | Yes | 아이디어 작성 폼 |
| 10 | 마이페이지 | `/mypage` | Yes | 내 아이디어, 내 지원 내역 |
| 11 | 관리자 대시보드 | `/admin` | Yes (Admin) | 관리 메뉴 |
| 12 | 제품 관리 | `/admin/products` | Yes (Admin) | 제품 CRUD |
| 13 | 아이디어 관리 | `/admin/ideas` | Yes (Admin) | 아이디어 상태 관리 |

---

## 8. Data Model (초안)

```
[User]
- id, email, password, name, role(user/admin), createdAt

[Product]
- id, title, description, status(진행중/완료/모집중), category, createdAt, updatedAt

[Application] (제품 지원)
- id, productId(→Product), userId(→User), message, status(대기/승인/반려), createdAt

[Idea]
- id, title, description, userId(→User), status(검토중/승인/반려), createdAt, updatedAt

[Comment]
- id, ideaId(→Idea), userId(→User), content, createdAt

[Recommendation] (추천)
- id, ideaId(→Idea), userId(→User), createdAt
```

---

## 9. Next Steps

1. [ ] Design 문서 작성 (`/pdca design idea-product-platform`)
2. [ ] 팀 리뷰 및 승인
3. [ ] 구현 시작

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-11 | Initial draft based on flowchart | peteryoo-sys |
