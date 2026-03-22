# Plan: ui-improvement

## Executive Summary

| Feature | ui-improvement |
|---------|----------------|
| Started | 2026-03-22 |
| Author | AI + User |
| Status | Check ✅ (100%) |

### Value Delivered (4-Perspective)

| Perspective | Description |
|-------------|-------------|
| **Problem** | 30개 프로젝트 카드가 필터 없이 나열되어 탐색이 어렵고, 카드 높이 불균형/태그 구분 부재/라이트모드 대비 부족 등 UI 품질 문제가 있다 |
| **Solution** | 기술 스택 필터, 카드 레이아웃 정규화, 태그 시각적 차별화, 호버 인터랙션 강화, 헤더/푸터 보강으로 포트폴리오 사이트 완성도를 높인다 |
| **Function UX Effect** | 방문자가 관심 기술 스택으로 즉시 필터링하고, 카드 간 시각적 일관성으로 가독성이 향상되며, 호버/애니메이션으로 탐색이 즐거워진다 |
| **Core Value** | 이력서 대용 포트폴리오 사이트로서 첫인상과 사용성을 동시에 높여 방문자(채용 담당자/동료 개발자)에게 전문성을 효과적으로 전달한다 |

---

## 1. Background (배경)

### 1.1 현재 상태
- Dev-Nexus는 30개 프로젝트를 카드 그리드로 보여주는 포트폴리오 사이트
- Next.js 16 + Tailwind CSS v4 + Glassmorphism 디자인
- 다크/라이트 모드 지원, 반응형 3열(lg)/2열(md)/1열(sm) 그리드
- 프로젝트 데이터: `src/data/projects.ts`에 정적 배열로 관리

### 1.2 문제점 (화면 분석 결과)
1. **카드 높이 불균형**: 기능 태그 개수(3~5개), 설명 길이에 따라 같은 행 카드끼리 높이 편차 발생
2. **태그 구분 약함**: 기능 태그와 기술 스택 태그의 시각적 차이가 미미 (둘 다 pill 스타일)
3. **헤더 정보 부족**: 프로젝트 소유자에 대한 소개/기술 역량 요약 없음
4. **필터/검색 없음**: 30개를 스크롤로만 탐색 — 특정 기술 관심 방문자 이탈 우려
5. **호버 인터랙션 약함**: `hover:-translate-y-1`만 존재, 시각적 피드백 부족
6. **라이트 모드 대비 부족**: 카드 배경(`rgba(255,255,255,0.65)`)과 페이지 배경(`#e2e8f0`) 대비 약함
7. **푸터 빈약**: 연락처/소셜 링크 없음
8. **모바일 UX**: 30개 카드 1열 나열로 끝없는 스크롤

---

## 2. Goals (목표)

### 2.1 핵심 목표
- 포트폴리오 사이트로서 **첫인상 3초 내 전문성 전달**
- 방문자가 **관심 기술로 즉시 필터링** 가능
- 다크/라이트 모드 모두 **일관된 시각 품질** 보장

### 2.2 비목표 (Scope Out)
- 프로젝트 상세 페이지 (별도 feature로 진행)
- 백엔드/DB 연동 (정적 사이트 유지)
- 애니메이션 라이브러리 추가 (Framer Motion 등 — CSS만으로 해결)

---

## 3. Implementation Items (구현 항목)

### 3.1 P0 — 반드시 구현 (시각적 품질)

#### Item 1: 카드 높이 정규화
- **현재**: 카드 내용 길이에 따라 높이 제각각
- **변경**: 카드 내부 섹션별 line-clamp + min-height 지정
- **파일**: `src/components/project-card.tsx`
- **상세**:
  - motivation 영역: `line-clamp-2`로 2줄 제한
  - outcome 영역: `line-clamp-1`로 1줄 제한 (이미 짧은 문장들)
  - features 영역: `min-h-[52px]`로 태그 1~2줄 보장
  - `flex-col` + `mt-auto`로 기술 스택을 항상 하단 고정 (현재도 적용)

