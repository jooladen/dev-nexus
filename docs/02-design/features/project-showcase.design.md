# Project Showcase Design Document

> **Summary**: 20년차 개발자의 50개 프로젝트를 Glassmorphism 카드+그리드로 전시하는 포트폴리오 메인 페이지
>
> **Project**: Dev-Nexus
> **Version**: 0.1.0
> **Author**: Claude
> **Date**: 2026-03-21
> **Status**: Draft
> **Planning Doc**: [project-showcase.plan.md](../../01-plan/features/project-showcase.plan.md)

---

## 1. Overview

### 1.1 Design Goals

- 50개 프로젝트 데이터를 카드형(10개) + 그리드형(10개)으로 시각적 계층 구분하여 표시
- Glassmorphism + 다크 테마(디폴트) 기반 세련된 디자인 구현
- Server Component 기반 정적 렌더링으로 LCP < 2.5s 달성
- 모바일~데스크톱 반응형 레이아웃

### 1.2 Design Principles

- **정적 우선**: 모든 컴포넌트를 Server Component로 유지 (클라이언트 JS 최소화)
- **시각적 계층**: Featured(카드형)과 More(그리드형)의 명확한 정보 밀도 차이
- **일관된 스타일**: CSS 변수 기반 테마로 글래스모피즘 효과 통일

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────┐
│  app/page.tsx (Server Component)                │
│  ├── Hero Section (인라인)                      │
│  ├── Featured Projects                          │
│  │   └── ProjectCard x10 (Server Component)     │
│  ├── More Projects                              │
│  │   └── ProjectGrid (Server Component)         │
│  └── Footer (인라인)                            │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐    ┌──────────────────┐
│ data/projects.ts│    │ types/project.ts  │
│ (50개 mock)     │    │ (Project 타입)    │
└─────────────────┘    └──────────────────┘
```

### 2.2 Data Flow

```
projects.ts (정적 배열) → page.tsx (slice) → ProjectCard / ProjectGrid (렌더링)
```

- API 호출 없음 — 빌드 타임 정적 import
- `projects.slice(0, 10)` → Featured Cards
- `projects.slice(10, 20)` → Grid Items

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| `page.tsx` | `data/projects.ts`, `ProjectCard`, `ProjectGrid` | 데이터 주입 + 레이아웃 |
| `ProjectCard` | `types/project.ts`, `lib/utils.ts` | 개별 카드 렌더링 |
| `ProjectGrid` | `types/project.ts`, `lib/utils.ts` | 그리드 리스트 렌더링 |
| `lib/utils.ts` | `clsx`, `tailwind-merge` | 조건부 클래스 결합 |

---

## 3. Data Model

### 3.1 Entity Definition

```typescript
const PROJECT_STATUS = {
  completed: "completed",
  "in-progress": "in-progress",
  maintained: "maintained",
  archived: "archived",
} as const;

type ProjectStatus = keyof typeof PROJECT_STATUS;

type Project = {
  id: number;
  title: string;        // 프로젝트명 (영문)
  description: string;  // 설명 (한국어, 2-3문장)
  techStack: string[];  // 기술 스택 (5개)
  status: ProjectStatus;
  githubUrl: string;    // GitHub 레포 URL
  insight: string;      // 기술 인사이트 (한국어, 1문장)
};
```

### 3.2 상태별 스타일 매핑

| Status | Label | Color | Dot Class |
|--------|-------|-------|-----------|
| `completed` | 완료 | Emerald | `bg-emerald-500` |
| `in-progress` | 진행중 | Yellow | `bg-yellow-500` |
| `maintained` | 유지보수 | Blue | `bg-blue-500` |
| `archived` | 아카이브 | Gray | `bg-gray-500` |

---

## 4. UI/UX Design

### 4.1 Screen Layout

```
┌────────────────────────────────────────────────────────┐
│                    Hero Section                         │
│  "20 Years of Engineering"                             │
│  "Dev-Nexus" (H1, 5xl/6xl)                            │
│  tagline + gradient divider                            │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Featured Projects (H2)                                │
│  ┌──────┐ ┌──────┐ ┌──────┐                           │
│  │ Card │ │ Card │ │ Card │  ← Glassmorphism           │
│  │  #1  │ │  #2  │ │  #3  │  ← hover: glow + lift     │
│  └──────┘ └──────┘ └──────┘  ← insight on hover       │
│  (3열 lg / 2열 md / 1열 mobile)                        │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  More Projects (H2)                                    │
│  ┌────┐┌────┐┌────┐┌────┐┌────┐                       │
│  │Grid││Grid││Grid││Grid││Grid│  ← 컴팩트 형태        │
│  └────┘└────┘└────┘└────┘└────┘  ← 5열 lg / 2열 sm    │
│  (tech 3개 + "+N more")                                │
│                                                        │
├────────────────────────────────────────────────────────┤
│  Footer: "총 50개 프로젝트 · 2005 — 2026"             │
└────────────────────────────────────────────────────────┘
```

### 4.2 Glassmorphism 시스템

```css
/* 기본 Glass */
background: rgba(15, 23, 42, 0.6);
backdrop-filter: blur(20px);
border: 1px solid rgba(100, 116, 139, 0.2);

