# 마당공유 (MadangShare) — 프로토타입

> 남는 마당, 함께 쓰는 쉼터 · 현재 강원 지역에서만 서비스 중 · **프로토타입 · 실제 서비스 아님**

강원특별자치도의 남는 땅·주택 마당·농지를 가진 **마당지기**가 공간을 무료로 올리고,
캠핑·차박·나들이를 하려는 **마당손님**이 찾아서 신청하는 서비스의 화면 프로토타입입니다.
실제 DB·로그인·인증 없이 가짜 데이터와 브라우저 저장소(localStorage)로 모든 화면이 동작합니다.

## 내 컴퓨터에서 실행하기 (처음 한 번)

1. [Node.js](https://nodejs.org/ko) **22 버전(LTS)** 을 설치합니다.
2. 터미널(맥: 터미널, 윈도우: PowerShell)을 열고 아래를 차례로 입력합니다.

```bash
git clone https://github.com/woodworks-unripecoconuts/landshare-apk-project.git
cd landshare-apk-project
git checkout ccr-c0f6019d-6zlvta   # 작업 브랜치 (main에 합친 뒤에는 생략)
npm install                       # 필요한 부품 설치 (처음 한 번, 1~2분)
npm run dev                       # 개발 서버 시작
```

3. 브라우저에서 <http://localhost:3000> 을 엽니다.
4. 끝낼 때는 터미널에서 `Ctrl + C`.

### 폰에서 보기 (같은 와이파이)
```bash
npm run dev -- -H 0.0.0.0
```
그다음 폰 브라우저에서 `http://<내 컴퓨터 IP>:3000` (예: `http://192.168.0.12:3000`).
컴퓨터 IP는 맥은 `시스템 설정 → Wi-Fi → 세부사항`, 윈도우는 PowerShell에서 `ipconfig`로 확인합니다.

## 화면 둘러보기 팁
- 오른쪽 위 **보기 전환** 버튼으로 마당손님 / 마당지기 / 관리자 화면을 바꿔 볼 수 있어요 (가짜 로그인).
- 맨 아래 **데모 데이터 초기화** 버튼을 누르면 처음 상태로 돌아갑니다.

### 5분 데모 순서
1. **마당손님**: 메인 → 검색 → 지도/목록에서 마당 고르기 → 상세 → `마당 신청하기` → 대화방
2. **마당지기**로 전환 → `마이 → 받은 신청 관리` → 승인 → 대화방에서 답장
3. **마당손님**으로 전환 → 대화방/상세에서 정확한 주소(가상)가 보이는지 확인
4. **마당지기** → `등록` → 7단계 폼 끝까지 → 새 상세 페이지에서 새로고침
5. **마당지기** → `마이 → 인증 상태` → 본인 인증·등기부등본 업로드 → 3초 뒤 인증 완료(데모)
6. **마당손님** → `마이 → 내 마당 일기` → 이용 완료된 곳에 마당 일기 쓰기
7. **관리자** → `관리자` → 신고 목록에서 공간 숨김, 인증 요청 승인

## 페이지 목록
| 주소 | 화면 |
|---|---|
| `/` | 메인 (슬로건, 검색, 유형 바로가기, 추천 마당, 광고 자리) |
| `/search` | 찾기 (지도 + 목록 + 필터) |
| `/spaces/[id]` | 마당 상세 |
| `/spaces/[id]/apply` | 마당 신청 |
| `/host/new`, `/host/spaces/[id]/edit` | 마당 등록·수정 (7단계) |
| `/messages`, `/messages/[신청id]` | 메시지 목록·대화방 |
| `/mypage` | 마이페이지 (신청 내역, 등록한 마당, 받은 신청, 인증 상태, 마당 일기) |
| `/diary/write/[신청id]` | 마당 일기 쓰기 |
| `/admin` | 관리자 (신고, 공간 숨김, 인증 요청) |
| `/terms`, `/privacy`, `/legal` | 이용약관, 개인정보처리방침, 법령 안내 |

## 자주 고칠 파일
| 고치고 싶은 것 | 파일 |
|---|---|
| 법령 안내 문구 | `data/legal-notices.ts` |
| 서비스 문구(슬로건, 무료 안내) | `data/policies.ts` |
| 가짜 마당 20개 | `data/spaces.ts` |
| 광고(애드센스·애드핏) | `lib/ads/config.ts`, `components/ads/AdSlot.tsx` |
| 색·글꼴 | `app/globals.css` |
| 가짜 사진(자연 풍경) | `data/images.ts` |
| Supabase로 옮기기 | `lib/repository/supabase/README.md` |

## 배포 (Netlify)

**지금 배포된 주소: <https://madangshare.netlify.app>** (폰 브라우저에서 바로 열 수 있어요)

### 배포 설정 파일
- `netlify.toml` — Netlify가 읽는 설정이에요.
  - 빌드 명령: `npm run build`
  - 결과 폴더: `.next`
  - Node 버전: 22
- Next.js 런타임 플러그인(`@netlify/plugin-nextjs`)을 `netlify.toml`에 직접 적어 두었어요. 빠지면 서버 함수 없이 배포돼 사이트가 열리지 않아요.
  - 배포 후 Netlify의 **Deploys → 해당 배포** 화면에 함수(`___netlify-server-handler`)가 1개 있는지 보면 확인할 수 있어요.
- 배포하기 전에 내 컴퓨터에서 `npm run build`가 에러 없이 끝나는지 먼저 확인하세요.

### GitHub와 연결해서 자동 배포 받기 (한 번만)
연결해 두면 GitHub에 코드를 올릴 때마다 Netlify가 알아서 다시 배포해요.
`madangshare` 프로젝트는 이미 만들어져 있으니, 저장소만 연결하면 돼요.

1. <https://app.netlify.com> 에 로그인
2. **Projects**(예전 이름: Sites) 목록에서 **madangshare** 클릭
3. 왼쪽 메뉴 **Project configuration** → **Build & deploy** → **Continuous deployment**
4. **Repository** 칸의 **Link repository** 버튼 클릭
5. **GitHub** 선택 → 처음이면 GitHub 창이 뜨는데, Netlify 접근을 **허용(Authorize/Install)** 해 주세요
   - 저장소가 목록에 안 보이면 "Configure the Netlify app on GitHub"를 눌러 `landshare-apk-project` 저장소 접근을 허용해요
6. 저장소 **landshare-apk-project** 선택
7. 배포할 브랜치(Branch to deploy): 지금 GitHub에 있는 브랜치 **`ccr-c0f6019d-6zlvta`**
   - 나중에 이 브랜치를 `main`에 합치면, 같은 화면의 **Branches and deploy contexts → Configure**에서 Production branch를 `main`으로 바꿔요
8. 빌드 설정이 `npm run build` / `.next`로 자동으로 채워졌는지 확인 → **Link**(또는 Deploy) 클릭
9. **Deploys** 메뉴에서 빌드가 끝나고 **Published**가 뜨면 완료

> 처음부터 새 프로젝트로 만들 때는: **Add new project → Import an existing project → GitHub → 저장소 선택 → Deploy**.
> 이렇게 하면 주소가 `무작위-이름.netlify.app`으로 생기니 아래 방법으로 이름을 바꿔 주세요.

### 사이트 주소(이름) 바꾸기
1. 프로젝트 화면 → **Project configuration** → **General** → **Project details**
2. **Change project name** → 원하는 이름 입력 (예: `madangshare`) → **Save**
3. 주소가 `https://새이름.netlify.app`으로 바뀌어요 (이미 다른 사람이 쓰는 이름은 안 돼요)

### 누구나 볼 수 있는지 확인
- 링크를 열었는데 Netlify 로그인 화면이 나오면: **Project configuration → Access & security → Visitor access**에서
  로그인/비밀번호 보호를 꺼 주세요. (`madangshare` 프로젝트는 꺼 둔 상태예요)
- 프로토타입이라 검색엔진에는 나오지 않게 설정해 두었어요 (`robots: noindex`).

> Netlify 화면의 메뉴 이름은 가끔 바뀌어요. 위와 이름이 조금 다르면 비슷한 메뉴를 찾아 주세요.

### 배포 후 확인 체크리스트 (폰에서)
- [ ] **메인** — 페이지 맨 아래(푸터 위)에 "프로토타입 · 실제 서비스 아님", "현재 강원 지역에서만 서비스 중"이 보인다
- [ ] **찾기** — 지도에 마커가 뜨고, 지도 배경(OpenStreetMap)과 마당 사진이 보인다
- [ ] **필터** — 시·군, 유형을 바꾸면 목록과 지도가 함께 바뀐다
- [ ] **상세** — 사진 슬라이드, 동네 단위 원 지도, 법령 안내 요약, 하단 광고 자리가 보인다
- [ ] **등록 폼** — 오른쪽 위에서 "마당지기로 보기" → 등록 7단계를 끝까지 진행할 수 있다
- [ ] **새로고침** — 방금 등록한 마당의 상세 페이지에서 새로고침해도 그대로 열린다
- [ ] **신청 → 승인 → 메시지** — 손님으로 신청 → 마당지기로 승인 → 손님 화면에 정확한 주소(가상)가 보인다
- [ ] **홈 화면에 추가** — 안드로이드 크롬 메뉴 → "홈 화면에 추가" → 앱처럼 열린다

> 데모 데이터는 **기기(브라우저)마다 따로** 저장돼요. 폰에서 등록한 마당은 컴퓨터에서는 보이지 않아요.

## 더 알아보기
- 프로젝트 규칙과 구조: [`CLAUDE.md`](./CLAUDE.md)
