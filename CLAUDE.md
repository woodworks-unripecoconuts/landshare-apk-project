@AGENTS.md

# 마당공유 (MadangShare) — 프로젝트 안내

> 슬로건: **"남는 마당, 함께 쓰는 쉼터"**
> 강원특별자치도의 남는 땅·주택 마당·농지를 가진 사람(마당지기)이 공간을 **무료로** 올리고,
> 캠핑·차박·나들이를 하려는 사람(마당손님)이 찾아서 신청하는 서비스의 **프로토타입**입니다.

## 현재 단계: 프로토타입
- 실제 DB·실제 로그인·실제 인증·실제 사진 업로드 **없음**. 모든 데이터는 `/data`의 가짜 데이터 + 브라우저 localStorage.
- 모든 페이지 아래(푸터 바로 위)에 항상 "프로토타입 · 실제 서비스 아님" + "현재 강원 지역에서만 서비스 중" 표시 (`components/layout/PageNotice.tsx`).
- **서버 기능 금지**: API 라우트(`app/api`), Server Actions, 서버 DB, 서버에서 데이터 읽기 금지.
  데이터는 모두 브라우저(클라이언트 컴포넌트)에서 repository로 불러온다.
  → 사용자가 새로 등록한 마당도 새로고침 후 상세 페이지(`/spaces/[id]`)가 열려야 한다.

## 용어 사전 (화면 문구에 반드시 사용)
| 일반 용어 | 마당공유 용어 | 코드 이름 |
|---|---|---|
| 호스트 | 마당지기 | `host` |
| 게스트 | 마당손님 | `guest` |
| 예약 신청 | 마당 신청 | `Booking` |
| 후기 | 마당 일기 | `DiaryEntry` |
| 공간 유형 | 마당캠핑 / 마당차박 / 마당나들이 | `camping` / `carcamp` / `picnic` |

신청 상태: 신청됨(`requested`) / 승인(`approved`) / 거절(`rejected`) / 취소(`cancelled`) / 이용 완료(`completed`).
한국어 이름표는 `lib/domain/labels.ts`, 유형·편의시설·토지 종류는 `data/space-types.ts`, `data/amenities.ts`.

## 서비스 규칙
- **강원 한정**: 강원특별자치도 18개 시·군(춘천·원주·강릉·동해·태백·속초·삼척·홍천·횡성·영월·평창·정선·철원·화천·양구·인제·고성·양양)만. 목록은 `data/regions.ts` 하나뿐. 페이지 아래 안내 띠에 "현재 강원 지역에서만 서비스 중" 표시.
- **완전 무료 + 광고 수익만**: 가격·이용료 입력란을 절대 만들지 않는다.
  이용약관과 등록 화면에 "마당지기는 이용료·사례금 등 어떤 금전도 받을 수 없습니다" 명시 (`data/policies.ts`의 `NO_FEE_NOTICE`).
- **광고**: `<AdSlot />`(`components/ads/AdSlot.tsx`)으로만 넣는다. 위치: 메인, 찾기 목록 중간, 상세 하단. 애드센스·애드핏 설정은 `lib/ads/config.ts`.
- **위치 보호**: 정확한 주소·좌표(`SpacePrivate`)는 신청이 승인된 마당손님·소유 마당지기·관리자에게만. 그 전에는 동네 단위 원(`approxCenter`, `approxRadiusM`)만 보여 준다.
- **법령 안내**: 문구는 `data/legal-notices.ts` **한 파일에서만** 고친다 (등록 6단계, 상세 페이지, `/legal`이 모두 이 파일을 사용). 기준일·면책 문구 포함.
  - 산림 100m 이내면 '불 사용 가능' 선택 불가 + 상세에 "불 사용 금지" 표시 (`lib/domain/space-rules.ts`).
  - 농지·임야면 농지법 안내 강조.
  - 마당손님은 신청 시 "불 사용 규칙과 쓰레기 되가져가기에 동의합니다" 체크 필수.
- **마당지기 인증(데모)**: 본인 인증 + 토지·주택 소유 확인 → "심사 중" → 3초 뒤 "인증 완료(데모)". 둘 다 완료가 아니면 공간에 "미인증" 표시. 실제 인증(PASS 등)은 `lib/verification/`의 서비스만 바꿔 끼운다.

