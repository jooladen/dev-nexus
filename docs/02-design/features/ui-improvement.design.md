# Design: ui-improvement

> Plan 참조: `docs/01-plan/features/ui-improvement.plan.md`

## Executive Summary

| Feature | ui-improvement |
|---------|----------------|
| Started | 2026-03-22 |
| Phase | Check ✅ (100%) |
| Files Changed | 3 modified, 2 new |
| Components | 2 new (TechFilter, ProjectGrid) |

---

## 1. Component Architecture (컴포넌트 구조)

### 1.1 변경 후 컴포넌트 트리

```
src/app/page.tsx (Server Component — 유지)
├── ThemeToggle (Client — 기존 유지)
├── <header> (서버 렌더링 — 헤더 보강)
│   ├── "VIBE CODING LAB"
│   ├── "Dev-Nexus"
│   ├── 소개 텍스트 + 프로젝트 수
│   └── 기술 통계 배지
├── ProjectGrid (Client Component — 신규)
│   ├── TechFilter (Client Component — 신규)
│   │   └── 필터 버튼들 (동적 생성)
│   └── ProjectCard[] (기존 — 수정)
│       ├── 제목 + GitHub 링크
│       ├── motivation (line-clamp-2)
│       ├── outcome (line-clamp-1)
│       ├── features 태그 (outline pill)
│       └── techStack 태그 (filled pill + mono)
└── <footer> (서버 렌더링 — 보강)
    └── GitHub + Email 링크
```

### 1.2 신규 컴포넌트 상세

#### `src/components/project-grid.tsx` (Client Component)

```typescript
"use client";

type ProjectGridProps = {
  projects: Project[];
};

// 상태:
// - selectedTechs: Set<string> — 선택된 기술 스택

// 동작:
// 1. projects에서 고유 기술 스택 추출 (useMemo) → TechFilter에 전달
// 2. selectedTechs로 projects 필터링 (useMemo)
// 3. 필터링 결과 0건이면 "일치하는 프로젝트가 없습니다" + 초기화 버튼 표시
// Note: showAll/모바일 접기 기능은 Item 8 보류로 제외
```

#### `src/components/tech-filter.tsx` (Client Component)

```typescript
"use client";

type TechFilterProps = {
  allTechs: string[];          // 고유 기술 목록 (등장 횟수 내림차순)
  selectedTechs: Set<string>;  // 현재 선택된 기술
  onToggle: (tech: string) => void;
  onReset: () => void;
  resultCount: number;         // 필터링된 프로젝트 수
  totalCount: number;          // 전체 프로젝트 수
};

// 표시할 기술 스택 선정 기준:
// - 2개 이상 프로젝트에서 사용된 기술만 표시 (약 20개)
// - 1개에서만 사용된 마이너 기술은 숨김
// - 정렬: 등장 횟수 내림차순
```

**필터 대상 기술 (2개 이상 프로젝트에서 사용):**

| 기술 | 프로젝트 수 |
|------|-------------|
| React | 15 |
| TypeScript | 14 |
| Docker | 10 |
| PostgreSQL | 9 |
| Node.js | 8 |
| Python | 4 |
| Tailwind | 6 |
| Redis | 6 |
| Vite | 5 |
| Next.js | 4 |
| Go | 3 |
| Supabase | 3 |
| Vercel | 3 |
| MongoDB | 3 |
| Rust | 2 |
| FastAPI | 2 |
| OpenAI | 2 |
| PWA | 2 |
| WebSocket | 2 |
| Socket.io | 2 |

---

## 2. Detailed Design (상세 설계)

### 2.1 Item 1: 카드 높이 정규화

**파일**: `src/components/project-card.tsx`

**변경 내용**:
```
현재: 모든 텍스트가 자연 높이로 렌더링 → 카드마다 높이 다름
변경: motivation, outcome에 line-clamp 적용 + features 영역 고정 높이
```

**구체적 CSS 변경**:
- motivation `<p>`: `line-clamp-2` 추가 (최대 2줄)
- outcome `<p>`: `line-clamp-1` 추가 (최대 1줄 — 이미 짧은 문장들)
- features `<div>`: `min-h-[52px]` 추가 (태그 1~2줄 보장)
- techStack `<div>`: 이미 `mt-auto`로 하단 고정 — 유지

