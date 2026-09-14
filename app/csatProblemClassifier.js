// Rule-based (keyword/regex) topic classifier for individual CSAT math problems.
// Deterministic heuristic over the parsed question+explanation text, ordered from most
// specific to most generic pattern so problems land in the appropriate sub-unit.
// Mirrors app/amcProblemClassifier.js. Grade decides which taxonomy applies:
// 고1(g1) -> COMMON_MATH_SUBJECTS (공통수학1·2), 고2/고3/unset -> CSAT_SUBJECTS (5 선택과목),
// since 고2 6월/9월 모의고사 also draws only from 수학Ⅰ·Ⅱ but shares that taxonomy with 고3.
//
// IMPORTANT: text here is real PDF-extracted plaintext (via pdf.js), not LaTeX/KaTeX source —
// math commands like \sin, \int, \log never appear with a literal backslash. An earlier version
// of this file wrote patterns like /\\sin\b/ expecting LaTeX source; those never matched anything
// against real uploads and were silently dead code. Match the bare word instead (\bsin\b, etc).

const CSAT_RULES = [
  // 기하 (매우 특징적인 용어라 가장 먼저 검사)
  { subjectId: 'geometry', unitId: 'conic-sections', test: /포물선|타원|쌍곡선|이차곡선|준선|장축|단축|주축/ },
  { subjectId: 'geometry', unitId: 'space-geometry', test: /공간좌표|공간벡터|이면각|정사영|공간도형|삼수선의\s*정리|평면과\s*직선이\s*이루는/ },
  { subjectId: 'geometry', unitId: 'plane-vectors', test: /벡터|내적|시점과\s*종점|단위벡터|영벡터/ },

  // 미적분 (수열의 극한 · 여러 가지 미분법·적분법)
  { subjectId: 'calculus', unitId: 'sequence-limits', test: /수열의\s*극한|무한급수|등비급수|급수의\s*합|∑.*(?:n\s*(?:→|->)\s*∞|무한)/ },
  { subjectId: 'calculus', unitId: 'advanced-integration', test: /치환적분|부분적분|정적분으로\s*정의된\s*함수|삼각함수의\s*적분/ },
  { subjectId: 'calculus', unitId: 'advanced-differentiation', test: /합성함수의\s*미분|매개변수로\s*나타내어진|음함수의\s*미분|로그미분법|이계도함수|자연로그|\bln\b/ },

  // 확률과 통계
  { subjectId: 'prob-stats', unitId: 'statistics', test: /정규분포|표준편차|모평균|표본평균|신뢰구간|이항분포|모표준편차|표본표준편차/ },
  { subjectId: 'prob-stats', unitId: 'probability', test: /조건부확률|독립사건|배반사건|여사건|확률변수|기댓값|확률의\s*값|확률/ },
  { subjectId: 'prob-stats', unitId: 'counting', test: /순열|조합|중복순열|중복조합|이항정리|경우의\s*수/ },

  // 수학Ⅰ
  { subjectId: 'math1', unitId: 'trig', test: /삼각함수|사인법칙|코사인법칙|라디안|주기함수|\bsin\b|\bcos\b|\btan\b/ },
  { subjectId: 'math1', unitId: 'sequences', test: /등차수열|등비수열|수열의\s*합|점화식|귀납적으로\s*정의|첫째항이|수열\s*\{?\s*a\s*n/ },
  { subjectId: 'math1', unitId: 'exp-log', test: /로그함수|지수함수|상용로그|지수법칙|로그의\s*성질|밑과\s*진수|\blog\b/ },

  // 수학Ⅱ
  { subjectId: 'math2', unitId: 'limits-continuity', test: /함수의\s*극한|좌극한|우극한|연속함수|불연속|극한값|연속인|연속일\s*때|\blim\b/ },
  { subjectId: 'math2', unitId: 'differentiation', test: /미분계수|도함수|접선의\s*방정식|극댓값|극솟값|증가와\s*감소|변곡점|평균값\s*정리|f\s*['′]|미분가능/ },
  { subjectId: 'math2', unitId: 'integration', test: /부정적분|정적분|구분구적법|넓이를\s*구하|둘러싸인\s*부분의\s*넓이|∫|속도|가속도|움직인\s*거리/ },
];

const COMMON_MATH_RULES = [
  { subjectId: 'common-math-1', unitId: 'polynomial-ops', test: /다항식의\s*연산|인수분해|나머지정리|조립제법|항등식/ },
  { subjectId: 'common-math-2', unitId: 'coordinate-geometry-equations', test: /직선의\s*방정식|원의\s*방정식|두\s*점\s*사이의\s*거리|대칭이동|평행이동/ },
  { subjectId: 'common-math-1', unitId: 'equations-inequalities', test: /이차방정식|이차부등식|판별식|근과\s*계수|복소수|연립방정식/ },
  { subjectId: 'common-math-1', unitId: 'matrices-intro', test: /행렬|역행렬/ },
  { subjectId: 'common-math-1', unitId: 'common-math-counting', test: /순열|조합|경우의\s*수/ },
  { subjectId: 'common-math-2', unitId: 'sets-propositions', test: /집합|명제|부분집합|진리집합|필요충분조건/ },
  { subjectId: 'common-math-2', unitId: 'functions-graphs', test: /합성함수|역함수|함수의\s*그래프|함수\b/ },
];

// 2022개정 수능/모의고사는 "공통(1~22번) + 선택과목(23~30번)" 구조라, 선택과목 문제지 페이지마다
// "선택과목(미적분)"/"（확률과 통계）"/"(기하)" 라는 안내·꼬리표 문구가 문제 텍스트에 그대로 섞여
// 추출된다. 위 단원별 규칙이 아무것도 못 잡았을 때, 이 표시만으로도 최소한 과목은 정확히 알 수
// 있으므로 완전히 미분류로 두는 대신 그 과목의 대표 단원으로 분류한다(세부 단원까지는 못 잡음).
const SELECTION_SECTION_MARKERS = [
  { subjectId: 'calculus', defaultUnitId: 'advanced-differentiation', test: /선택과목\s*[（(]\s*미적분\s*[）)]/ },
  { subjectId: 'prob-stats', defaultUnitId: 'probability', test: /선택과목\s*[（(]\s*확률과\s*통계\s*[）)]/ },
  { subjectId: 'geometry', defaultUnitId: 'plane-vectors', test: /선택과목\s*[（(]\s*기하\s*[）)]/ },
];

// Returns { subjectId, unitId } — falls back to 'uncategorized' if nothing matches.
// grade: 'g1' | 'g2' | 'g3' | null/undefined (null/g2/g3 all use the CSAT_SUBJECTS taxonomy).
export function classifyCsatProblem(questionText, explanationText, grade) {
  const text = `${questionText || ''} ${explanationText || ''}`;
  const rules = grade === 'g1' ? COMMON_MATH_RULES : CSAT_RULES;
  for (const rule of rules) {
    if (rule.test.test(text)) {
      return { subjectId: rule.subjectId, unitId: rule.unitId };
    }
  }
  if (grade !== 'g1') {
    for (const marker of SELECTION_SECTION_MARKERS) {
      if (marker.test.test(text)) {
        return { subjectId: marker.subjectId, unitId: marker.defaultUnitId };
      }
    }
  }
  return { subjectId: 'uncategorized', unitId: 'uncategorized' };
}
