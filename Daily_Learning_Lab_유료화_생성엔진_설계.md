# Daily Learning Lab — 유료 단계를 위한 기본 설계 (v2)

**목적**: 지금의 무료 연산 서비스(부모 리포트 포함)를 깨지 않으면서, 입시/경시/내신 관리라는 유료 서비스로 확장하기 위한 아키텍처 재설계.

---

## 1. 전체 그림

```
                    ┌─────────────────────────┐
   기출문제 분석  →  │  문제 템플릿 저장소       │  →  문제 생성 엔진 → 학생 화면
   (사람+AI, 오프라인) │  (패턴/파라미터만 저장,    │
                    │   실제 기출 문항 텍스트    │
                    │   없음)                  │
                    └─────────────────────────┘
                                                          ↓
                                                   answer_events
                                                   (정답여부 + 스킬태그 + 난이도)
                                                          ↓
                                              ┌───────────────────────┐
                                              │  리포트 / 목표 설계     │
                                              │  (부모 + 선생님 공동)   │
                                              └───────────────────────┘
                                                          ↑
                                              entitlements(구독) 체크로
                                              무료/유료 콘텐츠 분리
```

지금 만든 것(NoteCanvas, CaptureGuard, sessions/answer_events, 부모 리포트)은 이 그림에서 **오른쪽 절반**입니다. 이번에 새로 설계하는 건 **왼쪽(문제 생성 엔진)**과 **역할/과금 체계**입니다.

---

## 2. 문제 생성 엔진 — "기출을 베끼지 않고 패턴만 재사용"

가장 중요한 설계 원칙: **기출문제의 텍스트·숫자·보기를 저장하거나 재사용하지 않는다.** 대신 기출을 분석해서 아래 세 가지만 뽑아 저장합니다.

1. **스킬(개념) 태그** — 예: `이차방정식-근과계수관계`, `AMC-원순열`, `수능-미분가능성`
2. **난이도/출제 비중** — 예: "최근 10개년 수능에서 이 스킬이 22문항 중 평균 1.3문항 출제, 난이도 4~5등급대"
3. **문제 구조(템플릿)** — 숫자와 맥락은 비어있고, 어떤 계산 구조인지만 남긴 뼈대

이 세 가지를 바탕으로 **파라미터화된 템플릿**을 만들고, 그 템플릿에 매번 다른 숫자·맥락을 넣어 새 문제를 생성합니다. 지금 초등 연산 생성기(`makeProblems(seed, unit)`)가 하는 일의 "고급 버전"이라고 보면 됩니다 — 원리는 완전히 같고, 템플릿이 훨씬 정교해질 뿐입니다.

### 템플릿 데이터 구조 (예시)

```js
{
  templateId: 'ksat-quad-root-sum-square-01',
  examCategory: 'ksat',              // 수능/내신/AMC/JEE 등
  skillTags: ['이차방정식', '근과 계수의 관계'],
  difficultyTier: 3,                  // 1~5
  gradeLevel: 'high-2',
  weight: 0.018,                      // 기출 분석 결과: 전체 문항 중 이 유형 출제 비중

  // 파라미터 공간 — 여기서 매번 다른 값을 뽑는다
  paramSpace: {
    a: { type: 'int', range: [1, 5], exclude: [0] },
    p: { type: 'int', range: [-9, 9] },
    q: { type: 'int', range: [-9, 9] },
  },
  // 문제로서 성립하지 않는 조합 제외 (예: 두 근이 같으면 문제 의미가 약해짐)
  constraints: [(params) => params.p !== params.q],

  build(params) {
    const { a, p, q } = params;
    const b = -a * (p + q);
    const c = a * p * q;
    const answer = p * p + q * q; // α²+β²
    return {
      prompt: `이차방정식 ${a}x² + ${b}x + ${c} = 0의 두 근을 α, β라 할 때, α² + β²의 값은?`,
      answer,
      choices: buildDistractors(answer, params), // 아래 참고
    };
  },
}
```

