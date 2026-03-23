# Vercel DB Migration Design Document

> **Summary**: Mock 데이터 → Vercel Postgres + Drizzle ORM 전환 상세 설계
>
> **Project**: Dev-Nexus
> **Date**: 2026-03-22
> **Status**: Draft
> **Plan Reference**: `docs/01-plan/features/vercel-db-migration.plan.md`

---

## 1. Architecture Overview

### 1.1 Before / After

```
[Before]
page.tsx → import { projects } from "@/data/projects"  (정적 TS 배열)

[After]
page.tsx → import { db } from "@/db"
        → import { projects } from "@/db/schema"
        → const data = await db.select().from(projects)  (DB 조회)
```

### 1.2 의존성 방향

```
app/page.tsx → db/index.ts → @vercel/postgres (외부)
             → db/schema.ts → drizzle-orm/pg-core
components/*  → types/project.ts (변경 없음)
```

---

## 2. File Changes

### 2.1 신규 파일

| File | Purpose |
|------|---------|
| `src/db/schema.ts` | Drizzle 테이블 스키마 정의 |
| `src/db/index.ts` | DB 연결 인스턴스 |
| `src/db/seed.ts` | 기존 30개 데이터 시드 스크립트 |
| `drizzle.config.ts` | Drizzle Kit 설정 |
| `.env.local` | DB 접속 환경변수 (gitignore) |
| `.env.example` | 환경변수 템플릿 (커밋) |

### 2.2 수정 파일

| File | Change |
|------|--------|
| `src/app/page.tsx` | 정적 import → DB 조회 (async Server Component) |
| `src/types/project.ts` | DB 스키마에서 타입 추론하도록 변경 |
| `package.json` | 의존성 추가 + seed 스크립트 |
| `.gitignore` | `.env.local` 추가 확인 |

### 2.3 삭제 파일

| File | Reason |
|------|--------|
| `src/data/projects.ts` | DB로 대체됨 |
| `src/data/` (디렉토리) | 빈 디렉토리 제거 |

---

## 3. Detailed Design

### 3.1 DB Schema (`src/db/schema.ts`)

```ts
import { pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  motivation: text("motivation").notNull(),
  outcome: text("outcome").notNull(),
  features: jsonb("features").$type<string[]>().notNull(),
  techStack: jsonb("tech_stack").$type<string[]>().notNull(),
  githubUrl: text("github_url").notNull(),
});
```

**설계 결정**:
- `features`, `techStack`는 `jsonb` 타입 — PostgreSQL 네이티브 JSON 지원으로 별도 조인 테이블 불필요
- 컬럼명은 snake_case (`tech_stack`, `github_url`) — DB 관례 준수
- `serial` PK — 자동 증가, 기존 mock 데이터의 id 체계와 호환

### 3.2 DB Connection (`src/db/index.ts`)

```ts
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";

export const db = drizzle({ client: sql, schema });
```

**설계 결정**:
- `@vercel/postgres`의 `sql` 클라이언트 사용 — Vercel 서버리스 환경 최적화
- `schema` 전달 — 관계형 쿼리 API 활성화

### 3.3 Type 변경 (`src/types/project.ts`)

```ts
import type { projects } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type Project = InferSelectModel<typeof projects>;
```

**설계 결정**:
- 수동 타입 대신 Drizzle `InferSelectModel` 사용 — 스키마 변경 시 타입 자동 동기화
- 기존 `Project` 타입명 유지 — 컴포넌트 수정 없음

### 3.4 Page 수정 (`src/app/page.tsx`)

```ts
// Before
import { projects } from "@/data/projects";

// After
import { db } from "@/db";
import { projects } from "@/db/schema";

export default async function Home() {
  const allProjects = await db.select().from(projects);
  // ... 이하 allProjects 사용
}
```

**설계 결정**:
- `async` Server Component — Next.js App Router 패턴 (Global Override 적용)
- `db.select().from(projects)` — 전체 조회 (30개 소규모, 페이징 불필요)
- 변수명 `projects` → `allProjects` — schema export와 이름 충돌 방지

