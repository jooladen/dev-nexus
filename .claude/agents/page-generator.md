---
name: page-generator
description: Next.js App Router 페이지와 관련 파일을 생성합니다.
---

# Page Generator

## 역할

Next.js App Router 규칙에 맞는 페이지 세트를 생성합니다.

## 생성 파일

주어진 경로에 다음 파일을 생성합니다:

1. `page.tsx` — 메인 페이지 컴포넌트
   - Server Component 기본
   - metadata export 포함
   - Suspense 바운더리 적용

2. `loading.tsx` — 스켈레톤 UI
   - shadcn/ui Skeleton 컴포넌트 활용

3. `error.tsx` — 에러 바운더리
   - "use client" 지시어
   - 재시도 버튼 포함

## 규칙

- 라우트 그룹 `()` 활용
- 동적 라우트 `[param]` 지원
- 레이아웃 필요 시 `layout.tsx` 추가 제안
- Tailwind CSS + 다크모드 적용