**검증 포인트**: 가장 긴 motivation("고객 문의가 반복적이라..." 38자)과 가장 짧은 것("CSS 속성을 실시간으로..." 19자)이 2줄 clamp에서 자연스러운지 확인

### 2.2 Item 2: 기능/기술 태그 시각적 차별화

**파일**: `src/components/project-card.tsx`

**현재 스타일 비교**:
```
기능 태그:  border border-card-border px-2.5 py-0.5 text-xs text-muted
기술 태그:  bg-badge-bg px-2.5 py-0.5 text-xs font-medium text-badge-text
```

**변경 후**:
```
기능 태그:  (유지 — outline pill)
           border border-card-border px-2.5 py-0.5 text-xs text-muted

기술 태그:  (강화 — filled pill + mono + 좌측 도트 제거, 대신 배경 불투명도 높임)
           bg-badge-bg px-2.5 py-0.5 text-[11px] font-medium font-mono
           text-badge-text tracking-wide
```

**CSS 변수 변경** (`globals.css`):
```css
/* 기술 스택 배지 배경 불투명도 높임 */
:root {
  --badge-bg: rgba(29, 78, 216, 0.12);   /* 0.08 → 0.12 */
}
.dark {
  --badge-bg: rgba(56, 189, 248, 0.15);  /* 0.1 → 0.15 */
}
```

### 2.3 Item 3: 라이트 모드 대비 강화

**파일**: `src/app/globals.css`

**변경 내용**:
```css
:root {
  --card: rgba(255, 255, 255, 0.82);       /* 0.65 → 0.82 */
  --card-hover: rgba(255, 255, 255, 0.95); /* 0.85 → 0.95 */
}

/* 라이트 모드 기본 카드 그림자 추가 */
.glass {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
}

/* 다크모드에서는 기본 그림자 제거 */
.dark .glass {
  box-shadow: none;
}
```

### 2.4 Item 4: 기술 스택 필터

**파일**: `src/components/tech-filter.tsx` (신규), `src/components/project-grid.tsx` (신규)

**TechFilter 컴포넌트 스타일**:
```
컨테이너: mb-10 > flex flex-wrap items-center justify-center gap-2
기본 버튼: rounded-full border border-card-border bg-transparent
          px-3 py-1.5 text-xs font-medium text-muted
          transition-all duration-200 cursor-pointer
          hover:text-foreground hover:border-foreground/20
활성 버튼: bg-accent/20 text-accent border-accent/30
          (다크: bg-accent/15 text-accent border-accent/25)
리셋 버튼: text-xs text-muted underline underline-offset-2
          ml-2 hover:text-foreground transition-colors cursor-pointer
```

**ProjectGrid 필터링 로직**:
```typescript
const filteredProjects = selectedTechs.size === 0
  ? projects
  : projects.filter(p =>
      p.techStack.some(tech => selectedTechs.has(tech))
    );
```

**필터 결과 카운트 표시**: 필터 바 아래 중앙에 `"{N}/{M}개 프로젝트"` 표시 (필터 활성 시에만)

**빈 결과 UI**:
```
<div class="col-span-full py-20 text-center">
  <p class="text-muted">선택한 기술을 사용한 프로젝트가 없습니다.</p>
  <button onClick={onReset}>필터 초기화</button>
</div>
```

### 2.5 Item 5: 카드 호버 인터랙션 강화

**파일**: `src/app/globals.css`, `src/components/project-card.tsx`

**상단 accent 라인 (CSS `::before`)**:
```css
.glass {
  position: relative;
  overflow: hidden;
}

.glass::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width 0.4s ease;
  border-radius: 0 0 2px 2px;
}

.glass:hover::before {
  width: 60%;
}
```

**GitHub 링크 아이콘 호버**: 현재 `hover:text-foreground` → `hover:text-accent` 변경

### 2.6 Item 6: 헤더 보강

**파일**: `src/app/page.tsx`

