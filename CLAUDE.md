# dev-nexus

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui

## Commands

```bash
pnpm dev          # 개발 서버
pnpm typecheck    # 타입체크
pnpm lint         # 린트
pnpm build        # 프로덕션 빌드
```

변경 후: typecheck → lint → build 순서 실행

## Global Override (전역 규칙 예외)

- **Server Component에서 데이터 직접 fetch 허용** — 전역 "컴포넌트는 데이터를 직접 fetch하지 않는다" 규칙은 Next.js App Router에 적용하지 않음. Server Component에서 `async/await`로 직접 데이터 페칭이 올바른 패턴.
- **다크모드 토글** — 전역 규칙 적용. 디폴트 다크모드 + 라이트/다크 토글 버튼 포함.

## Project-Specific Rules (전역에 없는 규칙만)

- `components/ui/` 직접 수정 금지 (래핑하여 확장)
- 컴포넌트 파일명: kebab-case, named export
- `cn()` 유틸로 조건부 클래스 결합
- 커스텀 색상은 CSS 변수로 정의 (`globals.css`)
- Route Handler는 `app/api/` 하위에 배치
- 각 라우트: `page.tsx` + `loading.tsx` + `error.tsx` 세트로 구성

## Architecture

@.claude/docs/architecture.md

## Testing

@.claude/docs/testing.md
