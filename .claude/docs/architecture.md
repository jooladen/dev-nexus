# Architecture

```
src/
├── app/              # App Router (pages, layouts, API routes)
│   ├── (auth)/       # 인증 라우트 그룹
│   ├── (main)/       # 메인 라우트 그룹
│   ├── api/          # Route Handlers
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home
├── components/
│   ├── ui/           # shadcn/ui (수정 금지)
│   └── [feature]/    # 기능별 커스텀 컴포넌트
├── lib/              # 유틸리티 (cn(), API 클라이언트 등)
├── hooks/            # 커스텀 React hooks
├── types/            # 공유 타입 정의
└── styles/           # 글로벌 스타일, CSS 변수
```

## 의존성 방향

`app/` → `components/` → `hooks/` → `lib/` → `types/` (역방향 금지)

## 라우팅 규칙

- 각 라우트: `page.tsx` + `loading.tsx` + `error.tsx`
- 레이아웃 공유 시 `layout.tsx` 추가
- 동적 라우트: `[param]/page.tsx`
- 라우트 그룹: `(group)/` 으로 레이아웃 분리