**변경 내용**:
```
현재:
  VIBE CODING LAB
  Dev-Nexus
  만들고 싶은 걸 만들다 보니 여기까지. 30개 프로젝트, 각각의 이유와 인사이트.
  ─── (gradient divider)

변경 후:
  VIBE CODING LAB
  Dev-Nexus
  만들고 싶은 걸 만들다 보니 여기까지. 30개 프로젝트, 각각의 이유와 인사이트.
  ─── (gradient divider)
  [기술 통계 배지 행]
  "{techCount}+ Technologies · {N} Projects · Full-Stack"  (동적 계산)
```

**기술 통계 배지 스타일**:
```
<p> 태그: mt-4 text-xs text-muted
내용: "{techCount}+ Technologies · {projects.length} Projects · Full-Stack"
구분자: · (middot) — 인라인 텍스트, flex 컨테이너 아님
techCount: getTechCount() 함수로 전체 고유 기술 수 동적 계산
```

### 2.7 Item 7: 푸터 보강

**파일**: `src/app/page.tsx`

**변경 내용**:
```
현재:
  총 30개의 프로젝트 · 계속 늘어나는 중

변경 후:
  총 30개의 프로젝트 · 계속 늘어나는 중
  [GitHub 아이콘] [Mail 아이콘]   ← 아이콘 링크 (Lucide)
```

**스타일**:
```
아이콘 컨테이너: mt-4 flex items-center justify-center gap-4
아이콘 링크: text-muted hover:text-foreground transition-colors p-2
아이콘 크기: h-4 w-4
```

**데이터**: GitHub URL, 이메일은 하드코딩 (정적 사이트이므로)

### 2.8 Item 8: 모바일 접기/펼치기

**파일**: `src/components/project-grid.tsx`

**동작**:
```
- 초기 표시 개수: INITIAL_SHOW_COUNT = 6
- md 이상: 항상 전체 표시 (CSS `hidden md:block`이 아닌 JS로 분기)
- md 미만 + !showAll: 처음 6개만 렌더링
- "더 보기" 버튼: 나머지 개수 표시 ("24개 더 보기")
- showAll 토글 후: 전체 표시 + "접기" 버튼
```

**"더 보기" 버튼 스타일**:
```
컨테이너: col-span-full flex justify-center py-4 md:hidden
버튼: glass rounded-full px-6 py-2.5 text-sm font-medium
      text-muted hover:text-foreground transition-all
```

**반응형 감지**: `window.matchMedia` 대신 CSS `md:hidden` 클래스로 버튼 자체를 숨김 → JS 분기 불필요. 모바일에서도 전체 렌더링하되 버튼으로 `hidden` 토글.

수정: 성능을 위해 모바일에서는 실제로 6개만 렌더링 → `useMediaQuery` 없이, 초기에는 6개만 렌더링 + "더 보기" 버튼을 `md:hidden`으로 처리. 데스크톱에서는 항상 전체 렌더링.

최종 접근:
```typescript
// 간단하게: showAll 상태만 관리
// "더 보기" 버튼은 md:hidden으로 데스크톱에서 숨김
// 데스크톱에서도 showAll=false일 때 6개만 보이지만,
// 버튼이 숨겨져 있어 접근 불가 → 초기값을 true로 세팅하는 것이 아닌,
// 렌더링 시 "md 이상에서는 전체"를 CSS가 아닌 JS로 처리

// 가장 단순한 방법: 항상 전체 렌더링 + CSS로 숨김
const displayedProjects = showAll
  ? filteredProjects
  : filteredProjects.slice(0, INITIAL_SHOW_COUNT);

// "더 보기" 버튼만 md:hidden으로 숨김
// 데스크톱 사용자는 showAll=false여도 전체를 보게 됨? → No, slice(0,6)

// 최종: useEffect로 md 이상이면 showAll=true 강제 세팅
```

**최종 결정**: 복잡도 대비 효과가 낮으므로 **P3 구현 보류**. 30개 카드 모바일 스크롤은 실제 사용에서 큰 문제가 아닌 수준. 나중에 별도 feature로 진행 가능.

→ **Item 8은 구현 범위에서 제외. P0~P2 (Item 1~7)만 구현.**