### 생성 알고리즘 (문제지 1장을 만드는 순서)

1. **스킬 분포 샘플링** — 목표 시험(예: 고2 내신)의 기출 분석 결과에 저장된 `weight`를 기준으로, 20문항짜리 문제지라면 "이 스킬은 몇 문항 나와야 실제 시험과 비슷한 구성이 되는지" 가중 추첨
2. **템플릿 선택** — 뽑힌 스킬·난이도에 맞는 템플릿 후보군에서 시드 기반 무작위 선택 (지금 쓰는 `hashSeed(seed)` 패턴 그대로 재사용 가능)
3. **파라미터 샘플링** — `paramSpace`에서 값 추첨 → `constraints` 통과할 때까지 재시도
4. **문제 생성** — `build(params)` 호출로 실제 prompt/answer 생성
5. **오답(distractor) 생성** — 기출의 실제 오답 보기를 베끼는 게 아니라, **흔한 실수 패턴**(부호 실수, 공식 오적용, 자릿수 실수 등)을 함수로 정의해서 정답으로부터 역산 — 예: `buildDistractors`가 "부호를 반대로 계산했을 때 나오는 값", "곱과 합을 헷갈렸을 때 나오는 값" 등을 생성
6. **문제지 조립** — 위 과정을 20회 반복, 스킬 태그·난이도가 실제 시험 구성 비율과 비슷해지도록 조정

### 콘텐츠 파이프라인 (사람이 하는 부분)

기출 분석 자체는 지금 자동화할 필요 없습니다. 현실적인 순서는:

1. 기출문제 수집·분석 (사람이 직접, 또는 AI 보조로 "이 문제가 어떤 스킬/난이도인지" 태깅)
2. 분석 결과를 바탕으로 템플릿 작성 (개발자가 위 형식으로 코드화)
3. 템플릿을 생성 엔진에 등록
4. 이후로는 완전 자동 — 같은 템플릿에서 무한히 다른 문제 생성

**저장되는 건 3번(템플릿=패턴)이지 실제 기출 문항이 아니므로**, 저작권 문제에서 자유롭고 "표절"이 아닌 "유형 학습"이라는 상품 포지셔닝도 명확해집니다.

---

## 3. 스킬 태그를 리포트에도 연결 — 기존 시스템과의 시너지

지금 `answer_events` 테이블은 정답/오답만 기록합니다. 여기에 컬럼 두 개만 추가하면, 문제 생성에 쓴 태깅 체계를 리포트에도 그대로 재사용할 수 있습니다.

```sql
ALTER TABLE answer_events ADD COLUMN skill_tag TEXT;
ALTER TABLE answer_events ADD COLUMN difficulty_tier INTEGER;
```

이러면 부모/선생님 리포트가 지금처럼 "정답률 80%"에 머물지 않고, **"이차함수는 강한데 확률과 통계는 약하다"** 같은 스킬 단위 분석이 가능해집니다. 이게 사실 유료 서비스의 핵심 가치이기도 합니다 — 단순 채점이 아니라 "약점 진단".

---

## 4. 역할 체계: 부모 + 선생님

지금 스키마는 `families`(부모 전화번호) ↔ `students` 1:1이라 선생님이 들어올 자리가 없습니다. 아래처럼 역할 테이블을 분리합니다.

```sql
CREATE TABLE guardians (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE,
  role_default TEXT,              -- 'parent' | 'teacher' (가입 시 기본값, 학생별로 재정의 가능)
  created_at INTEGER NOT NULL
);

-- 보호자(부모/선생님)와 학생의 관계 + 권한
CREATE TABLE guardian_links (
  id TEXT PRIMARY KEY,
  guardian_id TEXT NOT NULL REFERENCES guardians(id),
  student_id TEXT NOT NULL REFERENCES students(id),
  role TEXT NOT NULL,             -- 'parent' | 'teacher'
  can_manage_billing INTEGER NOT NULL DEFAULT 0,  -- 결제/구독 변경 권한 (부모만 기본 true)
  can_set_goals INTEGER NOT NULL DEFAULT 1,       -- 목표 설계 권한
  invited_by TEXT REFERENCES guardians(id),       -- 선생님은 부모가 초대
  created_at INTEGER NOT NULL
);
```

