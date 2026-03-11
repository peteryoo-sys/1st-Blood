# Idea-Product Platform Design Document

> **Summary**: 아이디어-제품 연결 플랫폼의 기술 설계
>
> **Project**: 1st-blood
> **Author**: peteryoo-sys
> **Date**: 2026-03-11
> **Status**: Draft
> **Planning Doc**: [idea-product-platform.plan.md](../../01-plan/features/idea-product-platform.plan.md)

---

## 1. Overview

### 1.1 Design Goals

- 플로우차트 기반 13개 화면을 Next.js App Router로 구현
- BaaS(bkend.ai) 활용하여 백엔드 코드 없이 CRUD 및 인증 처리
- 비로그인/로그인/관리자 3단계 접근 제어
- 반응형 UI (Tailwind CSS)

### 1.2 Design Principles

- **Feature-based architecture**: 기능별 모듈 분리 (auth, products, ideas, admin)
- **Server Components 우선**: 데이터 fetching은 Server Component에서 처리
- **Progressive enhancement**: 비로그인도 핵심 콘텐츠 탐색 가능

---

## 2. Architecture

### 2.1 Component Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    Client (Browser)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Pages   │  │Components│  │  Hooks   │  │  Store   │ │
│  │(App Router)│ │  (UI)    │  │(Custom)  │  │(Zustand) │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       └──────────────┴─────────────┴─────────────┘       │
│                           │                                │
│                    ┌──────┴───────┐                        │
│                    │  Services    │                        │
│                    │ (API Client) │                        │
│                    └──────┬───────┘                        │
└───────────────────────────┼────────────────────────────────┘
                            │ REST API
                    ┌───────┴────────┐
                    │  bkend.ai BaaS │
                    │  (Auth + CRUD) │
                    └───────┬────────┘
                            │
                    ┌───────┴────────┐
                    │   MongoDB      │
                    └────────────────┘
```

### 2.2 Data Flow

```
[비로그인] → 제품/아이디어 리스트·상세 조회 (GET only)
[로그인]   → 아이디어 등록, 댓글/추천, 제품 지원 신청 (GET + POST)
[관리자]   → 제품 CRUD, 아이디어 상태 관리 (Full CRUD)
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| Pages (App Router) | Components, Services | 화면 렌더링 |
| Components | UI primitives, Types | 재사용 가능한 UI |
| Services | bkend.ai REST API | 데이터 통신 |
| Auth Store (Zustand) | Services | 인증 상태 관리 |

---

## 3. Data Model

### 3.1 Entity Definition

```typescript
// types/user.ts
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// types/product.ts
type ProductStatus = 'recruiting' | 'in_progress' | 'completed';

interface Product {
  id: string;
  title: string;
  description: string;
  status: ProductStatus;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// types/application.ts
type ApplicationStatus = 'pending' | 'approved' | 'rejected';

interface Application {
  id: string;
  productId: string;
  userId: string;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
}

// types/idea.ts
type IdeaStatus = 'reviewing' | 'approved' | 'rejected';

interface Idea {
  id: string;
  title: string;
  description: string;
  userId: string;
  status: IdeaStatus;
  recommendCount: number;
  createdAt: string;
  updatedAt: string;
}

// types/comment.ts
interface Comment {
  id: string;
  ideaId: string;
  userId: string;
  content: string;
  createdAt: string;
}

// types/recommendation.ts
interface Recommendation {
  id: string;
  ideaId: string;
  userId: string;
  createdAt: string;
}
```

### 3.2 Entity Relationships

```
[User] 1 ──── N [Idea]          (사용자가 아이디어 등록)
[User] 1 ──── N [Application]   (사용자가 제품에 지원)
[User] 1 ──── N [Comment]       (사용자가 댓글 작성)
[User] 1 ──── N [Recommendation](사용자가 추천)

[Product] 1 ──── N [Application] (제품에 지원 내역)

[Idea] 1 ──── N [Comment]       (아이디어에 댓글)
[Idea] 1 ──── N [Recommendation](아이디어에 추천)
[Idea] N ──── M [Product]        (관련 제품 연결, 관리자 설정)
```

### 3.3 bkend.ai Table Schema

**users** (bkend.ai 기본 인증 테이블 활용)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | String | Yes | 이메일 (로그인 ID) |
| name | String | Yes | 사용자 이름 |
| role | String | Yes | 'user' / 'admin' |

**products**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | 제품명 |
| description | String | Yes | 제품 설명 |
| status | String | Yes | 'recruiting' / 'in_progress' / 'completed' |
| category | String | No | 카테고리 |
| imageUrl | String | No | 대표 이미지 |

