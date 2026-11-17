# Supabase로 옮길 때 (나중에)

지금 마당공유는 `lib/repository/local/` (가짜 데이터 + localStorage)로 동작합니다.
화면 코드는 `lib/repository/types.ts`의 **인터페이스만** 쓰기 때문에, 아래 순서로 구현체만 바꾸면 됩니다.

## 1. 테이블 만들기 (`lib/domain/types.ts`와 1:1)

| 테이블 | 타입 | 비고 |
|---|---|---|
| `profiles` | `User` | Supabase Auth의 `auth.users`와 id 연결 |
| `spaces` | `Space` | 누구나 읽기(공개 + `status='active'`), 소유 마당지기만 쓰기 |
| `space_privates` | `SpacePrivate` | **RLS로 보호**: 소유자·관리자·승인된 마당손님만 읽기 |
| `bookings` | `Booking` | 해당 마당손님·마당지기·관리자만 읽기 |
| `messages` | `Message` | 해당 신청의 참여자만 읽기/쓰기 |
| `diaries` | `DiaryEntry` | 누구나 읽기, 이용 완료된 본인 신청에만 쓰기 |
| `reports` | `Report` | 로그인 사용자 쓰기, 관리자만 읽기 |
| `verification_requests` | `VerificationRequest` | 본인·관리자만 읽기 |

지금 `local/index.ts`에서 하는 권한 검사(`requireRole`, `canAccessBooking`, `getPrivate`의 허용 조건)를
그대로 **RLS 정책**으로 옮기면 됩니다.

## 2. 구현체 만들기

`lib/repository/supabase/index.ts`에 `createSupabaseRepository(): Repository`를 만들고,
`supabase-js`로 각 메서드를 구현합니다. (현재 로그인 사용자는 `supabase.auth.getUser()`로 확인)

- `subscribe()` → Supabase Realtime 채널 구독으로 구현
- `resetDemoData()` → 실제 서비스에서는 아무것도 하지 않거나 제거
- 사진(`photos`) → Supabase Storage에 올리고 공개 URL을 저장
  (`lib/utils/image-resize.ts`에서 줄인 뒤 업로드, `next.config.ts`의 `remotePatterns`에 `<프로젝트>.supabase.co` 추가)

## 3. 한 줄 바꾸기

```ts
// lib/repository/index.ts
export const repo: Repository = createSupabaseRepository();
```

## 4. 로그인·인증 바꾸기

- `lib/auth/auth-service.ts`의 `authService`를 Supabase Auth(카카오·네이버 등) 구현으로 교체
- `lib/verification/verification-service.ts`의 `verificationService`를 PASS 등 실제 본인인증으로 교체

> 서버 기능(API 라우트 등)이 필요해지면 그때 Netlify Functions 또는 Supabase Edge Functions를 검토합니다.
