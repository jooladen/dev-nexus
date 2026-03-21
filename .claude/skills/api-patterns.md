---
name: api-patterns
description: Next.js Route Handler API 패턴. Use when creating or modifying API routes, handling requests, or validating data.
---

# API Patterns

## Route Handler 구조

```tsx
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const result = createUserSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 }
    )
  }

  // 비즈니스 로직
  const user = await createUser(result.data)

  return NextResponse.json(user, { status: 201 })
}
```

## 규칙

- 모든 입력은 Zod 스키마로 검증
- 에러 응답: `{ error: string | object }` 형태
- HTTP 상태 코드 정확히 사용 (200, 201, 400, 401, 404, 500)
- 비즈니스 로직은 `lib/` 함수로 분리
- 환경변수로 시크릿 관리 (`process.env.API_KEY`)

## 파일 구조

```
src/app/api/
├── users/
│   ├── route.ts          # GET (목록), POST (생성)
│   └── [id]/
│       └── route.ts      # GET (상세), PATCH (수정), DELETE (삭제)
└── auth/
    ├── login/route.ts
    └── register/route.ts
```
