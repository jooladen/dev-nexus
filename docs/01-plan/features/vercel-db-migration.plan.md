# Vercel DB Migration Planning Document

> **Summary**: Mock 데이터(src/data/projects.ts)를 Vercel Postgres로 전환하고, 불필요한 정적 데이터 파일 삭제
>
> **Project**: Dev-Nexus
> **Date**: 2026-03-22
> **Status**: Draft

---

## Executive Summary

| Perspective            | Content                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| **Problem**            | 30개 프로젝트가 하드코딩된 TS 파일에 있어 추가/수정 시 코드 배포가 필요 |
| **Solution**           | Vercel Postgres + Drizzle ORM으로 전환하여 데이터를 DB에서 관리 |
| **Function/UX Effect** | 사용자 경험 변화 없음. Server Component에서 DB 직접 조회로 동일한 카드 렌더링 |
| **Core Value**         | 데이터와 코드 분리 → 향후 관리자 기능·API 확장의 기반 마련 |

---

## 1. Overview

### 1.1 Purpose

정적 목업 데이터(`src/data/projects.ts`)를 Vercel Postgres(Neon)로 전환. 기존 UI/UX는 유지하면서 데이터 소스만 DB로 변경.

### 1.2 Background

- 현재 30개 프로젝트가 TypeScript 배열로 하드코딩됨
- 프로젝트 추가/수정마다 코드 변경 + 재배포 필요
- 향후 CRUD·관리자 페이지 등 확장을 위해 DB 기반이 필수

---

## 2. Scope

### 2.1 In Scope

- [ ] Vercel Postgres 연결 설정 (Drizzle ORM)
- [ ] DB 스키마 정의 (projects 테이블 + 배열 필드 처리)
- [ ] Seed 스크립트 작성 (기존 30개 데이터 → DB 삽입)
- [ ] `src/app/page.tsx` DB 조회로 전환
- [ ] `src/data/projects.ts` 삭제
- [ ] 환경변수 설정 (POSTGRES_URL 등)

### 2.2 Out of Scope

- 관리자 CRUD API/UI (이번 범위 아님)
- 인증/권한 (이번 범위 아님)
- 프로젝트 상세 페이지 (이번 범위 아님)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID    | Requirement                                          | Priority | Status  |
| ----- | ---------------------------------------------------- | -------- | ------- |
| FR-01 | Vercel Postgres 연결 + Drizzle ORM 설정              | High     | Pending |
| FR-02 | projects 테이블 스키마 (features, techStack는 JSON)  | High     | Pending |
| FR-03 | 기존 30개 mock 데이터 seed 스크립트                  | High     | Pending |
| FR-04 | page.tsx에서 DB 조회 (Server Component async)        | High     | Pending |
| FR-05 | src/data/projects.ts 삭제                            | Medium   | Pending |
| FR-06 | 기존 UI/필터/다크모드 동작 유지                      | High     | Pending |

### 3.2 Non-Functional Requirements

| Category    | Criteria                     | Measurement Method     |
| ----------- | ---------------------------- | ---------------------- |
| Performance | 기존 대비 LCP 차이 < 500ms  | Lighthouse             |
| Reliability | DB 연결 실패 시 에러 페이지  | error.tsx              |
| Security    | DB 접속 정보 환경변수로 관리 | .env.local (gitignore) |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] DB에서 30개 프로젝트 조회하여 기존과 동일하게 렌더링
- [ ] 기술 스택 필터 정상 작동
- [ ] 다크/라이트 모드 정상
- [ ] `src/data/projects.ts` 삭제됨
- [ ] typecheck + build 에러 0
- [ ] seed 스크립트로 데이터 재현 가능

---

## 5. Architecture Considerations

### 5.1 Project Level

| Level       | Selected |
| ----------- | :------: |
| **Dynamic** |    ✅    |

DB 연동으로 Dynamic 레벨로 승격.

### 5.2 Key Decisions

| Decision    | Selected                      | Rationale                                 |
| ----------- | ----------------------------- | ----------------------------------------- |
| Database    | Vercel Postgres (Neon)        | 사용자 선택, Vercel 통합 우수             |
| ORM         | Drizzle ORM                   | 타입 안전, 경량, Vercel Postgres 공식 지원 |
| 배열 필드   | JSON 컬럼 (features, techStack) | PostgreSQL jsonb로 배열 저장            |
| Data Source | Server Component에서 직접 조회 | Next.js App Router 패턴 (Global Override) |

### 5.3 Tech Stack Changes

| Package              | Purpose              | Action  |
| -------------------- | -------------------- | ------- |
| `drizzle-orm`        | ORM                  | 추가    |
| `drizzle-kit`        | 마이그레이션 도구    | 추가    |
| `@vercel/postgres`   | Vercel Postgres 드라이버 | 추가 |
| `dotenv`             | 로컬 환경변수 로드   | 추가    |
| `src/data/projects.ts` | 정적 목업 데이터  | **삭제** |

---

## 6. Data Schema

### 6.1 기존 (TypeScript)

```ts
type Project = {
  id: number;
  title: string;
  motivation: string;
  outcome: string;
  features: string[];
  techStack: string[];
  githubUrl: string;
};
```

### 6.2 변경 후 (Drizzle Schema)

```ts
// src/db/schema.ts
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

### 6.3 파일 구조 변경

```
src/
├── db/
│   ├── index.ts        # DB 연결 (drizzle + @vercel/postgres)
│   ├── schema.ts       # 테이블 스키마
│   └── seed.ts         # 시드 스크립트
├── data/
│   └── projects.ts     # ← 삭제 예정
```

---

## 7. Implementation Order

1. **패키지 설치**: drizzle-orm, drizzle-kit, @vercel/postgres, dotenv
2. **환경변수 설정**: `.env.local` + `.env.example` 작성
3. **DB 스키마 정의**: `src/db/schema.ts`
4. **DB 연결**: `src/db/index.ts`
5. **Drizzle 설정**: `drizzle.config.ts`
6. **마이그레이션 실행**: `drizzle-kit push`
7. **Seed 스크립트**: 기존 30개 데이터 삽입
8. **page.tsx 수정**: import 경로를 DB 조회로 변경
9. **정적 데이터 삭제**: `src/data/projects.ts` 제거
10. **검증**: typecheck + build + UI 확인

---

## 8. Risk & Mitigation

| Risk                        | Impact | Mitigation                        |
| --------------------------- | ------ | --------------------------------- |
| Vercel Postgres 미설정 시 빌드 실패 | High | 환경변수 없으면 명확한 에러 메시지 |
| 배열→JSON 변환 시 타입 불일치 | Medium | Drizzle jsonb $type으로 타입 보장 |
| Cold start로 첫 요청 느림   | Low    | Neon serverless 드라이버 사용      |

---

## 9. Next Steps

1. [ ] Design 문서 작성
2. [ ] 구현
3. [ ] Gap 분석
4. [ ] Report 완료

---

## Version History

| Version | Date       | Changes       | Author |
| ------- | ---------- | ------------- | ------ |
| 0.1     | 2026-03-22 | Initial draft | Claude |
