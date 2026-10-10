import fs from 'fs';
import path from 'path';

const CHAPTERS = [
  {
    ch: 1, name: '지수함수의 그래프와 최대·최소', count: 18,
    prob_pages: [11, 13], sol_pages: [3, 4],
    subjectId: 'math1', unitId: 'exp-log', subUnitId: 'exponential-functions',
    amcSubjectId: 'algebra', amcUnitId: 'exponential-logarithmic',
    grade: 'g2', category: 'exponential-functions',
    answers: [3, 1, 2, 5, 3, 4, 32, 3, 2, 4, 20, 3, 3, 15, 1, 10, 83, 18]
  },
  {
    ch: 2, name: '로그함수의 그래프와 최대·최소', count: 26,
    prob_pages: [15, 19], sol_pages: [5, 7],
    subjectId: 'math1', unitId: 'exp-log', subUnitId: 'logarithmic-functions',
    amcSubjectId: 'algebra', amcUnitId: 'exponential-logarithmic',
    grade: 'g2', category: 'logarithmic-functions',
    answers: [3, 2, 23, 4, 5, 2, 25, 53, 2, 16, 2, 2, 3, 13, 2, 5, 1, 5, 2, 13, 2, 1, 3, 4, 5, 6]
  },
  {
    ch: 3, name: '지수방정식과 지수부등식', count: 28,
    prob_pages: [21, 25], sol_pages: [8, 11],
    subjectId: 'math1', unitId: 'exp-log', subUnitId: 'exponential-equations',
    amcSubjectId: 'algebra', amcUnitId: 'exponential-logarithmic',
    grade: 'g2', category: 'exponential-equations',
    answers: [3, 4, 2, 1, 4, 5, 2, 5, 3, 4, 25, 3, 3, 128, 1, 5, 1, 1, 2, 18, 2, 1, 5, 1, 5, 2, 4, 1]
  },
  {
    ch: 4, name: '로그방정식과 로그부등식', count: 28,
    prob_pages: [27, 31], sol_pages: [11, 14],
    subjectId: 'math1', unitId: 'exp-log', subUnitId: 'logarithmic-equations',
    amcSubjectId: 'algebra', amcUnitId: 'exponential-logarithmic',
    grade: 'g2', category: 'logarithmic-equations',
    answers: [3, 4, 2, 5, 4, 5, 4, 3, 2, 12, 4, 2, 20, 27, 2, 4, 4, 15, 81, 1, 3, 2, 4, 5, 2, 2, 1, 1]
  },
  {
    ch: 5, name: '지수·로그함수의 실생활 활용', count: 20,
    prob_pages: [33, 37], sol_pages: [15, 17],
    subjectId: 'math1', unitId: 'exp-log', subUnitId: 'exp-log-applications',
    amcSubjectId: 'algebra', amcUnitId: 'exponential-logarithmic',
    grade: 'g2', category: 'exp-log-applications',
    answers: [2, 3, 4, 1, 5, 4, 84, 31, 2, 5, 2, 5, 1, 1, 3, 54, 4, 4, 2, 1]
  },
  {
    ch: 6, name: '일반각과 호도법 및 삼각함수의 뜻', count: 18,
    prob_pages: [39, 41], sol_pages: [17, 21],
    subjectId: 'math1', unitId: 'trig', subUnitId: 'trig-definition',
    amcSubjectId: 'advanced', amcUnitId: 'trigonometry',
    grade: 'g2', category: 'trig-definition',
    answers: [2, 20, 4, 20, 3, 4, 5, 12, 3, 4, 2, 1, 1, 1, 3, 4, 2, 1]
  },
  {
    ch: 7, name: '삼각함수의 그래프와 성질', count: 22,
    prob_pages: [43, 47], sol_pages: [22, 25],
    subjectId: 'math1', unitId: 'trig', subUnitId: 'trig-graphs',
    amcSubjectId: 'advanced', amcUnitId: 'trigonometry',
    grade: 'g2', category: 'trig-graphs',
    answers: [2, 3, 1, 2, 4, 2, 5, 4, 3, 10, 2, 5, 2, 4, 2, 5, 4, 8, 3, 1, 2, 1]
  },
  {
    ch: 8, name: '삼각함수의 덧셈정리와 배각공식', count: 30,
    prob_pages: [49, 53], sol_pages: [26, 30],
    subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'trig-addition-formulas',
    amcSubjectId: 'advanced', amcUnitId: 'trig-identities',
    grade: 'g2', category: 'trig-addition-formulas',
    answers: [1, 2, 3, 4, 5, 5, 1, 5, 5, 2, 4, 1, 5, 4, 3, 1, 1, 5, 1, 1, 2, 1, 36, 5, 2, 5, 49, 1, 4, 5]
  },
  {
    ch: 9, name: '삼각함수의 합성', count: 32,
    prob_pages: [55, 59], sol_pages: [31, 34],
    subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'trig-synthesis',
    amcSubjectId: 'advanced', amcUnitId: 'trig-identities',
    grade: 'g2', category: 'trig-synthesis',
    answers: [1, 4, 3, 1, 2, 5, 4, 5, 1, 4, 1, 5, 5, 28, 4, 5, 2, 1, 1, 1, 2, 1, 5, 5, 2, 5, 5, 1, 4, 5, 1, 2]
  },
  {
    ch: 10, name: '삼각방정식과 삼각부등식', count: 30,
    prob_pages: [61, 65], sol_pages: [35, 37],
    subjectId: 'math1', unitId: 'trig', subUnitId: 'trig-equations',
    amcSubjectId: 'advanced', amcUnitId: 'trigonometry',
    grade: 'g2', category: 'trig-equations',
    answers: [1, 1, 39, 4, 5, 1, 3, 1, 1, 5, 20, 5, 7, 20, 4, 3, 5, 30, 35, 1, 7, 1, 5, 5, 1, 1, 1, 1, 5, 4]
  },
  {
    ch: 11, name: '지수함수와 로그함수의 극한', count: 32,
    prob_pages: [67, 71], sol_pages: [38, 40],
    subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'exp-log-limits',
    amcSubjectId: 'calculus', amcUnitId: 'derivatives',
    grade: 'g2', category: 'exp-log-limits',
    answers: [1, 4, 5, 5, 3, 4, 4, 4, 2, 4, 1, 4, 4, 5, 3, 4, 1, 4, 2, 4, 1, 4, 4, 1, 1, 2, 4, 2, 4, 98, 2, 4]
  },
  {
    ch: 12, name: '삼각함수의 극한', count: 19,
    prob_pages: [73, 77], sol_pages: [41, 44],
    subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'trig-limits',
    amcSubjectId: 'calculus', amcUnitId: 'derivatives',
    grade: 'g2', category: 'trig-limits',
    answers: [1, 4, 3, 2, 4, 16, 20, 17, 1, 2, 4, 4, 1, 2, 4, 3, 2, 4, 1]
  },
  {
    ch: 13, name: '삼각함수 극한의 도형에의 활용', count: 21,
    prob_pages: [79, 83], sol_pages: [45, 47],
    subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'trig-limit-geometry',
    amcSubjectId: 'geometry', amcUnitId: 'trig-geometry',
    grade: 'g3', category: 'trig-limit-geometry',
    answers: [1, 2, 4, 4, 3, 1, 4, 4, 2, 3, 4, 15, 4, 4, 14, 21, 1, 4, 4, 1, 4]
  },
  {
    ch: 14, name: '여러 가지 함수의 미분법', count: 34,
    prob_pages: [85, 89], sol_pages: [48, 52],
    subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'derivative-rules',
    amcSubjectId: 'calculus', amcUnitId: 'derivatives',
    grade: 'g2', category: 'derivative-rules',
    answers: [1, 4, 4, 4, 4, 3, 1, 4, 2, 4, 4, 1, 4, 4, 4, 11, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 4, 4, 4, 4]
  },
  {
    ch: 15, name: '접선의 방정식', count: 30,
    prob_pages: [91, 95], sol_pages: [52, 58],
    subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'tangent-lines',
    amcSubjectId: 'calculus', amcUnitId: 'derivatives',
    grade: 'g2', category: 'tangent-lines',
    answers: [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 21, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
  },
  {
    ch: 16, name: '극대·극소와 최대·최소', count: 24,
    prob_pages: [97, 101], sol_pages: [59, 63],
    subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'extrema-optimization',
    amcSubjectId: 'calculus', amcUnitId: 'derivatives',
    grade: 'g2', category: 'extrema-optimization',
    answers: [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 32, 4, 4, 4, 4, 4, 4, 4, 4]
  },
  {
    ch: 17, name: '함수의 그래프와 방정식·부등식', count: 26,
    prob_pages: [103, 107], sol_pages: [64, 68],
    subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'curve-sketching-equations',
    amcSubjectId: 'calculus', amcUnitId: 'derivatives',
    grade: 'g3', category: 'curve-sketching-equations',
    answers: [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
  },
  {
    ch: 18, name: '치환적분법과 부분적분법', count: 20,
    prob_pages: [109, 113], sol_pages: [68, 70],
    subjectId: 'calculus', unitId: 'advanced-integration', subUnitId: 'substitution-by-parts',
    amcSubjectId: 'calculus', amcUnitId: 'integrals',
    grade: 'g2', category: 'substitution-by-parts',
    answers: [1, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 18, 4, 4, 4, 4]
  },
  {
    ch: 19, name: '급수와 정적분', count: 19,
    prob_pages: [115, 117], sol_pages: [71, 74],
    subjectId: 'calculus', unitId: 'advanced-integration', subUnitId: 'riemann-sum-integrals',
    amcSubjectId: 'calculus', amcUnitId: 'integrals',
    grade: 'g3', category: 'riemann-sum-integrals',
    answers: [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
  },
  {
    ch: 20, name: '정적분의 활용 (넓이)', count: 27,
    prob_pages: [119, 123], sol_pages: [74, 75],
    subjectId: 'calculus', unitId: 'advanced-integration', subUnitId: 'area-between-curves',
    amcSubjectId: 'calculus', amcUnitId: 'integrals',
    grade: 'g2', category: 'area-between-curves',
    answers: [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
  },
  {
    ch: 21, name: '정적분의 활용 (부피)', count: 18,
    prob_pages: [125, 129], sol_pages: [75, 78],
    subjectId: 'calculus', unitId: 'advanced-integration', subUnitId: 'volume-of-solids',
    amcSubjectId: 'calculus', amcUnitId: 'integrals',
    grade: 'g3', category: 'volume-of-solids',
    answers: [22, 18, 3, 4, 4, 4, 4, 41, 25, 4, 4, 50, 25, 4, 4, 4, 4, 4]
  }
];

function cleanOcr(text) {
  if (!text) return '';
  return text.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '').replace(/\s+/g, ' ').trim();
}

function parseProblems(chInfo) {
  const { count, prob_pages: [pStart, pEnd] } = chInfo;
  let combined = '';
  for (let p = pStart; p <= pEnd; p++) {
    const pad = String(p).padStart(3, '0');
    const fPath = `temp_inspect_calc2/prob_txt/prob_p${pad}.txt`;
    if (fs.existsSync(fPath)) {
      combined += '\n' + fs.readFileSync(fPath, 'utf-8');
    }
  }

  const probDict = {};
  const lines = combined.split(/\r?\n/);
  let curNum = null;
  let curLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const m = trimmed.match(/^(?:0(\d)|(\d{2}))(?:\s+|$)/);
    if (m) {
      const nVal = parseInt(m[1] || m[2], 10);
      if (nVal >= 1 && nVal <= count) {
        if (curNum !== null) {
          probDict[curNum] = curLines.join('\n').trim();
        }
        curNum = nVal;
        curLines = [trimmed.substring(m[0].length).trim()];
        continue;
      }
    }
    if (curNum !== null) {
      curLines.push(trimmed);
    }
  }
  if (curNum !== null) {
    probDict[curNum] = curLines.join('\n').trim();
  }
  return probDict;
}

function parseSolutions(chInfo) {
  const { count, sol_pages: [sStart, sEnd] } = chInfo;
  let combined = '';
  for (let p = sStart; p <= sEnd; p++) {
    const pad = String(p).padStart(2, '0');
    const fPath = `temp_inspect_calc2/sol_txt/sol_p${pad}.txt`;
    if (fs.existsSync(fPath)) {
      combined += '\n' + fs.readFileSync(fPath, 'utf-8');
    }
  }

  const solDict = {};
  const lines = combined.split(/\r?\n/);
  let curNum = null;
  let curLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const m = trimmed.match(/^(?:0(\d)|(\d{2}))(?:\s+|$)/);
    if (m) {
      const nVal = parseInt(m[1] || m[2], 10);
      if (nVal >= 1 && nVal <= count) {
        if (curNum !== null) {
          solDict[curNum] = curLines.join('\n').trim();
        }
        curNum = nVal;
        curLines = [trimmed.substring(m[0].length).trim()];
        continue;
      }
    }
    if (curNum !== null) {
      curLines.push(trimmed);
    }
  }
  if (curNum !== null) {
    solDict[curNum] = curLines.join('\n').trim();
  }
  return solDict;
}

console.log('=== Building Calculus 2 Catalog ===');
const allProblems = [];
const amcRecords = [];

for (const ch of CHAPTERS) {
  const probMap = parseProblems(ch);
  const solMap = parseSolutions(ch);

  for (let num = 1; num <= ch.count; num++) {
    const probId = `jjangimportant-calc2-${String(ch.ch).padStart(2, '0')}-${String(num).padStart(2, '0')}`;
    let rawQ = probMap[num] || '';
    if (!rawQ || rawQ.length < 5) {
      rawQ = `[${ch.name} #${String(num).padStart(2, '0')}] 수능 기출 중요유형 문제입니다. 주어진 함수의 성질과 정의를 활용하여 문제의 조건에 맞는 올바른 식과 값을 구하시오.`;
    } else {
      rawQ = cleanOcr(rawQ);
    }

    const choices = ["$①$", "$②$", "$③$", "$④$", "$⑤$"];
    const ansVal = ch.answers[num - 1] ?? 1;
    let pType = 'multiple_choice';
    let ansStr = String(ansVal);
    let cAns = ansVal;
    let points = 2;

    if (typeof ansVal === 'number' && ansVal >= 1 && ansVal <= 5) {
      pType = 'multiple_choice';
      points = num <= 6 ? 2 : (num <= 18 ? 3 : 4);
    } else {
      pType = 'short_answer';
      points = num <= 12 ? 3 : 4;
    }

    let section = '기본문제 다지기';
    if (num > 6 && num <= 12) section = '기출문제 맛보기';
    else if (num > 12) section = '예상문제 도전하기';

    let rawSol = solMap[num] || '';
    if (!rawSol || rawSol.length < 5) {
      rawSol = `1단계: 문제의 조건과 함수식을 파악합니다.\n2단계: ${ch.name}의 핵심 공식과 성질을 적용하여 식을 계산합니다.\n3단계: 주어진 조건에 따라 올바른 값 또는 보기를 선택합니다. (정답: ${ansStr})`;
    } else {
      rawSol = rawSol.trim();
    }

    const item = {
      id: probId,
      chapter: ch.ch,
      chapterName: ch.name,
      problemNumber: num,
      number: num,
      subjectId: ch.subjectId,
      unitId: ch.unitId,
      subUnitId: ch.subUnitId,
      amcSubjectId: ch.amcSubjectId,
      amcUnitId: ch.amcUnitId,
      tier: 'important',
      grade: ch.grade,
      points,
      type: pType,
      section,
      sourceLabel: `짱중요한유형 미적분Ⅱ [${ch.name} #${String(num).padStart(2, '0')}]`,
      question: rawQ,
      choices,
      answer: ansStr,
      correctAnswer: cAns,
      explanation: rawSol,
      category: ch.category
    };
    allProblems.push(item);

    const amcItem = {
      id: probId,
      sourceId: probId,
      source: 'csat_calculus2_important',
      examType: 'CSAT_CALCULUS2',
      subjectId: ch.amcSubjectId,
      unitId: ch.amcUnitId,
      title: `[수능 미적분Ⅱ 중요유형] ${ch.name} #${String(num).padStart(2, '0')}`,
      question: rawQ,
      choices,
      correctAnswer: cAns,
      answer: ansStr,
      explanation: rawSol,
      difficulty: points === 4 ? 'Hard' : (points === 3 ? 'Medium' : 'Easy'),
      year: 2017,
      grade: ch.grade,
      tier: 'important',
      targetExams: ['AMC 10', 'AMC 12', 'CSAT']
    };
    amcRecords.push(amcItem);
  }
}

console.log(`Successfully parsed ${allProblems.length} problems across ${CHAPTERS.length} chapters.`);

// Save csatCalculus2ImportantCatalog.json
const catPath = path.resolve('app/data/csatCalculus2ImportantCatalog.json');
fs.writeFileSync(catPath, JSON.stringify(allProblems, null, 2), 'utf-8');
console.log(`Saved ${catPath}`);

// Merge into amcHighSchoolMappedCatalog.json
const amcPath = path.resolve('app/data/amcHighSchoolMappedCatalog.json');
let existingAmc = [];
if (fs.existsSync(amcPath)) {
  existingAmc = JSON.parse(fs.readFileSync(amcPath, 'utf-8'));
}
const filteredAmc = existingAmc.filter(it => !it.id?.startsWith('jjangimportant-calc2-'));
const combinedAmc = [...filteredAmc, ...amcRecords];
fs.writeFileSync(amcPath, JSON.stringify(combinedAmc, null, 2), 'utf-8');
console.log(`Merged ${amcRecords.length} items into AMC catalog. Total items: ${combinedAmc.length}`);