### 3.5 Drizzle Config (`drizzle.config.ts`)

```ts
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

### 3.6 Seed Script (`src/db/seed.ts`)

```ts
import { config } from "dotenv";
config({ path: ".env.local" });

import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { projects } from "./schema";

const seedData = [
  // 기존 src/data/projects.ts의 30개 데이터 그대로 이동
  // camelCase → snake_case 매핑은 Drizzle가 자동 처리
];

async function main() {
  const db = drizzle({ client: sql });
  await db.delete(projects); // 기존 데이터 초기화
  await db.insert(projects).values(seedData);
  console.log("Seeded 30 projects");
  process.exit(0);
}

main();
```

### 3.7 환경변수

```env
# .env.example
POSTGRES_URL=postgresql://...
```

```env
# .env.local (gitignore됨)
POSTGRES_URL=postgresql://user:pass@host/dbname?sslmode=require
```

### 3.8 Package 변경

```json
{
  "dependencies": {
    "@vercel/postgres": "^0.10.0",
    "drizzle-orm": "^0.38.0"
  },
  "devDependencies": {
    "dotenv": "^16.4.0",
    "drizzle-kit": "^0.30.0"
  },
  "scripts": {
    "db:push": "drizzle-kit push",
    "db:seed": "npx tsx src/db/seed.ts",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

## 4. Component Impact Analysis

| Component | Change Required | Detail |
|-----------|:-:|--------|
| `project-card.tsx` | No | `Project` 타입 그대로 사용 |
| `project-grid.tsx` | No | `projects: Project[]` prop 그대로 |
| `tech-filter.tsx` | No | prop 변경 없음 |
| `theme-toggle.tsx` | No | 데이터 무관 |
| `page.tsx` | **Yes** | import 경로 + async 추가 |
| `types/project.ts` | **Yes** | 수동 타입 → InferSelectModel |

---

## 5. Implementation Order

| Step | Task | Files | Depends On |
|:----:|------|-------|:----------:|
| 1 | 패키지 설치 | `package.json` | - |
| 2 | 환경변수 설정 | `.env.local`, `.env.example`, `.gitignore` | - |
| 3 | DB 스키마 정의 | `src/db/schema.ts` | Step 1 |
| 4 | DB 연결 모듈 | `src/db/index.ts` | Step 3 |
| 5 | Drizzle 설정 | `drizzle.config.ts` | Step 3 |
| 6 | 타입 변경 | `src/types/project.ts` | Step 3 |
| 7 | 마이그레이션 실행 | `pnpm db:push` | Step 2, 5 |
| 8 | Seed 스크립트 작성 + 실행 | `src/db/seed.ts` | Step 7 |
| 9 | page.tsx 수정 | `src/app/page.tsx` | Step 4, 6 |
| 10 | 정적 데이터 삭제 | `src/data/` 제거 | Step 9 |
| 11 | 빌드 검증 | `pnpm typecheck && pnpm build` | Step 10 |

---

## 6. Error Handling

| Scenario | Handling |
|----------|----------|
| DB 연결 실패 | Next.js `error.tsx` 자동 캐치 |
| 환경변수 미설정 | 빌드 시 에러 (명시적 실패) |
| 빈 테이블 조회 | 빈 배열 반환 → "프로젝트가 없습니다" UI |

---

## 7. Testing Strategy

| Test | Method | Criteria |
|------|--------|----------|
| 스키마 정합성 | `pnpm db:push` 성공 | 에러 0 |
| 데이터 시드 | `pnpm db:seed` 후 확인 | 30개 삽입 |
| UI 동작 | dev 서버에서 확인 | 기존과 동일한 렌더링 |
| 빌드 | `pnpm typecheck && pnpm build` | 에러 0 |
| 필터 | 기술 스택 필터 클릭 | 정상 필터링 |

---

## Version History

| Version | Date       | Changes       | Author |
| ------- | ---------- | ------------- | ------ |
| 0.1     | 2026-03-22 | Initial draft | Claude |
