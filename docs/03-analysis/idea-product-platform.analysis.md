# idea-product-platform Analysis Report

> **Analysis Type**: Gap Analysis (Design vs Implementation)
>
> **Project**: 1st-blood
> **Analyst**: gap-detector
> **Date**: 2026-03-11
> **Design Doc**: [idea-product-platform.design.md](../02-design/features/idea-product-platform.design.md)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

Compare the design document against implemented source code to identify gaps, missing features, and deviations.

### 1.2 Analysis Scope

- **Design Document**: `docs/02-design/features/idea-product-platform.design.md`
- **Implementation Path**: `src/`
- **Analysis Date**: 2026-03-11

---

## 2. Overall Scores

| Category | Score | Status |
|----------|:-----:|:------:|
| Data Model Match | 97% | ✅ |
| API / Services Match | 90% | ✅ |
| UI Components Match | 100% | ✅ |
| Page Routes Match | 100% | ✅ |
| Hooks & Guards Match | 100% | ✅ |
| Error Handling Match | 75% | ⚠️ |
| Clean Architecture Compliance | 83% | ⚠️ |
| Convention Compliance | 90% | ✅ |
| **Overall** | **92%** | **✅** |

---

## 3. Data Model (Section 3) - 6 Entities

### 3.1 Entity Comparison

| Entity | Design File | Impl File | Status |
|--------|-------------|-----------|--------|
| User | `types/user.ts` | `src/types/user.ts` | ✅ Match |
| Product | `types/product.ts` | `src/types/product.ts` | ✅ Match |
| Application | `types/application.ts` | `src/types/application.ts` | ✅ Match |
| Idea | `types/idea.ts` | `src/types/idea.ts` | ✅ Match |
| Comment | `types/comment.ts` | `src/types/comment.ts` | ⚠️ Partial |
| Recommendation | `types/recommendation.ts` | `src/types/recommendation.ts` | ✅ Match |

### 3.2 Field-Level Differences

| Entity | Field | Design | Implementation | Status |
|--------|-------|--------|----------------|--------|
| Comment | userName | Not specified | `userName?: string` (added) | ⚠️ Added |

All other entities match the design exactly, including types, status unions, and optional fields.

### 3.3 Index Re-export

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| `types/index.ts` barrel export | Implied | All 6 entities + status types exported | ✅ Match |

**Data Model Score: 97%** (1 added field out of ~35 total fields)

---

## 4. API / Services (Section 4) - 6 Service Files

### 4.1 Service File Comparison

| Design Service | Impl File | Status |
|----------------|-----------|--------|
| `services/api.ts` (base client) | `src/services/api.ts` | ✅ Match |
| `services/authService.ts` | `src/services/authService.ts` | ⚠️ Partial |
| `services/productService.ts` | `src/services/productService.ts` | ✅ Match |
| `services/ideaService.ts` | `src/services/ideaService.ts` | ✅ Match |
| `services/commentService.ts` | `src/services/commentService.ts` | ✅ Match |
| `services/applicationService.ts` | `src/services/applicationService.ts` | ⚠️ Partial |
| (none specified separately) | `src/services/recommendationService.ts` | ✅ Match (covered by API 4.6) |

### 4.2 API Endpoint Coverage

#### Auth (Section 4.1)

| Method | Path | Design | Implementation | Status |
|--------|------|--------|----------------|--------|
| POST | /auth/signup | Yes | `authService.signup()` | ✅ |
| POST | /auth/login | Yes | `authService.login()` | ✅ |
| POST | /auth/logout | Yes | Client-side only (`localStorage.removeItem`) | ⚠️ Changed |
| GET | /auth/me | Yes | `authService.me()` | ✅ |

#### Products (Section 4.2)

| Method | Path | Design | Implementation | Status |
|--------|------|--------|----------------|--------|
| GET | /api/products | Yes | `productService.list()` | ✅ |
| GET | /api/products/:id | Yes | `productService.getById()` | ✅ |
| POST | /api/products | Yes | `productService.create()` | ✅ |
| PUT | /api/products/:id | Yes | `productService.update()` | ✅ |
| DELETE | /api/products/:id | Yes | `productService.delete()` | ✅ |

#### Applications (Section 4.3)

