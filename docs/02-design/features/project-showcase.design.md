# Project Showcase Design Document

> **Summary**: 바이브 코딩으로 만든 프로젝트들을 Deep Blue Glassmorphism 카드로 전시하는 포트폴리오
>
> **Project**: Dev-Nexus
> **Version**: 0.4.0
> **Author**: Claude
> **Date**: 2026-03-21
> **Status**: Final
> **Planning Doc**: [project-showcase.plan.md](../../01-plan/features/project-showcase.plan.md)

---

## 1. Overview

### 1.1 Design Goals

- 프로젝트를 카드형으로 전체 표시 (동적 개수)
- 각 카드에 "왜 만들었는지" + "결과" + "기능" + "기술 스택" 스토리텔링
- Deep Blue + Slate 톤의 Glassmorphism + 다크/라이트 테마 지원
- Server Component 기반 정적 렌더링

### 1.2 Design Principles

- **정적 우선**: Server Component 기본 (ThemeToggle만 Client)
- **스토리텔링**: 각 프로젝트의 동기와 결과를 전달
- **동적 카운트**: 프로젝트 수를 하드코딩하지 않고 `projects.length` 사용

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────┐
│  app/page.tsx (Server Component)                │
│  ├── ThemeToggle (Client, 우상단 fixed)         │
│  ├── Hero Section (인라인)                      │
│  ├── ProjectCard x{N} (Server Component)        │
│  └── Footer (인라인)                            │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐    ┌──────────────────┐
│ data/projects.ts│    │ types/project.ts  │
│ (30개 mock)     │    │ (Project 타입)    │
└─────────────────┘    └──────────────────┘
```

### 2.2 Data Flow

```
projects.ts (정적 배열) → page.tsx (전체 표시) → ProjectCard (렌더링)
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| `page.tsx` | `data/projects.ts`, `ProjectCard`, `ThemeToggle` | 데이터 주입 + 레이아웃 |
| `ProjectCard` | `types/project.ts`, `lib/utils.ts` | 개별 카드 렌더링 |
| `ThemeToggle` | `lib/utils.ts`, `lucide-react` | 다크/라이트 토글 |

---

## 3. Data Model

### 3.1 Entity Definition

```typescript
type Project = {
  id: number;
  title: string;        // 프로젝트명
  motivation: string;   // 왜 만들었는지
  outcome: string;      // 만들고 나서 결과
  features: string[];   // 주요 기능
  techStack: string[];  // 기술 스택
  githubUrl: string;    // GitHub URL
};
```

---

## 4. UI/UX Design

### 4.1 Screen Layout

```
┌────────────────────────────────────────────────────────┐
│                                          [Sun/Moon]    │
│                  Vibe Coding Lab                       │
│                    Dev-Nexus                            │
│  만들고 싶은 걸 만들다 보니 여기까지.                  │
│  {N}개 프로젝트, 각각의 이유와 인사이트.               │
├────────────────────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐                           │
│  │ Card │ │ Card │ │ Card │  ← 전체 프로젝트           │
│  └──────┘ └──────┘ └──────┘  ← 3열 lg / 2열 md / 1열  │
│  ...                                                   │
├────────────────────────────────────────────────────────┤
│  총 {N}개의 프로젝트 · 계속 늘어나는 중               │
└────────────────────────────────────────────────────────┘
```

### 4.2 ProjectCard 상세 설계

```
┌─────────────────────────────────┐
│ CloudPay           [GitHub ↗]   │  ← title + 외부링크
│                                 │
│ 매달 수동 정산하는 게 너무      │  ← motivation (왜 만들었는지)
│ 귀찮아서...                     │
│                                 │
│ 정산 시간 3시간 → 10분.         │  ← outcome (결과, 볼드)
│                                 │
│ [자동 정산] [실시간 알림] ...   │  ← features (테두리 태그)
│ ─────────────────────────────── │
│ [Java] [Spring] [Kafka] ...     │  ← techStack (채워진 배지)
└─────────────────────────────────┘
```

- **motivation**: `text-muted`, 일반 텍스트
- **outcome**: `text-foreground font-medium`, 강조
- **features**: 테두리만 있는 태그 (`border border-card-border`)
- **techStack**: 채워진 배지 (`bg-badge-bg text-badge-text`)
- techStack은 `mt-auto`로 카드 하단 고정

### 4.3 Theme Toggle

- 위치: `fixed top-6 right-6 z-50`
- 디폴트: 다크모드
- 저장: `localStorage("dev-nexus-theme")`
- 아이콘: Sun(다크) / Moon(라이트)

### 4.4 Color System

**다크 (디폴트) — Deep Blue + Slate**:

| Variable | Value |
|----------|-------|
| `--background` | `#0a1628` |
| `--foreground` | `#e2e8f0` |
| `--accent` | `#38bdf8` (Sky-400) |
| `--accent-glow` | `rgba(56, 189, 248, 0.15)` |
| `--card` | `rgba(15, 30, 56, 0.6)` |
| `--card-border` | `rgba(56, 97, 150, 0.2)` |
| `--card-hover` | `rgba(22, 42, 74, 0.8)` |
| `--badge-bg` | `rgba(56, 189, 248, 0.1)` |
| `--badge-text` | `#7dd3fc` (Sky-300) |
| `--muted` | `#64748b` |

**라이트 — Cool Slate**:

| Variable | Value |
|----------|-------|
| `--background` | `#e2e8f0` |
| `--foreground` | `#0f172a` |
| `--accent` | `#1d4ed8` (Blue-700) |
| `--accent-glow` | `rgba(29, 78, 216, 0.1)` |
| `--card` | `rgba(255, 255, 255, 0.65)` |
| `--card-border` | `rgba(71, 85, 105, 0.15)` |
| `--card-hover` | `rgba(255, 255, 255, 0.85)` |
| `--badge-bg` | `rgba(29, 78, 216, 0.08)` |
| `--badge-text` | `#1e40af` (Blue-800) |
| `--muted` | `#64748b` |

### 4.5 Component List

| Component | File | Type |
|-----------|------|------|
| `HomePage` | `src/app/page.tsx` | Server |
| `RootLayout` | `src/app/layout.tsx` | Server |
| `ThemeToggle` | `src/components/theme-toggle.tsx` | Client |
| `ProjectCard` | `src/components/project-card.tsx` | Server |

---

## 5. Implementation

### 5.1 파일 구조

```
src/
├── app/
│   ├── layout.tsx          ✅
│   ├── page.tsx            ✅
│   └── globals.css         ✅
├── components/
│   ├── theme-toggle.tsx    ✅
│   └── project-card.tsx    ✅
├── types/
│   └── project.ts          ✅
├── data/
│   └── projects.ts         ✅ (30개)
└── lib/
    └── utils.ts            ✅
```

### 5.2 FR 상태

| FR | Status |
|----|:------:|
| FR-01: mock 데이터 | DONE (30개) |
| FR-02: 카드형 Glassmorphism | DONE |
| FR-04: 기술 스택 배지 | DONE |
| FR-06: GitHub 링크 | DONE |
| FR-07: 다크모드 토글 | DONE |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-21 | Initial draft | Claude |
| 0.2 | 2026-03-21 | awwwards 제거, ThemeToggle 추가 | Claude |
| 0.3 | 2026-03-21 | status/Grid 삭제, Deep Blue 색상 | Claude |
| 0.4 | 2026-03-21 | 카드 구조 변경(motivation/outcome/features), 메시징 변경(Vibe Coding Lab), 30개 데이터 | Claude |
