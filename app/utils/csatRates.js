import csatRatesDb from '../data/csatRateDatabase.json';

/**
 * Normalizes exam type ('nov' | 'sept' | 'june' | 'city-mock' or Korean equivalents).
 */
export function normalizeExamType(rawType) {
  if (!rawType) return 'nov';
  const s = String(rawType).toLowerCase().trim();
  if (s === 'nov' || s.includes('수능') || s.includes('11월') || s.includes('본수능')) return 'nov';
  if (s === 'sept' || s.includes('9월') || s.includes('구월') || s.includes('september')) return 'sept';
  if (s === 'june' || s.includes('6월') || s.includes('유월') || s.includes('june')) return 'june';
  return 'nov';
}

/**
 * Normalizes variant or subject ('calculus', 'prob-stats', 'geometry', 'ga', 'na', etc.)
 */
export function normalizeVariant(rawVariant) {
  if (!rawVariant) return 'calculus';
  const s = String(rawVariant).toLowerCase().trim();
  if (s.includes('미적')) return 'calculus';
  if (s.includes('확률') || s.includes('확통')) return 'prob-stats';
  if (s.includes('기하')) return 'geometry';
  if (s.includes('가형') || s.includes('수리가')) return 'ga';
  if (s.includes('나형') || s.includes('수리나')) return 'na';
  if (s.includes('b형') || s === 'b') return 'b';
  if (s.includes('a형') || s === 'a') return 'a';
  return 'calculus';
}

/**
 * Retrieves EBSi official rate for a given question.
 * Handles both Academic Year (e.g. 2025) and Calendar Year (e.g. 2024).
 * Returns { correctRate, errorRate, choiceRatios, rank, answer, points } or null.
 */
export function getCsatRates(year, examType = 'nov', variant = '', problemNumber = 1) {
  if (!year || !problemNumber) return null;
  const num = Number(problemNumber);
  if (!Number.isFinite(num)) return null;

  const etype = normalizeExamType(examType);
  const vKey = normalizeVariant(variant);
  
  const yStr = String(year);
  const yNum = parseInt(yStr, 10);
  
  // Try candidate years: [yStr, yNum + 1, yNum - 1] to handle Academic vs Calendar year conventions
  const candidateYears = [yStr, String(yNum + 1), String(yNum - 1)];
  
  // Variant candidates: specific match first, then fallbacks
  const variantKeys = [vKey, variant, 'calculus', 'prob-stats', 'geometry', 'ga', 'na', 'b', 'a'];
  
  for (const yr of candidateYears) {
    const yrData = csatRatesDb[yr];
    if (!yrData) continue;
    const examData = yrData[etype] || yrData.nov;
    if (!examData) continue;
    
    // In 2022+ CSAT (integrating common + electives), problems 1~22 are Common (공통),
    // so their response rates are identical across calculus, prob-stats, and geometry.
    if (num <= 22) {
      for (const vk of ['calculus', 'prob-stats', 'geometry', 'ga', 'na']) {
        const paper = examData[vk];
        if (paper && paper[String(num)]) {
          return paper[String(num)];
        }
      }
    }
    
    for (const vk of variantKeys) {
      if (!vk) continue;
      const paper = examData[vk];
      if (paper && paper[String(num)]) {
        return paper[String(num)];
      }
    }
  }
  return null;
}

/**
 * Enriches a problem object with official EBSi rates if not already present.
 */
export function enrichProblemWithRates(problem, context = {}) {
  if (!problem) return problem;
  if (problem.correctRate != null && problem.errorRate != null && problem.choiceRatios != null) {
    return problem;
  }
  let year = problem.year || context.year;
  let examType = problem.examType || context.examType || 'nov';
  let variant = problem.variant || context.variant || '';
  let num = problem.problemNumber || problem.number || problem.num;

  // Extract from sourceLabel or title if missing
  const src = problem.sourceLabel || problem.title || '';
  if (!year && src) {
    const mYr = src.match(/(\d{4})학년도|\b(20\d{2})\b/);
    if (mYr) year = parseInt(mYr[1] || mYr[2], 10);
  }
  if (!num && src) {
    const mNum = src.match(/(?:#|\s)(\d{1,2})(?:번)?/);
    if (mNum) num = parseInt(mNum[1], 10);
  }
  if (src.includes('9월')) examType = 'sept';
  else if (src.includes('6월')) examType = 'june';

  // Infer elective subject if variant is generic
  if (!variant || ['공통', '홀수형', '짝수형', 'standard'].includes(variant)) {
    const sub = String(problem.subjectId || '');
    const unt = String(problem.unit || '') + String(problem.unitId || '');
    if (sub === 'prob-stats' || unt.includes('확률') || unt.includes('통계') || unt.includes('순열')) {
      variant = 'prob-stats';
    } else if (sub === 'geometry' || unt.includes('기하') || unt.includes('벡터') || unt.includes('이차곡선')) {
      variant = 'geometry';
    } else if (sub === 'calculus' || unt.includes('미적분')) {
      variant = 'calculus';
    }
  }

  const rateInfo = getCsatRates(year, examType, variant, num);
  if (!rateInfo) return problem;

  return {
    ...problem,
    correctRate: problem.correctRate ?? rateInfo.correctRate,
    errorRate: problem.errorRate ?? rateInfo.errorRate,
    choiceRatios: problem.choiceRatios ?? rateInfo.choiceRatios,
    rank: problem.rank ?? rateInfo.rank,
  };
}

/**
 * Enriches an array of problems with official EBSi rates.
 */
export function enrichProblemsListWithRates(problems, context = {}) {
  if (!Array.isArray(problems)) return problems;
  return problems.map((p) => enrichProblemWithRates(p, context));
}