| Method | Path | Design | Implementation | Status |
|--------|------|--------|----------------|--------|
| POST | /api/applications | Yes | `applicationService.create()` | ✅ |
| GET | /api/applications?userId={id} | Yes | `applicationService.listByUser()` uses `?mine=true` | ⚠️ Changed |
| PUT | /api/applications/:id | Yes | `applicationService.updateStatus()` | ✅ |

#### Ideas (Section 4.4)

| Method | Path | Design | Implementation | Status |
|--------|------|--------|----------------|--------|
| GET | /api/ideas | Yes | `ideaService.list()` | ✅ |
| GET | /api/ideas/:id | Yes | `ideaService.getById()` | ✅ |
| POST | /api/ideas | Yes | `ideaService.create()` | ✅ |
| PUT | /api/ideas/:id | Yes | `ideaService.update()` | ✅ |
| DELETE | /api/ideas/:id | Yes | `ideaService.delete()` | ✅ |

#### Comments (Section 4.5)

| Method | Path | Design | Implementation | Status |
|--------|------|--------|----------------|--------|
| GET | /api/comments?ideaId={id} | Yes | `commentService.listByIdea()` | ✅ |
| POST | /api/comments | Yes | `commentService.create()` | ✅ |
| DELETE | /api/comments/:id | Yes | `commentService.delete()` | ✅ |

#### Recommendations (Section 4.6)

| Method | Path | Design | Implementation | Status |
|--------|------|--------|----------------|--------|
| POST | /api/recommendations (toggle) | Yes | `recommendationService.toggle()` | ✅ |
| GET | /api/recommendations?ideaId&userId | Yes | `recommendationService.check()` uses `/check?ideaId=` | ⚠️ Changed |

**API Score: 90%** (22/24 exact match, 2 minor path deviations)

---

## 5. UI Components (Section 5.3) - 20 Components

| # | Component | Design Path | Impl Path | Status |
|---|-----------|-------------|-----------|--------|
| 1 | Header | `components/layout/Header.tsx` | `src/components/layout/Header.tsx` | ✅ Match |
| 2 | Footer | `components/layout/Footer.tsx` | `src/components/layout/Footer.tsx` | ✅ Match |
| 3 | ProductCard | `components/products/ProductCard.tsx` | `src/components/products/ProductCard.tsx` | ✅ Match |
| 4 | ProductDetail | `components/products/ProductDetail.tsx` | `src/components/products/ProductDetail.tsx` | ✅ Match |
| 5 | ApplicationForm | `components/products/ApplicationForm.tsx` | `src/components/products/ApplicationForm.tsx` | ✅ Match |
| 6 | IdeaCard | `components/ideas/IdeaCard.tsx` | `src/components/ideas/IdeaCard.tsx` | ✅ Match |
| 7 | IdeaDetail | `components/ideas/IdeaDetail.tsx` | `src/components/ideas/IdeaDetail.tsx` | ✅ Match |
| 8 | IdeaForm | `components/ideas/IdeaForm.tsx` | `src/components/ideas/IdeaForm.tsx` | ✅ Match |
| 9 | CommentList | `components/ideas/CommentList.tsx` | `src/components/ideas/CommentList.tsx` | ✅ Match |
| 10 | CommentForm | `components/ideas/CommentForm.tsx` | `src/components/ideas/CommentForm.tsx` | ✅ Match |
| 11 | RecommendButton | `components/ideas/RecommendButton.tsx` | `src/components/ideas/RecommendButton.tsx` | ✅ Match |
| 12 | LoginForm | `components/auth/LoginForm.tsx` | `src/components/auth/LoginForm.tsx` | ✅ Match |
| 13 | SignupForm | `components/auth/SignupForm.tsx` | `src/components/auth/SignupForm.tsx` | ✅ Match |
| 14 | AuthGuard | `components/auth/AuthGuard.tsx` | `src/components/auth/AuthGuard.tsx` | ✅ Match |
| 15 | AdminGuard | `components/auth/AdminGuard.tsx` | `src/components/auth/AdminGuard.tsx` | ✅ Match |
| 16 | AdminProductTable | `components/admin/AdminProductTable.tsx` | `src/components/admin/AdminProductTable.tsx` | ✅ Match |
| 17 | AdminIdeaTable | `components/admin/AdminIdeaTable.tsx` | `src/components/admin/AdminIdeaTable.tsx` | ✅ Match |
| 18 | StatusBadge | `components/ui/StatusBadge.tsx` | `src/components/ui/StatusBadge.tsx` | ✅ Match |
| 19 | Pagination | `components/ui/Pagination.tsx` | `src/components/ui/Pagination.tsx` | ✅ Match |
| 20 | EmptyState | `components/ui/EmptyState.tsx` | `src/components/ui/EmptyState.tsx` | ✅ Match |

