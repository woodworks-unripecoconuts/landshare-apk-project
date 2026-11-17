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

## 더 알아보기
- 프로젝트 규칙과 구조: [`CLAUDE.md`](./CLAUDE.md)