**applications**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productId | String | Yes | 제품 ID (FK) |
| userId | String | Yes | 지원자 ID (FK) |
| message | String | Yes | 지원 메시지 |
| status | String | Yes | 'pending' / 'approved' / 'rejected' |

**ideas**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | 아이디어 제목 |
| description | String | Yes | 아이디어 설명 |
| userId | String | Yes | 작성자 ID (FK) |
| status | String | Yes | 'reviewing' / 'approved' / 'rejected' |
| recommendCount | Number | No | 추천 수 (캐시) |

**comments**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ideaId | String | Yes | 아이디어 ID (FK) |
| userId | String | Yes | 작성자 ID (FK) |
| content | String | Yes | 댓글 내용 |

**recommendations**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ideaId | String | Yes | 아이디어 ID (FK) |
| userId | String | Yes | 추천자 ID (FK) |

---

## 4. API Specification

### 4.1 Authentication (bkend.ai Auth)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /auth/signup | 회원가입 | No |
| POST | /auth/login | 로그인 (JWT 발급) | No |
| POST | /auth/logout | 로그아웃 | Yes |
| GET | /auth/me | 현재 사용자 정보 | Yes |

### 4.2 Products API

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/products | 제품 리스트 (필터/정렬/페이지네이션) | No |
| GET | /api/products/:id | 제품 상세 | No |
| POST | /api/products | 제품 등록 | Admin |
| PUT | /api/products/:id | 제품 수정 | Admin |
| DELETE | /api/products/:id | 제품 삭제 | Admin |

### 4.3 Applications API

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /api/applications | 지원 신청 | Yes |
| GET | /api/applications?userId={id} | 내 지원 내역 | Yes |
| PUT | /api/applications/:id | 지원 상태 변경 | Admin |

### 4.4 Ideas API

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/ideas | 아이디어 리스트 (필터/정렬/페이지네이션) | No |
| GET | /api/ideas/:id | 아이디어 상세 | No |
| POST | /api/ideas | 아이디어 등록 | Yes |
| PUT | /api/ideas/:id | 아이디어 수정 (본인 또는 Admin) | Yes |
| DELETE | /api/ideas/:id | 아이디어 삭제 | Admin |

### 4.5 Comments API

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/comments?ideaId={id} | 아이디어 댓글 목록 | No |
| POST | /api/comments | 댓글 작성 | Yes |
| DELETE | /api/comments/:id | 댓글 삭제 (본인 또는 Admin) | Yes |

### 4.6 Recommendations API

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /api/recommendations | 추천 (토글) | Yes |
| GET | /api/recommendations?ideaId={id}&userId={id} | 추천 여부 확인 | Yes |

---

## 5. UI/UX Design

### 5.1 공통 레이아웃

```
┌─────────────────────────────────────────────────┐
│  Header                                          │
│  [Logo] [제품] [아이디어] ... [로그인/마이페이지] │
├─────────────────────────────────────────────────┤
│                                                  │
│  Main Content                                    │
│  (페이지별 콘텐츠)                                │
│                                                  │
├─────────────────────────────────────────────────┤
│  Footer                                          │
│  [About] [Contact] [Terms]                       │
└─────────────────────────────────────────────────┘
```

### 5.2 User Flow (Flowchart 기반)

```
비로그인 사용자:
  홈 → 제품 리스트 → 제품 상세
  홈 → 아이디어 리스트 → 아이디어 상세
  홈 → 로그인/회원가입

로그인 사용자:
  홈 → 아이디어 등록 → 아이디어 리스트
  홈 → 제품 상세 → 지원 신청 → 완료 안내
  홈 → 마이페이지 → 내 아이디어/지원 내역

관리자:
  홈 → 관리자 대시보드 → 제품 관리 / 아이디어 관리
```

### 5.3 Component List