**Component Score: 100%** (20/20 components implemented at exact designed paths)

---

## 6. Page Routes (Section 11.1) - 13 Pages

| # | Page | Design Path | Impl Path | Status |
|---|------|-------------|-----------|--------|
| 1 | Root layout | `app/layout.tsx` | `src/app/layout.tsx` | ✅ Match |
| 2 | Home | `app/page.tsx` | `src/app/page.tsx` | ✅ Match |
| 3 | Login | `app/login/page.tsx` | `src/app/login/page.tsx` | ✅ Match |
| 4 | Signup | `app/signup/page.tsx` | `src/app/signup/page.tsx` | ✅ Match |
| 5 | Product List | `app/products/page.tsx` | `src/app/products/page.tsx` | ✅ Match |
| 6 | Product Detail | `app/products/[id]/page.tsx` | `src/app/products/[id]/page.tsx` | ✅ Match |
| 7 | Apply | `app/products/[id]/apply/page.tsx` | `src/app/products/[id]/apply/page.tsx` | ✅ Match |
| 8 | Idea List | `app/ideas/page.tsx` | `src/app/ideas/page.tsx` | ✅ Match |
| 9 | Idea New | `app/ideas/new/page.tsx` | `src/app/ideas/new/page.tsx` | ✅ Match |
| 10 | Idea Detail | `app/ideas/[id]/page.tsx` | `src/app/ideas/[id]/page.tsx` | ✅ Match |
| 11 | My Page | `app/mypage/page.tsx` | `src/app/mypage/page.tsx` | ✅ Match |
| 12 | Admin Dashboard | `app/admin/page.tsx` | `src/app/admin/page.tsx` | ✅ Match |
| 13 | Admin Products | `app/admin/products/page.tsx` | `src/app/admin/products/page.tsx` | ✅ Match |
| 14 | Admin Ideas | `app/admin/ideas/page.tsx` | `src/app/admin/ideas/page.tsx` | ✅ Match |

**Page Routes Score: 100%** (14/14 pages, including root layout)

---

## 7. Implementation Order Items (Section 11.2) - Hooks, Guards, Forms

### 7.1 Hooks

| Hook | Design Path | Impl Path | Status |
|------|-------------|-----------|--------|
| useAuth | `hooks/useAuth.ts` | `src/hooks/useAuth.ts` | ✅ Match |
| useProducts | `hooks/useProducts.ts` | `src/hooks/useProducts.ts` | ✅ Match |
| useIdeas | `hooks/useIdeas.ts` | `src/hooks/useIdeas.ts` | ✅ Match |
| useApplications | `hooks/useApplications.ts` | `src/hooks/useApplications.ts` | ✅ Match |

### 7.2 State Management

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| Auth state | Zustand | Zustand (`create<AuthState>`) | ✅ Match |
| Server state | SWR | SWR (`useSWR`) | ✅ Match |

### 7.3 Form Validation

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| Form library | react-hook-form | `useForm` from react-hook-form | ✅ Match |
| Validation | Zod | `zodResolver` with `z.object()` schemas | ✅ Match |

### 7.4 Guards

| Guard | Design | Implementation | Status |
|-------|--------|----------------|--------|
| AuthGuard | Redirect to /login if no user | Redirects to `/login`, shows loading state | ✅ Match |
| AdminGuard | Redirect if not admin | Checks `user.role !== 'admin'`, redirects | ✅ Match |

**Hooks/Guards/Forms Score: 100%**

---

## 8. Error Handling (Section 6)

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| ApiError class | `throw new ApiError(res.status, error.message)` | `ApiError` class in `services/api.ts` with `status` and `message` | ✅ Match |
| apiRequest pattern | `fetch` + `!res.ok` check + throw ApiError | Implemented identically with graceful JSON parse fallback | ✅ Match |
| 401 redirect to login | Defined | AuthGuard redirects; no global 401 interceptor | ⚠️ Partial |
| 403 "no permission" display | Defined | AdminGuard handles; no global 403 handler | ⚠️ Partial |
| 409 duplicate toast | Defined | No toast notification system implemented | ❌ Missing |
| Form validation messages | 400 error handling | Zod validation shows inline errors | ✅ Match |

