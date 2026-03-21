---
name: component-patterns
description: shadcn/ui 기반 컴포넌트 개발 패턴. Use when creating, extending, or composing UI components with shadcn/ui and Tailwind CSS.
---

# Component Patterns

## shadcn/ui 사용 규칙

### 절대 금지
- `components/ui/` 파일 직접 수정

### 확장 방법
```tsx
// components/enhanced-button.tsx
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EnhancedButtonProps = ButtonProps & {
  loading?: boolean
}

export function EnhancedButton({ loading, className, children, ...props }: EnhancedButtonProps) {
  return (
    <Button className={cn(className)} disabled={loading} {...props}>
      {loading ? <Spinner /> : children}
    </Button>
  )
}
```

### 컴포넌트 파일 규칙
- 파일명: kebab-case (`user-avatar.tsx`)
- export: named export (`export function UserAvatar`)
- props: `type` 정의 (`type UserAvatarProps = { ... }`)

### Tailwind 패턴
```tsx
// cn() 유틸로 조건부 클래스
<div className={cn(
  "flex items-center gap-2",
  isActive && "bg-primary text-primary-foreground",
  className
)} />
```

### 다크모드 필수
```tsx
// 모든 색상에 dark: 변형 적용
<div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50" />

// 또는 CSS 변수 활용 (권장)
<div className="bg-background text-foreground" />
```

### 컴포넌트 추가
```bash
npx shadcn@latest add [component-name]
```
