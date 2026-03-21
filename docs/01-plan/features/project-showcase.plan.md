# Project Showcase Planning Document

> **Summary**: 바이브 코딩으로 만든 프로젝트들을 관리하고 방문자에게 재미와 인사이트를 전달하는 포트폴리오
>
> **Project**: Dev-Nexus
> **Date**: 2026-03-21
> **Status**: Final

---

## Executive Summary

| Perspective            | Content                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| **Problem**            | 바이브 코딩으로 프로젝트가 계속 늘어나는데 관리하고 보여줄 방법이 없음 |
| **Solution**           | Glassmorphism 카드로 프로젝트를 시각적으로 전시 + 각 프로젝트의 이유와 인사이트 공유 |
| **Function/UX Effect** | 카드형(전체)으로 프로젝트 표시, 방문자에게 "왜 만들었는지" 재미 제공 |
| **Core Value**         | 이력서 보조 + 학습 과정 공유 + 프로젝트 관리를 하나로 해결 |

---

## 1. Overview

### 1.1 Purpose

바이브 코딩으로 만든 프로젝트들을 관리하고, 방문자에게 각 프로젝트의 이유와 인사이트를 공유하는 웹 서비스. 이력서 제출 시 보조 자료로 활용.

### 1.2 Background

- 바이브 코딩으로 프로젝트가 계속 늘어나 관리 도구가 필요
- 각 프로젝트를 "왜 만들었는지" 인사이트와 함께 시각적으로 전달
- 이력서 제출 시 URL 하나로 역량을 보여줄 수 있으면 유리

---

## 2. Scope

### 2.1 In Scope

- [x] Mock JSON 데이터 30개 생성
- [x] 카드형 뷰 (Glassmorphism, 전체 표시)
- [x] 기술 스택 배지 표시
- [x] 다크모드 디폴트 + 라이트/다크 토글
- [x] 반응형 레이아웃

### 2.2 Out of Scope

- 백엔드/DB 연동 (추후)
- 프로젝트 상세 페이지 (추후)
- 검색/필터 기능 (추후)
- 인증/관리자 페이지 (추후)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID    | Requirement                                                              | Priority | Status  |
| ----- | ------------------------------------------------------------------------ | -------- | ------- |
| FR-01 | 30개 프로젝트 mock 데이터 (id, 제목, 동기, 결과, 기능, 스택, GitHub)     | High     | Done    |
| FR-02 | 카드형 컴포넌트 (Glassmorphism) — 전체 표시                              | High     | Done    |
| FR-03 | ~~그리드형 컴포넌트~~ (삭제 — 완료된 프로젝트만 올리므로 불필요)         | ~~High~~ | Removed |
| FR-04 | 기술 스택 배지 (pill 형태)                                               | High     | Done    |
| FR-05 | ~~프로젝트 상태 표시~~ (삭제 — 모든 프로젝트가 완료 상태)                | ~~Medium~~ | Removed |
| FR-06 | GitHub 링크 연결                                                         | Medium   | Done    |
| FR-07 | 다크모드 디폴트 + 라이트/다크 토글 버튼                                    | High     | Done    |

### 3.2 Non-Functional Requirements

| Category    | Criteria             | Measurement Method |
| ----------- | -------------------- | ------------------ |
| Performance | LCP < 2.5s           | Lighthouse         |
| Design      | Glassmorphism 기반 세련된 UI | 시각적 리뷰        |
| Responsive  | 모바일~데스크톱 대응 | 브라우저 리사이즈  |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [x] 메인 페이지에서 30개 카드 렌더링
- [x] Glassmorphism 효과 적용
- [x] 다크/라이트 모드 토글 정상 작동
- [x] 모바일 반응형 정상
- [x] typecheck + build 에러 0

---

## 5. Architecture Considerations

### 5.1 Project Level

| Level       | Selected |
| ----------- | :------: |
| **Starter** |    ✅    |

정적 데이터 기반 포트폴리오이므로 Starter 레벨 적합.

### 5.2 Key Decisions

| Decision  | Selected                    | Rationale                     |
| --------- | --------------------------- | ----------------------------- |
| Framework | Next.js 16 (App Router)     | SSR/SSG + SEO                 |
| Styling   | Tailwind CSS v4 + shadcn/ui | Glassmorphism 구현 용이       |
| Data      | Mock JSON (정적)            | 우선 프로토타입, 추후 DB 전환 |

---

## 6. Data Schema

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

---

## 7. Next Steps

1. [x] Design 문서 작성
2. [x] 구현
3. [x] Gap 분석 (100%)
4. [x] Report 완료

---

## Version History

| Version | Date       | Changes       | Author |
| ------- | ---------- | ------------- | ------ |
| 0.1     | 2026-03-21 | Initial draft | Claude |
| 0.2     | 2026-03-21 | awwwards 참조 제거, 다크모드 토글 버튼 요구사항 추가 | Claude |
| 0.3     | 2026-03-21 | Final sync: 30개 데이터, 전체 표시, Data Schema 현행화(motivation/outcome/features) | Claude |