#### Item 2: 기능/기술 스택 태그 시각적 차별화
- **현재**: 기능 태그 = border pill, 기술 스택 태그 = bg pill (약간의 차이만)
- **변경**: 기술 스택 태그에 `font-mono text-[11px] tracking-wide` 적용으로 코드 느낌 + 배경 불투명도 강화
- **파일**: `src/components/project-card.tsx`
- **상세**:
  - 기능 태그: 현재 스타일 유지 (outline pill)
  - 기술 스택: 배경 컬러 진하게 + `font-mono text-[11px]` 적용으로 코드 느낌

#### Item 3: 라이트 모드 카드 대비 강화
- **현재**: `--card: rgba(255, 255, 255, 0.65)` / `--background: #e2e8f0`
- **변경**: 라이트 모드 카드에 `box-shadow` 추가, 배경 불투명도 높임
- **파일**: `src/app/globals.css`
- **상세**:
  - `--card: rgba(255, 255, 255, 0.82)` (불투명도 0.65 → 0.82)
  - `.glass` 기본 상태에 라이트모드용 `box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` 추가
  - `.dark .glass`에는 `box-shadow: none` (다크모드 기본 그림자 제거)

### 3.2 P1 — 높은 우선순위 (사용성)

#### Item 4: 기술 스택 필터
- **현재**: 필터 없음
- **변경**: 헤더 아래에 기술 스택 필터 바 추가
- **파일**: `src/components/tech-filter.tsx` (신규), `src/components/project-grid.tsx` (신규)
- **상세**:
  - Client Component (`"use client"`)
  - 2개 이상 프로젝트에서 사용된 고유 기술 스택 추출 → 등장 횟수 내림차순 버튼으로 표시
  - 클릭 시 해당 기술 포함 프로젝트만 표시
  - 다중 선택 지원 (OR 조건)
  - "초기화" 버튼으로 리셋 + 필터 결과 카운트 표시
  - URL 쿼리 파라미터 동기화는 비목표 (클라이언트 상태만)

#### Item 5: 카드 호버 인터랙션 강화
- **현재**: `hover:-translate-y-1` + glass hover 스타일만
- **변경**: 호버 시 카드 상단에 accent 컬러 라인 표시 + scale 미세 조정
- **파일**: `src/components/project-card.tsx`, `src/app/globals.css`
- **상세**:
  - `::before` 가상 요소로 상단 accent 라인 (width 0 → 60% 트랜지션, 0.4s ease)
  - GitHub 링크 아이콘 호버 시 accent 컬러로 변경

### 3.3 P2 — 중간 우선순위 (콘텐츠)

#### Item 6: 헤더 영역 보강
- **현재**: "VIBE CODING LAB" + "Dev-Nexus" + 한 줄 설명
- **변경**: 기술 역량 요약 통계 추가 (사용된 주요 기술 개수, 카테고리 등)
- **파일**: `src/app/page.tsx`
- **상세**:
  - gradient divider 아래 기술 통계 배지: "{N}+ Technologies · {M} Projects · Full-Stack" 형태
  - 기술 수는 `getTechCount()` 함수로 동적 계산 (고유 기술 스택 수)
  - 심플하게 유지 — 과도한 자기소개 지양

#### Item 7: 푸터 보강
- **현재**: "총 30개의 프로젝트 · 계속 늘어나는 중"
- **변경**: GitHub 프로필 + 이메일 링크 추가
- **파일**: `src/app/page.tsx`
- **상세**:
  - GitHub, Email 아이콘 링크 (Lucide 아이콘 활용)
  - 미니멀 스타일 유지

### 3.4 P3 — 낮은 우선순위 (모바일 최적화)

#### Item 8: 모바일 카드 접기/펼치기
- **현재**: 30개 카드 1열 쭉 나열
- **변경**: 처음 6개만 표시 + "더 보기" 버튼
- **파일**: `src/app/page.tsx` 또는 별도 래퍼 컴포넌트
- **상세**:
  - 모바일(`md` 미만)에서만 적용
  - 데스크톱에서는 항상 전체 표시
  - "더 보기" 클릭 시 6개씩 추가 로드 (Client Component 필요)