/* Hover Glass */
background: rgba(30, 41, 59, 0.8);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 60px rgba(59, 130, 246, 0.15);
```

### 4.3 Theme Toggle 설계

- **컴포넌트**: `ThemeToggle` (`"use client"` — 클릭 이벤트 필요)
- **디폴트**: 다크모드
- **구현 방식**: `<html>` 태그의 `class="dark"` 토글 + `localStorage` 저장
- **위치**: 페이지 우상단 고정 (Hero 섹션 내 또는 헤더)
- **아이콘**: Sun(라이트) / Moon(다크) 전환

```
┌─────────────────────────────────────┐
│                          [🌙/☀️]    │  ← 우상단 토글 버튼
│          Hero Section               │
│          ...                        │
```

### 4.4 Color System (CSS Variables)

**다크 테마 (디폴트)**:

| Variable | Value | Usage |
|----------|-------|-------|
| `--background` | `#0a0f1e` | 페이지 배경 (다크 네이비) |
| `--foreground` | `#e2e8f0` | 기본 텍스트 |
| `--card` | `rgba(15, 23, 42, 0.6)` | 카드 배경 |
| `--card-border` | `rgba(100, 116, 139, 0.2)` | 카드 테두리 |
| `--card-hover` | `rgba(30, 41, 59, 0.8)` | 카드 호버 배경 |
| `--accent` | `#3b82f6` | 주 강조색 (Blue) |
| `--accent-glow` | `rgba(59, 130, 246, 0.15)` | 호버 글로우 |
| `--badge-bg` | `rgba(59, 130, 246, 0.1)` | 배지 배경 |
| `--badge-text` | `#93c5fd` | 배지 텍스트 |
| `--muted` | `#64748b` | 보조 텍스트 |

**라이트 테마** (`.light` 또는 `dark:` 반전):

| Variable | Value | Usage |
|----------|-------|-------|
| `--background` | `#f8fafc` | 페이지 배경 (밝은 회색) |
| `--foreground` | `#0f172a` | 기본 텍스트 (다크) |
| `--card` | `rgba(255, 255, 255, 0.7)` | 카드 배경 |
| `--card-border` | `rgba(148, 163, 184, 0.3)` | 카드 테두리 |
| `--card-hover` | `rgba(255, 255, 255, 0.9)` | 카드 호버 배경 |
| `--muted` | `#94a3b8` | 보조 텍스트 |

### 4.4 Component List

| Component | File | Type | Responsibility |
|-----------|------|------|----------------|
| `HomePage` | `src/app/page.tsx` | Server | 데이터 슬라이스 + 전체 레이아웃 |
| `RootLayout` | `src/app/layout.tsx` | Server | HTML 메타데이터 + 폰트 |
| `ThemeToggle` | `src/components/theme-toggle.tsx` | Client | 다크/라이트 모드 토글 버튼 |
| `ProjectCard` | `src/components/project-card.tsx` | Server | Featured 프로젝트 카드 (Glassmorphism) |
| `ProjectGrid` | `src/components/project-grid.tsx` | Server | More 프로젝트 그리드 (컴팩트) |

### 4.5 ProjectCard 상세 설계

```
┌─────────────────────────────────┐
│ ● 완료        [GitHub ↗]       │  ← 상태 dot+label / 외부링크
│                                 │
│ CloudPay                        │  ← title (lg, semibold)
│ 대규모 결제 시스템...           │  ← description (line-clamp-2)
│                                 │
│ [Java] [Spring] [Kafka] ...     │  ← techStack badges (5개)
│                                 │
│ "분산 트랜잭션의 핵심은..."     │  ← insight (hover시 fade-in)
└─────────────────────────────────┘
```

**인터랙션**:
- 호버: `translateY(-4px)` + glow shadow
- 인사이트: `opacity-0 → opacity-100` (duration-500)
- GitHub 링크: 새 탭 열기 (`target="_blank"`, `rel="noopener noreferrer"`)

### 4.6 ProjectGrid 상세 설계

```
┌──────────────────────────────┐
│ ● CloudPay                [↗]│  ← 상태 dot + title + 링크
│ Java · Spring · Kafka  +2    │  ← tech 3개 + overflow count
└──────────────────────────────┘
```

**인터랙션**:
- 호버: `translateY(-2px)` + 외부링크 아이콘 페이드인
- 전체 영역 클릭 → GitHub 링크
- 5열(lg) / 2열(sm) / 1열(mobile) 그리드

### 4.7 반응형 브레이크포인트

| Breakpoint | Cards Grid | Grid Grid |
|------------|-----------|-----------|
| mobile (< 640px) | 1열 | 1열 |
| sm (640px) | 1열 | 2열 |
| md (768px) | 2열 | 2열 |
| lg (1024px) | 3열 | 5열 |

---

