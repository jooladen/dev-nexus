---
name: form-patterns
description: Next.js 폼 처리 패턴. Use when creating forms, handling form submission, validation with Zod, or using Server Actions.
---

# Form Patterns

## 기본 구조: Zod + shadcn/ui + Server Action

### 1. 스키마 정의 (lib/ 또는 types/)

```tsx
// lib/schemas/contact.ts
import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().min(1, "이름을 입력하세요"),
  email: z.string().email("올바른 이메일을 입력하세요"),
  message: z.string().min(10, "최소 10자 이상 입력하세요"),
})

export type ContactFormData = z.infer<typeof contactSchema>
```

### 2. Server Action (app/ 또는 lib/actions/)

```tsx
// lib/actions/contact.ts
"use server"

import { contactSchema } from "@/lib/schemas/contact"

export async function submitContact(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const result = contactSchema.safeParse(raw)

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // 비즈니스 로직
  await saveContact(result.data)

  return { success: true }
}
```

### 3. 클라이언트 폼 컴포넌트

```tsx
// components/contact-form.tsx
"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitContact } from "@/lib/actions/contact"

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, null)

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="name">이름</Label>
        <Input id="name" name="name" />
        {state?.error?.name && (
          <p className="text-sm text-destructive">{state.error.name}</p>
        )}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "전송 중..." : "전송"}
      </Button>
    </form>
  )
}
```

## 규칙

- 스키마는 컴포넌트와 분리 (lib/ 또는 types/)
- Server Action에서 반드시 Zod 검증
- 클라이언트 검증은 UX용, 서버 검증이 진짜 방어선
- 에러 메시지는 한국어로
- pending 상태 UI 필수 (버튼 disabled + 로딩 텍스트)
- `useActionState` 사용 (React 19)