---

## 4. Technical Approach (기술 접근)

### 4.1 아키텍처 변경점
- `page.tsx`가 Server Component → 필터 기능 위해 Client Component 래퍼 필요
- 방법: `page.tsx`는 Server Component 유지, 필터+그리드 부분만 `ProjectGrid` Client Component로 분리

```
src/app/page.tsx (Server Component)
├── Header (서버에서 렌더링)
├── ProjectGrid (Client Component — 신규)
│   ├── TechFilter (Client Component — 신규)
│   └── ProjectCard[] (기존)
└── Footer (서버에서 렌더링)
```

### 4.2 변경 파일 목록

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `src/app/globals.css` | 수정 | 라이트모드 카드 대비, 호버 상단 라인 |
| `src/components/project-card.tsx` | 수정 | 카드 높이 정규화, 태그 차별화, 호버 강화 |
| `src/components/project-grid.tsx` | 신규 | Client Component — 필터 상태 + 그리드 |
| `src/components/tech-filter.tsx` | 신규 | 기술 스택 필터 바 |
| `src/app/page.tsx` | 수정 | 구조 변경 (ProjectGrid 사용, 헤더/푸터 보강) |

### 4.3 의존성
- 추가 패키지 없음 (기존 Lucide + Tailwind로 해결)

---

## 5. Implementation Order (구현 순서)

| 순서 | 항목 | 예상 작업 |
|------|------|-----------|
| 1 | Item 3: 라이트 모드 대비 | globals.css 수정 |
| 2 | Item 1: 카드 높이 정규화 | project-card.tsx 수정 |
| 3 | Item 2: 태그 차별화 | project-card.tsx 수정 |
| 4 | Item 5: 호버 인터랙션 | project-card.tsx + globals.css |
| 5 | Item 4: 기술 스택 필터 | 신규 컴포넌트 2개 + page.tsx 구조 변경 |
| 6 | Item 6: 헤더 보강 | page.tsx 수정 |
| 7 | Item 7: 푸터 보강 | page.tsx 수정 |
| ~~8~~ | ~~Item 8: 모바일 접기/펼치기~~ | ~~Design에서 보류 결정~~ |

> 순서 근거: CSS만 건드리는 작업(1~4)을 먼저 → 구조 변경(5) → 콘텐츠 추가(6~7)

---

## 6. Risks & Mitigations (위험 요소)

| 위험 | 영향 | 완화 방안 |
|------|------|-----------|
| `line-clamp`이 긴 한글 텍스트에서 잘림 | 카드 가독성 저하 | 데이터에서 motivation/outcome 길이 확인 후 clamp 줄 수 조정 |
| Server → Client Component 전환 | SEO 영향 | page.tsx는 Server 유지, 필터 부분만 Client 분리하여 초기 HTML 보존 |
| 필터 상태가 URL에 없음 | 공유 불가 | P3 범위 — 필요 시 `useSearchParams`로 확장 가능 |
| ~~모바일 "더 보기" UX~~ | ~~콘텐츠 누락 인식~~ | ~~Design에서 Item 8 보류 결정으로 해당 없음~~ |

---

## 7. Success Criteria (완료 기준)

- [x] 다크/라이트 모드 모두 카드 높이 일관됨
- [x] 기능 태그와 기술 스택 태그가 시각적으로 명확히 구분됨
- [x] 라이트 모드에서 카드 경계가 뚜렷함
- [x] 기술 스택 필터로 프로젝트 필터링 가능
- [x] 카드 호버 시 시각적 피드백 명확
- [x] 헤더에 최소한의 소개 텍스트 있음
- [x] 푸터에 연락처 링크 있음
- [ ] ~~모바일에서 "더 보기" 버튼으로 점진적 로드~~ → Design에서 보류 결정
- [x] `pnpm typecheck && pnpm build` 에러 0건