## 5. Security Considerations

- [x] 외부 링크에 `rel="noopener noreferrer"` 적용
- [x] 사용자 입력 없음 (정적 데이터만 사용)
- [x] API 엔드포인트 없음 (XSS/Injection 위험 없음)
- [N/A] 인증/인가 (Starter 레벨, Out of Scope)

---

## 6. Test Plan

### 6.1 Test Scope

| Type | Target | Tool |
|------|--------|------|
| 빌드 검증 | TypeScript 컴파일 + Next.js 빌드 | `pnpm typecheck && pnpm build` |
| 시각 검증 | 레이아웃 + Glassmorphism + 반응형 | `pnpm dev` + 브라우저 |

### 6.2 Test Cases

- [x] 50개 프로젝트 데이터 정상 로드
- [x] Featured 섹션에 10개 카드 렌더링
- [x] More 섹션에 10개 그리드 아이템 렌더링
- [x] Glassmorphism 호버 효과 작동
- [x] 모바일(375px)에서 1열 정상 표시
- [x] GitHub 링크 새 탭 열기 정상
- [x] 다크 테마 일관성 (밝은 영역 없음)
- [ ] 다크/라이트 토글 버튼 정상 작동
- [ ] 토글 상태 localStorage 유지

---

## 7. Clean Architecture

### 7.1 Layer Structure

| Layer | Responsibility | Location |
|-------|---------------|----------|
| **Presentation** | 페이지 레이아웃 + 컴포넌트 렌더링 | `src/app/`, `src/components/` |
| **Domain** | Project 타입 + 상태 상수 | `src/types/project.ts` |
| **Infrastructure** | 정적 데이터 제공 | `src/data/projects.ts` |

### 7.2 Dependency Rules

```
app/page.tsx ──→ components/* ──→ types/project.ts
                                        ↑
               data/projects.ts ────────┘
               lib/utils.ts (독립 유틸)
```

- `app/` → `components/` → `types/` (정방향만)
- `data/` → `types/` (타입 참조만)
- 역방향 의존 없음

---

## 8. Coding Convention

### 8.1 이 프로젝트 적용 규칙

| Item | Convention |
|------|-----------|
| 컴포넌트 파일명 | kebab-case (`project-card.tsx`) |
| 컴포넌트 export | named export (`export function ProjectCard`) |
| 타입 정의 | `type` 키워드 (not `interface`) |
| 열거형 | `as const` 객체 (`PROJECT_STATUS`) |
| 클래스 결합 | `cn()` 유틸 사용 |
| 상수 | `UPPER_SNAKE_CASE` (`STATUS_STYLES`, `FEATURED_COUNT`) |
| CSS | CSS 변수 → Tailwind `@theme inline` 등록 |
| 컴포넌트 타입 | Server Component 기본 (`"use client"` 미사용) |

---

## 9. Implementation Guide

### 9.1 현재 파일 구조

```
src/
├── app/
│   ├── layout.tsx          ✅ 존재
│   ├── page.tsx            ✅ 존재
│   └── globals.css         ✅ 존재
├── components/
│   ├── theme-toggle.tsx    ❌ 신규 (Client Component)
│   ├── project-card.tsx    ✅ 존재
│   └── project-grid.tsx    ✅ 존재
├── types/
│   └── project.ts          ✅ 존재
├── data/
│   └── projects.ts         ✅ 존재
└── lib/
    └── utils.ts            ✅ 존재
```

### 9.2 구현 상태

이미 MVP 구현이 완료된 상태. Plan 문서의 모든 FR이 구현됨:

| FR | 상태 | 구현 파일 |
|----|------|----------|
| FR-01: 50개 mock 데이터 | ✅ 완료 | `src/data/projects.ts` |
| FR-02: 카드형 (Glassmorphism) | ✅ 완료 | `src/components/project-card.tsx` |
| FR-03: 그리드형 (컴팩트) | ✅ 완료 | `src/components/project-grid.tsx` |
| FR-04: 기술 스택 배지 | ✅ 완료 | 각 컴포넌트 내 badge 렌더링 |
| FR-05: 프로젝트 상태 표시 | ✅ 완료 | STATUS_STYLES / STATUS_DOT 상수 |
| FR-06: GitHub 링크 | ✅ 완료 | ExternalLink 아이콘 + 새 탭 |
| FR-07: 다크모드 토글 | ❌ 미구현 | 토글 버튼 + localStorage 저장 필요 |

### 9.3 개선 가능 항목 (Out of Scope, 추후)

1. 프로젝트 상세 페이지 (`/projects/[id]`)
2. 검색/필터 기능 (기술 스택별, 상태별)
3. 애니메이션 강화 (scroll-driven, stagger)
4. SEO 최적화 (구조화 데이터, OG 이미지)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-21 | Initial draft — 현재 구현 기반 설계 문서화 | Claude |
| 0.2 | 2026-03-21 | awwwards 참조 제거, ThemeToggle 컴포넌트 추가, 라이트 테마 변수 추가 | Claude |
