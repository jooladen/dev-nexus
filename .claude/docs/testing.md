# Testing

## 도구

- Vitest (단위/통합 테스트)
- Testing Library (컴포넌트 테스트)
- Playwright (E2E 테스트, 필요시)

## 명령어

```bash
pnpm test           # 전체 테스트
pnpm test:watch     # 감시 모드
pnpm test:coverage  # 커버리지 포함
```

## 규칙

- 테스트 파일: `*.test.ts(x)`, 소스 파일 옆에 배치
- mock은 최소한으로 사용, 실제 동작 검증 우선
- Server Component는 통합 테스트, Client Component는 단위 테스트
- API Route는 요청/응답 검증 + Zod 스키마 일치 확인