| Component | Location | Responsibility |
|-----------|----------|----------------|
| Header | `src/components/layout/Header.tsx` | 네비게이션, 인증 상태 표시 |
| Footer | `src/components/layout/Footer.tsx` | 하단 링크 |
| ProductCard | `src/components/products/ProductCard.tsx` | 제품 카드 UI |
| ProductDetail | `src/components/products/ProductDetail.tsx` | 제품 상세 정보 |
| ApplicationForm | `src/components/products/ApplicationForm.tsx` | 지원 신청 폼 |
| IdeaCard | `src/components/ideas/IdeaCard.tsx` | 아이디어 카드 UI |
| IdeaDetail | `src/components/ideas/IdeaDetail.tsx` | 아이디어 상세 정보 |
| IdeaForm | `src/components/ideas/IdeaForm.tsx` | 아이디어 등록/수정 폼 |
| CommentList | `src/components/ideas/CommentList.tsx` | 댓글 목록 |
| CommentForm | `src/components/ideas/CommentForm.tsx` | 댓글 작성 |
| RecommendButton | `src/components/ideas/RecommendButton.tsx` | 추천 버튼 (토글) |
| LoginForm | `src/components/auth/LoginForm.tsx` | 로그인 폼 |
| SignupForm | `src/components/auth/SignupForm.tsx` | 회원가입 폼 |
| AuthGuard | `src/components/auth/AuthGuard.tsx` | 인증 필요 페이지 감싸기 |
| AdminGuard | `src/components/auth/AdminGuard.tsx` | 관리자 전용 페이지 감싸기 |
| AdminProductTable | `src/components/admin/AdminProductTable.tsx` | 제품 관리 테이블 |
| AdminIdeaTable | `src/components/admin/AdminIdeaTable.tsx` | 아이디어 관리 테이블 |
| StatusBadge | `src/components/ui/StatusBadge.tsx` | 상태 뱃지 |
| Pagination | `src/components/ui/Pagination.tsx` | 페이지네이션 |
| EmptyState | `src/components/ui/EmptyState.tsx` | 빈 상태 표시 |

---

## 6. Error Handling

### 6.1 Error Code Definition

| Code | Message | Cause | Handling |
|------|---------|-------|----------|
| 400 | 입력값 오류 | 필수 필드 누락, 형식 오류 | 폼 validation 메시지 표시 |
| 401 | 인증 필요 | 토큰 만료/없음 | 로그인 페이지로 리다이렉트 |
| 403 | 권한 없음 | 관리자 전용 접근 | "접근 권한이 없습니다" 표시 |
| 404 | 찾을 수 없음 | 존재하지 않는 리소스 | 404 페이지 표시 |
| 409 | 중복 | 이미 추천함, 이미 지원함 | 토스트 알림 |

### 6.2 Client-side Error Handling Pattern

```typescript
// services/api.ts
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new ApiError(res.status, error.message);
  }
  return res.json();
}
```

---

## 7. Security Considerations

- [x] react-hook-form 기반 입력 검증 (XSS 방지)
- [ ] bkend.ai JWT 토큰 기반 인증
- [ ] 관리자 API에 role 기반 접근 제어 (RBAC)
- [ ] 환경변수로 API URL 관리 (하드코딩 금지)
- [ ] HTTPS 강제 (배포 시)

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool |
|------|--------|------|
| Manual QA | 전체 User Flow | Zero Script QA (Docker logs) |
| E2E | 핵심 시나리오 | Playwright (추후) |

### 8.2 Test Cases (Key)

- [ ] 비로그인: 제품/아이디어 리스트 및 상세 조회 가능
- [ ] 비로그인: 아이디어 등록/지원 신청 시 로그인 리다이렉트
- [ ] 회원가입 → 로그인 → 아이디어 등록 → 리스트 확인
- [ ] 로그인 → 제품 상세 → 지원 신청 → 완료 → 마이페이지 확인
- [ ] 아이디어 상세: 댓글 작성, 추천 토글
- [ ] 관리자: 제품 등록/수정/삭제
- [ ] 관리자: 아이디어 상태 변경 (검토중→승인/반려)

---

## 9. Clean Architecture

### 9.1 Layer Structure

| Layer | Responsibility | Location |
|-------|---------------|----------|
| **Presentation** | Pages, UI components, hooks | `src/app/`, `src/components/` |
| **Application** | Business logic, data fetching hooks | `src/hooks/`, `src/features/` |
| **Domain** | Type definitions, constants | `src/types/` |
| **Infrastructure** | API client, auth helpers | `src/lib/`, `src/services/` |

### 9.2 This Feature's Layer Assignment

| Component | Layer | Location |
|-----------|-------|----------|
| Page routes | Presentation | `src/app/(pages)/` |
| ProductCard, IdeaCard, Forms | Presentation | `src/components/{feature}/` |
| useAuth, useProducts, useIdeas | Application | `src/hooks/` |
| User, Product, Idea types | Domain | `src/types/` |
| apiRequest, authService | Infrastructure | `src/services/`, `src/lib/` |

---

## 10. Coding Convention Reference

### 10.1 This Feature's Conventions

| Item | Convention Applied |
|------|-------------------|
| Component naming | PascalCase (`ProductCard.tsx`) |
| File organization | Feature-based grouping in `components/` |
| State management | Zustand for auth, SWR for server state |
| Error handling | ApiError class + toast notifications |
| Form handling | react-hook-form with Zod validation |

