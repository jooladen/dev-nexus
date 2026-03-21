# Project Showcase Planning Document

> **Summary**: 20년차 개발자의 50개 프로젝트를 세련된 포트폴리오로 보여주는 메인 페이지
>
> **Project**: Dev-Nexus
> **Date**: 2026-03-21
> **Status**: Draft

---

## Executive Summary

| Perspective            | Content                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| **Problem**            | 20년간 쌓인 50개 프로젝트를 이력서 수준의 품질로 한눈에 보여줄 방법이 없음 |
| **Solution**           | Glassmorphism 기반 카드/그리드 2가지 뷰로 프로젝트를 시각적으로 전시       |
| **Function/UX Effect** | 카드형(10개)으로 주요 프로젝트 강조 + 그리드형(10개)으로 나머지 밀집 표시  |
| **Core Value**         | Glassmorphism 기반 세련된 디자인으로 개발자의 기술 역량과 경험을 임팩트 있게 전달 |

---

## 1. Overview

### 1.1 Purpose

20년차 개발자의 프로젝트 포트폴리오를 세련된 웹 서비스로 구현. 이력서 대신 URL 하나로 모든 프로젝트를 보여줄 수 있게 함.

### 1.2 Background

- 50개 프로젝트를 텍스트 이력서로 나열하면 임팩트가 없음
- 기술 스택, 상태, 인사이트를 시각적으로 전달해야 함
- 채용 담당자/클라이언트에게 첫인상이 중요

---

## 2. Scope

### 2.1 In Scope

- [x] Mock JSON 데이터 50개 생성
- [x] 카드형 뷰 (Glassmorphism, 상단 10개)
- [x] 그리드형 뷰 (컴팩트, 하단 10개)
- [x] 기술 스택 배지 표시
- [x] 다크모드 지원
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
| FR-01 | 50개 프로젝트 mock 데이터 (id, 제목, 설명, 스택, 상태, GitHub, 인사이트) | High     | Pending |
| FR-02 | 카드형 컴포넌트 (Glassmorphism) — 상단 10개                              | High     | Pending |
| FR-03 | 그리드형 컴포넌트 (컴팩트) — 하단 10개                                   | High     | Pending |
| FR-04 | 기술 스택 배지 (pill 형태)                                               | High     | Pending |
| FR-05 | 프로젝트 상태 표시 (completed, in-progress, maintained, archived)        | Medium   | Pending |
| FR-06 | GitHub 링크 연결                                                         | Medium   | Pending |
| FR-07 | 다크모드 디폴트 + 라이트/다크 토글 버튼                                    | High     | Pending |

### 3.2 Non-Functional Requirements

| Category    | Criteria             | Measurement Method |
| ----------- | -------------------- | ------------------ |
| Performance | LCP < 2.5s           | Lighthouse         |
| Design      | Glassmorphism 기반 세련된 UI | 시각적 리뷰        |
| Responsive  | 모바일~데스크톱 대응 | 브라우저 리사이즈  |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [x] 메인 페이지에서 카드 10개 + 그리드 10개 렌더링
- [x] Glassmorphism 효과 적용
- [x] 다크모드 정상 작동
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
| Framework | Next.js 15 (App Router)     | SSR/SSG + SEO                 |
| Styling   | Tailwind CSS v4 + shadcn/ui | Glassmorphism 구현 용이       |
| Data      | Mock JSON (정적)            | 우선 프로토타입, 추후 DB 전환 |

---

## 6. Data Schema

```ts
type ProjectStatus = "completed" | "in-progress" | "maintained" | "archived";

type Project = {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
  githubUrl: string;
  insight: string;
};
```

---

## 7. Next Steps

1. [x] Design 문서 작성 (`/pdca design project-showcase`)
2. [ ] 구현
3. [ ] Gap 분석

---

## Version History

| Version | Date       | Changes       | Author |
| ------- | ---------- | ------------- | ------ |
| 0.1     | 2026-03-21 | Initial draft | Claude |
| 0.2     | 2026-03-21 | awwwards 참조 제거, 다크모드 토글 버튼 요구사항 추가 | Claude |
