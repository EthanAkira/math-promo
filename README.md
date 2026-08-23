# 매일 배움 연구소 | Daily Learning Lab

초중고 연산 문제를 자동 생성해 보여주고, 과외 홍보로 연결하는 사이트의 첫 버전입니다.
지금은 **초등 덧셈** 한 페이지만 완성되어 있고, 나머지 학년/주제는 홈페이지에 "준비 중"으로 표시되어 있습니다.

## 로컬에서 실행하기

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 프로젝트 구조

```
app/
  layout.js                  전체 레이아웃, 사이트 메타데이터
  page.js                    홈페이지 (학년 목록 + 과외 소개 + 문의)
  components.js              헤더 / 과외 홍보 배너 / 푸터 (모든 페이지 공용)
  globals.css                디자인 토큰 (색상, 폰트, 배경)
  elementary/addition/
    page.js                  덧셈 문제 페이지 (SEO 메타데이터 포함)
    Generator.js             문제 자동생성 로직 (클라이언트 컴포넌트)
```

## 꼭 바꿔야 할 것

- `app/page.js` : "가르치는 사람" 소개 문단 → 실제 이름/경력/지도 방식으로 교체
- `app/components.js`, `app/page.js` : `yourname@email.com` → 실제 연락처로 교체
- `app/layout.js` : 사이트 제목/설명 문구를 상황에 맞게 다듬기

## 다음 학년/주제 추가하는 법

`app/elementary/addition/` 폴더를 통째로 복사해서 예를 들어
`app/elementary/subtraction/` 으로 이름을 바꾸고, `Generator.js`의
`makeProblem` 함수 안 연산자만 덧셈(`+`)에서 뺄셈(`-`)으로 바꾸면 됩니다.
그다음 `app/page.js`의 `gradeGroups` 배열에서 해당 주제의 `ready`를
`true`로, `href`를 새 경로로 바꿔주면 홈페이지에 바로 노출됩니다.

## 배포 (Cloudflare Pages Free)

이 프로젝트는 `next.config.mjs`의 `output: 'export'` 설정으로 정적 사이트를
`out/` 폴더에 만듭니다. 문제 생성, 채점, QR 생성은 브라우저에서 실행됩니다.

### GitHub 저장소 연결 방식

1. 이 폴더를 GitHub 저장소에 push
2. Cloudflare 대시보드 → Workers & Pages → Create application → Pages
3. GitHub 저장소 연결
4. Framework preset은 `Next.js (Static HTML Export)` 선택
5. Build command는 `npm run build`, Build output directory는 `out` 입력
6. Deploy 클릭

이후 GitHub에 push할 때마다 자동으로 재배포됩니다.

### 명령줄 직접 배포 방식

Cloudflare 계정 로그인 후 아래 명령을 실행합니다.

```bash
npm run build
npm run deploy:cloudflare
```

첫 실행에서 Wrangler가 설치되어 있지 않으면 `npm install -D wrangler`를 먼저
실행합니다.