### 10.2 Environment Variables

| Variable | Purpose | Scope |
|----------|---------|-------|
| `NEXT_PUBLIC_BKEND_API_URL` | bkend.ai API endpoint | Client |
| `NEXT_PUBLIC_BKEND_PROJECT_ID` | bkend.ai project ID | Client |

---

## 11. Implementation Guide

### 11.1 File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Header + Footer)
│   ├── page.tsx                # 메인 홈
│   ├── login/
│   │   └── page.tsx            # 로그인 페이지
│   ├── signup/
│   │   └── page.tsx            # 회원가입 페이지
│   ├── products/
│   │   ├── page.tsx            # 제품 리스트
│   │   └── [id]/
│   │       ├── page.tsx        # 제품 상세
│   │       └── apply/
│   │           └── page.tsx    # 지원 신청 폼
│   ├── ideas/
│   │   ├── page.tsx            # 아이디어 리스트
│   │   ├── new/
│   │   │   └── page.tsx        # 아이디어 등록
│   │   └── [id]/
│   │       └── page.tsx        # 아이디어 상세
│   ├── mypage/
│   │   └── page.tsx            # 마이페이지
│   └── admin/
│       ├── page.tsx            # 관리자 대시보드
│       ├── products/
│       │   └── page.tsx        # 제품 관리
│       └── ideas/
│           └── page.tsx        # 아이디어 관리
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── AuthGuard.tsx
│   │   └── AdminGuard.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetail.tsx
│   │   └── ApplicationForm.tsx
│   ├── ideas/
│   │   ├── IdeaCard.tsx
│   │   ├── IdeaDetail.tsx
│   │   ├── IdeaForm.tsx
│   │   ├── CommentList.tsx
│   │   ├── CommentForm.tsx
│   │   └── RecommendButton.tsx
│   ├── admin/
│   │   ├── AdminProductTable.tsx
│   │   └── AdminIdeaTable.tsx
│   └── ui/
│       ├── StatusBadge.tsx
│       ├── Pagination.tsx
│       └── EmptyState.tsx
├── services/
│   ├── api.ts                  # Base API client
│   ├── authService.ts          # Auth API calls
│   ├── productService.ts       # Product API calls
│   ├── ideaService.ts          # Idea API calls
│   ├── commentService.ts       # Comment API calls
│   └── applicationService.ts   # Application API calls
├── hooks/
│   ├── useAuth.ts              # Auth state + actions
│   ├── useProducts.ts          # Product data fetching
│   ├── useIdeas.ts             # Idea data fetching
│   └── useApplications.ts     # Application data fetching
├── types/
│   ├── user.ts
│   ├── product.ts
│   ├── idea.ts
│   ├── comment.ts
│   ├── application.ts
│   └── recommendation.ts
└── lib/
    └── utils.ts                # 공통 유틸리티
```

### 11.2 Implementation Order

1. [ ] **Phase 1: 기반 구조** (Day 1)
   - Types 정의 (모든 entity)
   - API client 기본 설정 (`services/api.ts`)
   - 공통 레이아웃 (Header, Footer)
   - Root layout 연결

2. [ ] **Phase 2: 인증** (Day 2)
   - bkend.ai Auth 연동
   - LoginForm, SignupForm
   - useAuth hook (Zustand)
   - AuthGuard, AdminGuard

3. [ ] **Phase 3: 제품** (Day 3)
   - productService
   - 제품 리스트 페이지 + ProductCard
   - 제품 상세 페이지 + ProductDetail
   - 지원 신청 폼 + ApplicationForm

4. [ ] **Phase 4: 아이디어** (Day 4)
   - ideaService, commentService
   - 아이디어 리스트 + IdeaCard
   - 아이디어 상세 + IdeaDetail + CommentList + RecommendButton
   - 아이디어 등록 폼 + IdeaForm

5. [ ] **Phase 5: 마이페이지** (Day 5)
   - 마이페이지 (내 아이디어 + 내 지원 내역)
   - applicationService

6. [ ] **Phase 6: 관리자** (Day 6)
   - 관리자 대시보드
   - 제품 관리 (AdminProductTable)
   - 아이디어 상태 관리 (AdminIdeaTable)

7. [ ] **Phase 7: 홈 + 마무리** (Day 7)
   - 메인 홈 (비로그인/로그인 분기)
   - UI 폴리시, 빈 상태 처리
   - 전체 플로우 검증

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-11 | Initial design based on plan document | peteryoo-sys |