- **부모**: 결제, 선생님 초대/해제, 목표 설계, 리포트 조회 — 전부 가능
- **선생님**: 부모가 초대한 학생에 한해 리포트 조회 + 목표 설계까지 가능, 결제·기기 관리는 불가 (`can_manage_billing = 0`)
- 지금의 `families` 테이블은 `guardians`로 대체되고(역할이 phone 하나에 고정되지 않도록), `join_codes`(기기 연결 코드)는 그대로 재사용 가능 — "누가 코드를 발급했는지"만 `guardian_id` 기준으로 바뀝니다

기존에 만든 부모 로그인(SMS OTP) 로직은 거의 그대로 재사용됩니다. `families.phone` 조회 부분만 `guardians.phone`으로 바뀌는 정도의 변경입니다.

---

## 5. 무료/유료 구분: 구독(entitlement) 체계

```sql
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  family_root_id TEXT NOT NULL,   -- 결제 주체 (보통 부모 guardian_id)
  student_id TEXT NOT NULL REFERENCES students(id),
  tier TEXT NOT NULL,             -- 'free' | 'gpa' | 'exam-prep' | 'competition' 등
  provider TEXT,                  -- 'tosspayments' | 'iamport' 등 (나중에 결제 연동 시)
  provider_ref TEXT,
  status TEXT NOT NULL,           -- 'active' | 'canceled' | 'expired'
  current_period_end INTEGER,
  created_at INTEGER NOT NULL
);
```

각 문제 생성기 페이지는 렌더링 전에 "이 학생이 이 `subject_path`에 대응하는 `tier`의 활성 구독이 있는가"를 확인합니다. 없으면:

- 무료 문제 몇 개만 미리보기로 보여주고
- 나머지는 잠금 처리 + 업그레이드 유도 화면

지금 만든 7개 무료 생성기는 전부 `tier: 'free'`로 취급하면 되므로 **지금 당장 아무것도 바꿀 필요가 없습니다.** 나중에 유료 카테고리(내신/입시/경시)를 추가할 때부터 이 체크 로직이 필요해집니다.

---

## 6. 단계별 실행 순서 (제안)

| 단계 | 내용 | 지금 당장 필요? |
|---|---|---|
| 1 | `guardians`/`guardian_links`/`subscriptions` 테이블 스키마만 미리 추가 (빈 테이블) | 해두면 좋음, 사용에 영향 없음 |
| 2 | 유료 카테고리 1개 선정 (예: 고등 내신 또는 AMC 중 하나) 후 기출 분석 착수 | 사람이 하는 작업, 지금 시작 가능 |
| 3 | 그 카테고리의 템플릿 10~20개 작성 + 생성 엔진 프로토타입 | 분석 끝난 뒤 |
| 4 | `answer_events`에 skill_tag/difficulty_tier 컬럼 추가, 리포트에 스킬 분석 뷰 추가 | 3번과 병행 가능 |
| 5 | 결제 연동 (토스페이먼츠/포트원 등) + entitlement 체크 로직 | 유료 카테고리 출시 직전 |
| 6 | 선생님 초대 UI (부모 화면에 "선생님 초대" 버튼 추가) | 4~5번과 병행 가능 |

---

## 7. 지금 당장 결정해야 할 것

- **첫 유료 카테고리를 뭘로 할지**: 내신(GPA 관리)이 진입장벽이 낮고, 경시(AMC 등)는 지난번 국가별 분석에서 봤듯 국제 확장성이 좋습니다. 둘 중 우선순위를 정하면 그 카테고리부터 기출 분석 + 템플릿 설계에 들어갈 수 있습니다.