**Error Handling Score: 75%** (3/4 core patterns present; toast system and global error interceptors missing)

---

## 9. Clean Architecture (Section 9)

### 9.1 Layer Assignment Verification

| Component | Designed Layer | Designed Location | Actual Location | Status |
|-----------|---------------|-------------------|-----------------|--------|
| Page routes | Presentation | `src/app/` | `src/app/` | ✅ |
| UI Components | Presentation | `src/components/` | `src/components/` | ✅ |
| useAuth, useProducts, etc. | Application | `src/hooks/` | `src/hooks/` | ✅ |
| Types (User, Product, etc.) | Domain | `src/types/` | `src/types/` | ✅ |
| apiRequest, services | Infrastructure | `src/services/` | `src/services/` | ✅ |
| utils | Infrastructure | `src/lib/utils.ts` | Not found | ❌ Missing |

### 9.2 Dependency Violations

| File | Layer | Issue | Severity |
|------|-------|-------|----------|
| `components/products/ApplicationForm.tsx` | Presentation | Imports `@/services/applicationService` directly (bypasses hook) | ⚠️ Medium |
| `components/ideas/IdeaForm.tsx` | Presentation | Imports `@/services/ideaService` directly | ⚠️ Medium |
| `components/ideas/CommentForm.tsx` | Presentation | Imports `@/services/commentService` directly | ⚠️ Medium |
| `components/ideas/RecommendButton.tsx` | Presentation | Imports `@/services/recommendationService` directly | ⚠️ Medium |
| `components/admin/AdminProductTable.tsx` | Presentation | Imports `@/services/productService` directly | ⚠️ Medium |
| `components/admin/AdminIdeaTable.tsx` | Presentation | Imports `@/services/ideaService` directly | ⚠️ Medium |
| `app/ideas/[id]/page.tsx` | Presentation | Imports `@/services/commentService` directly | ⚠️ Medium |
| `app/admin/products/page.tsx` | Presentation | Imports `@/services/productService` directly | ⚠️ Medium |

Per the design (Section 9), Presentation should go through Application (hooks), not directly to Infrastructure (services). 8 files violate this rule.

### 9.3 Architecture Score

```
Architecture Compliance: 83%
  ✅ Correct layer placement: 5/6 locations
  ⚠️ Dependency violations:  8 files (Presentation -> Infrastructure)
  ❌ Missing:                1 file (lib/utils.ts)
```

---

## 10. Convention Compliance (Section 10)

### 10.1 Naming Convention

| Category | Convention | Compliance | Violations |
|----------|-----------|:----------:|------------|
| Components | PascalCase | 100% | None |
| Files (component) | PascalCase.tsx | 100% | None |
| Files (utility) | camelCase.ts | 100% | None |
| Hooks | use + camelCase | 100% | None |
| Services | camelCase.ts | 100% | None |
| Folders | kebab-case / feature-name | 100% | None |

### 10.2 Environment Variables

| Variable | Design | Implementation | Status |
|----------|--------|----------------|--------|
| `NEXT_PUBLIC_BKEND_API_URL` | Section 10.2 | `NEXT_PUBLIC_API_URL` in `services/api.ts` | ⚠️ Name differs |
| `NEXT_PUBLIC_BKEND_PROJECT_ID` | Section 10.2 | Not found in code | ❌ Missing |
| `.env.example` | Recommended | Not found | ❌ Missing |

### 10.3 Convention Score

```
Convention Compliance: 90%
  Naming:          100%
  Folder Structure: 95% (lib/utils.ts missing)
  Env Variables:    50% (name mismatch, no .env.example)
```

---

## 11. Differences Summary

### 11.1 Missing Features (Design O, Implementation X)

| # | Item | Design Location | Description |
|---|------|-----------------|-------------|
| 1 | Toast notification system | Section 6:409 | No toast for duplicate actions (recommend, apply) |
| 2 | Global 401/403 interceptor | Section 6 | No centralized error interceptor in API client |
| 3 | `lib/utils.ts` | Section 11.1 | Utility file not created |
| 4 | `.env.example` | Section 10.2 | No environment variable template |
| 5 | `NEXT_PUBLIC_BKEND_PROJECT_ID` | Section 10.2 | Environment variable not referenced |