---

## 3. File Change Summary (파일 변경 요약)

| # | 파일 | 변경 유형 | 변경 내용 |
|---|------|-----------|-----------|
| 1 | `src/app/globals.css` | 수정 | 라이트모드 카드 불투명도, 배지 배경 강화, glass 기본 그림자, 호버 상단 라인 |
| 2 | `src/components/project-card.tsx` | 수정 | line-clamp, 태그 스타일 차별화, GitHub 링크 호버 색상 |
| 3 | `src/components/tech-filter.tsx` | 신규 | 기술 스택 필터 바 컴포넌트 |
| 4 | `src/components/project-grid.tsx` | 신규 | Client Component 래퍼 (필터 상태 + 그리드) |
| 5 | `src/app/page.tsx` | 수정 | ProjectGrid 사용, 헤더 통계 배지, 푸터 소셜 링크 |

---

## 4. Implementation Order (구현 순서)

| Step | Item | 파일 | 이유 |
|------|------|------|------|
| 1 | 라이트 모드 대비 강화 | globals.css | CSS만 변경, 다른 것에 영향 없음 |
| 2 | 호버 상단 라인 | globals.css | 위 파일에 이어서 작업 |
| 3 | 카드 높이 정규화 | project-card.tsx | CSS 클래스 추가만 |
| 4 | 태그 차별화 | project-card.tsx | 위 파일에 이어서 작업 |
| 5 | GitHub 링크 호버 | project-card.tsx | 위 파일에 이어서 작업 |
| 6 | TechFilter 컴포넌트 | tech-filter.tsx (신규) | 독립 컴포넌트 먼저 |
| 7 | ProjectGrid 컴포넌트 | project-grid.tsx (신규) | TechFilter 사용 |
| 8 | page.tsx 구조 변경 | page.tsx | ProjectGrid 적용 + 헤더/푸터 보강 |

---

## 5. Data Flow (데이터 흐름)

```
page.tsx (Server Component)
  │
  ├── projects 데이터 import (정적)
  │
  ├── 헤더 렌더링 (projects.length, 기술 통계)
  │
  ├── <ProjectGrid projects={projects} />
  │   │
  │   ├── useMemo: 고유 기술 목록 추출 + 등장 횟수 정렬
  │   │   → allTechs: string[]
  │   │
  │   ├── useState: selectedTechs: Set<string>
  │   │
  │   ├── useMemo: 필터링된 프로젝트 목록
  │   │   → filteredProjects: Project[]
  │   │
  │   ├── <TechFilter
  │   │     allTechs={allTechs}
  │   │     selectedTechs={selectedTechs}
  │   │     onToggle={handleToggle}
  │   │     onReset={handleReset}
  │   │     resultCount={filteredProjects.length}
  │   │     totalCount={projects.length}
  │   │   />
  │   │
  │   └── filteredProjects.map(p => <ProjectCard />)
  │
  └── 푸터 렌더링
```

---

## 6. Acceptance Criteria (인수 기준)

### 필수 (P0-P1)
- [x] 다크/라이트 모드에서 카드 높이가 행 내에서 동일
- [x] 기능 태그(outline)와 기술 태그(filled+mono)가 시각적으로 즉시 구분됨
- [x] 라이트 모드에서 카드 경계가 명확 (그림자 + 높은 불투명도)
- [x] 기술 스택 필터로 프로젝트 필터링 동작
- [x] 필터 다중 선택(OR) + 리셋 동작
- [x] 카드 호버 시 상단에 accent 라인 애니메이션
- [x] GitHub 아이콘 호버 시 accent 색상

### 권장 (P2)
- [x] 헤더에 기술 통계 배지 표시
- [x] 푸터에 GitHub/Email 아이콘 링크

### 제외
- [ ] ~~모바일 접기/펼치기~~ → 복잡도 대비 효과 낮아 보류

### 기술 검증
- [x] `pnpm typecheck` 에러 0건
- [x] `pnpm build` 에러 0건
- [x] Server Component(page.tsx)에서 Client Component 정상 import
- [x] 필터 상태 변경 시 리렌더링 성능 문제 없음 (30개 카드)