## 코드 구조 규칙
```
app/          라우트(페이지). 동적 라우트 page.tsx는 params만 받아 클라이언트 컴포넌트에 넘김
components/   화면 조각 (layout, ui, map, space, search, host/register, booking, auth, ads)
data/         가짜(시드) 데이터와 고정 문구 (regions, users, spaces, legal-notices, policies ...)
lib/domain/   순수 TypeScript 타입·규칙 (React/Next 의존 금지 → 안드로이드 앱에서도 재사용)
lib/repository/  데이터 읽기/쓰기의 유일한 창구 (types.ts = 약속, local/ = 지금 구현, supabase/ = 나중)
lib/storage/  localStorage 래퍼 (localStorage는 여기서만 직접 사용)
lib/auth/     가짜 로그인 (AuthProvider, auth-service)
lib/verification/  데모 인증 서비스
lib/hooks/    화면이 데이터를 쓰는 React 훅 (repository 호출을 감쌈)
```
- 화면(컴포넌트·페이지)은 **반드시 `lib/hooks` 또는 `repo`(`@/lib/repository`)를 통해서만** 데이터에 접근한다. `/data`의 시드를 화면에서 직접 import해 목록을 만들지 않는다 (지역·유형·편의시설 같은 **고정 목록**과 법령·정책 문구는 예외).
- `localStorage`/`window.localStorage`를 컴포넌트에서 직접 쓰지 않는다 → `lib/storage/local-store.ts`.
- 새 데이터 종류를 추가할 때: `lib/domain/types.ts` 타입 → `lib/repository/types.ts` 인터페이스 → `lib/repository/local/` 구현 → `data/` 시드 → 시드 버전(`SEED_VERSION`) 올리기.
- 지도(Leaflet)는 브라우저 전용 → `next/dynamic(..., { ssr: false })`로 불러온다. 마커는 `L.divIcon` 사용.
- 이미지: `next.config.ts`에서 `images.unoptimized: true` + `remotePatterns`(picsum). 사진은 `components/space/SpaceImage.tsx`로 표시(실패 시 로컬 폴백). 가짜 사진 목록은 `data/images.ts`(자연 사진 번호).
- 디자인: Hipcamp(미국)·Campspace(네덜란드) 스타일 참고 — 흰 바탕, 큰 사진 카드(`SpaceCard`), 알약 모양 검색·필터, 둥근 모서리(2xl~3xl), 상세는 사진 격자 + 오른쪽 고정 신청 카드. 색은 `app/globals.css`의 grass(숲)·soil(흙)·sun(노을) 토큰만 사용.

## 배포: Netlify
- Netlify의 Next.js 자동 지원(OpenNext 어댑터)으로 배포. 설정은 `netlify.toml` (빌드 `npm run build`, publish `.next`, Node 22).
- **Vercel 전용 기능 금지**: `@vercel/*` 패키지, `vercel.json`, Vercel 전용 설정 사용 금지.
- `output: "export"` 사용 금지 (동적 라우트 새로고침이 깨짐).
- 이 Next.js(16.4)는 `cacheComponents`를 끈 상태로 쓴다 (단순함·호환성 우선).

## 안드로이드 앱 대비
- 모바일 우선 반응형, 하단 탭바, 44px 이상 터치 영역, safe-area 여백.
- `app/manifest.ts`(PWA)로 홈 화면 설치 가능 → 나중에 배포 주소를 TWA(Bubblewrap/PWABuilder)로 감싸 Play 스토어 앱으로 낼 수 있다.
- React Native로 갈 경우 `lib/domain`과 repository 인터페이스를 그대로 재사용한다.

## 명령어
```bash
npm install          # 처음 한 번
npm run dev          # 개발 서버 http://localhost:3000
npm run typecheck    # 타입 검사
npm run lint         # 코드 검사
npm run build        # 배포용 빌드 (Netlify가 실행하는 것과 같음)
```
커밋 전에는 `npm run typecheck && npm run lint && npm run build`가 통과해야 한다.

## 사용자(프로젝트 주인) 안내
- 코딩 초보이므로 작업 후 **무엇을 했는지 쉬운 말로** 설명하고, 로컬에서 확인하는 방법을 함께 알려 준다.