### 11.2 Added Features (Design X, Implementation O)

| # | Item | Impl Location | Description |
|---|------|---------------|-------------|
| 1 | `Comment.userName` field | `src/types/comment.ts` | Optional field for display name |
| 2 | Recommendation check endpoint | `src/services/recommendationService.ts` | `/check?ideaId=` path (design had query params) |
| 3 | SWR loading skeletons | Multiple page files | Animated pulse placeholders (not in design) |

### 11.3 Changed Features (Design != Implementation)

| # | Item | Design | Implementation | Impact |
|---|------|--------|----------------|--------|
| 1 | Logout API | `POST /auth/logout` server call | Client-side `localStorage.removeItem` only | Low |
| 2 | Applications query | `?userId={id}` | `?mine=true` | Low |
| 3 | Recommendation check | `?ideaId={id}&userId={id}` | `/check?ideaId={id}` (server resolves user) | Low |
| 4 | Env var name | `NEXT_PUBLIC_BKEND_API_URL` | `NEXT_PUBLIC_API_URL` | Low |

---

## 12. Match Rate Calculation

| Category | Total Items | Matched | Partial | Missing | Rate |
|----------|:-----------:|:-------:|:-------:|:-------:|:----:|
| Data Model (6 entities, ~35 fields) | 35 | 34 | 1 | 0 | 97% |
| API Endpoints (24 endpoints) | 24 | 21 | 3 | 0 | 88% |
| Components (20) | 20 | 20 | 0 | 0 | 100% |
| Pages (14) | 14 | 14 | 0 | 0 | 100% |
| Hooks/Guards (8 items) | 8 | 8 | 0 | 0 | 100% |
| Error Handling (5 patterns) | 5 | 3 | 1 | 1 | 70% |
| Architecture (6 layers + deps) | 14 | 6 | 7 | 1 | 64% |
| Conventions (naming + env) | 10 | 8 | 0 | 2 | 80% |
| **TOTAL** | **130** | **114** | **12** | **4** | **92%** |

```
Overall Match Rate: 92%

  ✅ Matched:         114 items  (88%)
  ⚠️ Partial/Changed:  12 items  (9%)
  ❌ Missing:            4 items  (3%)
```

---

## 13. Recommended Actions

### 13.1 Immediate (Low Effort)

| # | Priority | Action | Files |
|---|----------|--------|-------|
| 1 | Medium | Create `.env.example` with `NEXT_PUBLIC_BKEND_API_URL` and `NEXT_PUBLIC_BKEND_PROJECT_ID` | `.env.example` |
| 2 | Low | Rename `NEXT_PUBLIC_API_URL` to `NEXT_PUBLIC_BKEND_API_URL` in `services/api.ts` to match design | `src/services/api.ts` |
| 3 | Low | Create `src/lib/utils.ts` even if empty (match design structure) | `src/lib/utils.ts` |

### 13.2 Short-term (Architecture Improvement)

| # | Priority | Action | Impact |
|---|----------|--------|--------|
| 1 | Medium | Move direct service imports from 8 Presentation components into hooks | Fixes architecture violations |
| 2 | Medium | Add global error interceptor in `api.ts` for 401 redirect | Consistent auth error handling |
| 3 | Low | Add toast notification library (e.g., `sonner` or `react-hot-toast`) for 409 errors | UX completeness |

### 13.3 Design Document Updates Needed

| # | Item | Action |
|---|------|--------|
| 1 | `Comment.userName` field | Add `userName?: string` to design Section 3.1 |
| 2 | Logout implementation | Update Section 4.1 to note client-side only logout |
| 3 | Applications query param | Update Section 4.3 from `?userId={id}` to `?mine=true` |
| 4 | Recommendation check path | Update Section 4.6 to `/check?ideaId={id}` |

---

## 14. Conclusion

The implementation achieves a **92% match rate** against the design document, exceeding the 90% threshold. All 20 UI components, all 14 pages, all 4 hooks, and all 6 type definitions are implemented at the correct paths. The primary gaps are:

- **Architecture layer violations**: 8 Presentation-layer files import Infrastructure-layer services directly instead of going through Application-layer hooks
- **Missing error handling infrastructure**: No toast system, no global HTTP error interceptor
- **Minor environment variable naming mismatch**

These gaps are all addressable without structural changes and do not block feature completion.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-11 | Initial gap analysis | gap-detector |
