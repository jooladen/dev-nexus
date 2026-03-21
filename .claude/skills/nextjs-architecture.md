---
name: nextjs-architecture
description: Next.js App Router 아키텍처 가이드. Use when working with routing, layouts, server components, data fetching, or project structure decisions.
---

# Next.js Architecture

## App Router 규칙

### Server vs Client Component

- 기본: Server Component
- `"use client"` 필요한 경우: 이벤트 핸들러, useState/useEffect, 브라우저 API
- 패턴: Server Component에서 데이터 fetch → Client Component에 props 전달

### 라우트 구성

```
src/app/
├── (auth)/           # 인증 전용 레이아웃
│   ├── login/
│   └── signup/
├── (main)/           # 메인 레이아웃 (네비게이션 포함)
│   ├── dashboard/
│   └── settings/
└── api/              # Route Handlers
```

### 필수 파일

- `page.tsx` — 페이지 컴포넌트 + metadata export
- `loading.tsx` — Suspense 폴백 (Skeleton UI)
- `error.tsx` — 에러 바운더리 (`"use client"`)
- `not-found.tsx` — 404 처리

### 데이터 페칭

- Server Component에서 직접 async/await
- 클라이언트: React Query 또는 SWR
- API Route: Zod로 입력 검증, 적절한 HTTP 상태 코드 반환

### Metadata

```tsx
export const metadata: Metadata = {
  title: "페이지 제목",
  description: "설명",
};
```

### 의존성 방향

app/ → components/ → hooks/ → lib/ → types/ (역방향 금지)
