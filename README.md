# 1st Blood - 아이디어를 제품으로

아이디어 제안과 제품 개발 지원을 연결하는 플랫폼

## Overview

아이디어를 가진 기획자와 프로젝트를 찾는 개발자를 연결합니다.
- 아이디어를 등록하고 댓글/추천으로 피드백
- 진행 중인 제품에 개발 지원 신청
- 관리자가 제품과 아이디어를 관리

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand (auth), SWR (server state)
- **Form**: react-hook-form + Zod
- **Backend**: BaaS (bkend.ai)

## Pages

| Page | Route | Auth |
|------|-------|:----:|
| 메인 홈 | `/` | - |
| 로그인 | `/login` | - |
| 회원가입 | `/signup` | - |
| 제품 리스트 | `/products` | - |
| 제품 상세 | `/products/[id]` | - |
| 제품 지원 신청 | `/products/[id]/apply` | Required |
| 아이디어 리스트 | `/ideas` | - |
| 아이디어 상세 | `/ideas/[id]` | - |
| 아이디어 등록 | `/ideas/new` | Required |
| 마이페이지 | `/mypage` | Required |
| 관리자 대시보드 | `/admin` | Admin |
| 제품 관리 | `/admin/products` | Admin |
| 아이디어 관리 | `/admin/ideas` | Admin |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # UI components
│   ├── admin/     # 관리자 컴포넌트
│   ├── auth/      # 인증 (LoginForm, SignupForm, Guards)
│   ├── ideas/     # 아이디어 (Card, Detail, Form, Comments)
│   ├── layout/    # Header, Footer
│   ├── products/  # 제품 (Card, Detail, ApplicationForm)
│   └── ui/        # 공통 UI (StatusBadge, Pagination, EmptyState)
├── hooks/         # Custom hooks (useAuth, useProducts, useIdeas)
├── services/      # API client & service layers
└── types/         # TypeScript type definitions
```

## License

MIT
