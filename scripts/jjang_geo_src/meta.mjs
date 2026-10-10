// 유형 목록, 구간(기본/기출/예상) 경계, 기출 출처, 해설 쪽 연결.
export const TYPES = {
  1: { id: 'jg-parabola', name: '포물선', unit: 'conic-sections', grade: 'g3' },
  2: { id: 'jg-ellipse', name: '타원', unit: 'conic-sections', grade: 'g3' },
  3: { id: 'jg-hyperbola', name: '쌍곡선', unit: 'conic-sections', grade: 'g3' },
  4: { id: 'jg-implicit-param', name: '음함수·매개변수로 나타낸 함수의 미분', unit: 'advanced-differentiation', grade: 'g3b' },
  5: { id: 'jg-conic-tangent', name: '이차곡선의 접선', unit: 'conic-sections', grade: 'g3' },
  6: { id: 'jg-vector-ops', name: '평면벡터의 뜻과 연산', unit: 'plane-vectors', grade: 'g3' },
  7: { id: 'jg-vector-dot', name: '평면벡터의 성분과 내적', unit: 'plane-vectors', grade: 'g3' },
  8: { id: 'jg-vector-eq', name: '평면벡터의 도형의 방정식', unit: 'plane-vectors', grade: 'g3' },
  9: { id: 'jg-velocity', name: '속도와 가속도', unit: 'advanced-differentiation', grade: 'g3b' },
  10: { id: 'jg-three-perp', name: '삼수선의 정리', unit: 'space-geometry', grade: 'g3b' },
  11: { id: 'jg-projection', name: '정사영', unit: 'space-geometry', grade: 'g3b' },
  12: { id: 'jg-space-coord', name: '공간좌표', unit: 'space-geometry', grade: 'g3b' },
  13: { id: 'jg-sphere', name: '구의 방정식', unit: 'space-geometry', grade: 'g3b' },
  14: { id: 'jg-space-vector', name: '공간벡터의 성분과 내적', unit: 'space-geometry', grade: 'g3b' },
  15: { id: 'jg-line', name: '직선의 방정식', unit: 'space-geometry', grade: 'g3b' },
  16: { id: 'jg-plane', name: '평면의 방정식', unit: 'space-geometry', grade: 'g3b' },
  17: { id: 'jg-point-plane', name: '점과 평면 사이의 거리', unit: 'space-geometry', grade: 'g3b' },
};

// 기출 시작 번호, 예상 시작 번호 (기본은 그 앞)
export const BOUNDS = {
  1: [9, 17], 2: [7, 19], 3: [10, 20], 4: [7, 14], 5: [7, 25], 6: [8, 11], 7: [10, 25], 8: [8, 14], 9: [7, 13],
  10: [8, 19], 11: [9, 20], 12: [10, 23], 13: [10, 20], 14: [13, 22], 15: [12, 18], 16: [7, 24], 17: [7, 16],
};

const K = { s: '수능', m: '모의평가', e: '교육청', p: '예비시행' };
const parse = (text) => Object.fromEntries(text.trim().split(/\s+/).map((tok) => {
  const [n, rest] = tok.split(':');
  return [Number(n), `${rest.slice(0, rest.length - 1).replace(/^(\d{2})$/, '$1')}학년도 ${K[rest[rest.length - 1]]}`];
}));
// "번호:연도+구분" (구분: s 수능, m 모의평가, e 교육청, p 예비시행). 연도는 4자리 (예: 2015s)
const P = (text) => Object.fromEntries(text.trim().split(/\s+/).map((tok) => {
  const [n, rest] = tok.split(':');
  const year = rest.slice(0, 4); const kind = K[rest[4]];
  return [Number(n), `${year}학년도 ${kind}`];
}));
void parse;

export const SOURCES = {
  1: P('9:2015s 10:2017m 11:2013m 12:2011s 13:2013m 14:2014p 15:2013s 16:2015m'),
  2: P('7:2017m 8:2012s 9:2017m 10:2014m 11:2016m 12:2012m 13:2014s 14:2013m 15:2011m 16:2016s 17:2015s 18:2015m'),
  3: P('10:2013m 11:2008s 12:2015m 13:2017m 14:2014m 15:2006s 16:2017s 17:2007m 18:2016m 19:2016m'),
  4: P('7:2000s 8:2011e 9:2007m 10:2011s 11:2016m 12:2017m 13:2011e'),
  5: P('7:2016s 8:2010s 9:2012s 10:2017m 11:2016m 12:2017s 13:2015m 14:2013s 15:2009m 16:2012m 17:2009s 18:2006m 19:2013m 20:2011m 21:2011s 22:2014m 23:2014m 24:2014s'),
  6: P('8:2012s 9:2017m 10:2007s'),
  7: P('10:2017m 11:2016m 12:2014p 13:2000s 14:2005m 15:1997s 16:2014m 17:2012m 18:2017m 19:2015m 20:2009m 21:2013s 22:2011s 23:2010s 24:2011m'),
  8: P('8:2017m 9:2004m 10:1995s 11:2004s 12:2004e 13:2005p'),
  9: P('7:2017s 8:2011e 9:2008m 10:2010s 11:2008s 12:2008m'),
  10: P('8:2015s 9:2010m 10:2015m 11:2006m 12:2004m 13:2010s 14:2016s 15:2004s 16:2017m 17:2013s 18:2011m'),
  11: P('9:2005s 10:2016m 11:2013m 12:2009m 13:2007m 14:2011s 15:2008m 16:2010m 17:2012m 18:2009m 19:2012s'),
  12: P('10:2016m 11:2011s 12:2008s 13:2007m 14:2012s 15:2014s 16:2013s 17:2015s 18:2017s 19:2011m 20:2016s 21:2006m 22:2008m'),
  13: P('10:2014s 11:2006s 12:2005m 13:2005p 14:2009m 15:2010s 16:2013m 17:2008m 18:2015s 19:2006s'),
  14: P('13:2001s 14:2002s 15:2017s 16:2009s 17:2007m 18:2007s 19:2006m 20:2017s 21:2008s'),
  15: P('12:2011m 13:2014s 14:2015s 15:2014m 16:2005s 17:2012m'),
  16: P('7:2010s 8:2015m 9:2017s 10:2008m 11:2006m 12:2017m 13:1996s 14:2005s 15:2014m 16:2007s 17:2014p 18:2006s 19:1998s 20:2005m 21:2012s 22:2007s 23:2016m'),
  17: P('7:1999s 8:2017s 9:1997s 10:2005s 11:2002s 12:2013s 13:2011s 14:2009s 15:2008s'),
};

// 문제 PDF 쪽(idx) -> 해설 PDF 인쇄 쪽 (쪽 상단 "정답 및 풀이 NN쪽" 안내. 안내가 없는 쪽은 짝쪽의 안내를 따른다)
const HDR = { 2: 70, 3: 68, 5: 67, 7: 64, 9: 62, 11: 62, 13: 59, 15: 57, 17: 57, 19: 54, 21: 52, 23: 52, 25: 49, 27: 47, 29: 47, 31: 45, 33: 44, 35: 43, 37: 41, 39: 39, 41: 38, 43: 38, 45: 35, 47: 34, 49: 33, 51: 31, 53: 31, 55: 29, 57: 28, 59: 26, 61: 25, 63: 24, 65: 22, 67: 22, 69: 19, 71: 17, 73: 16, 76: 15, 77: 13, 79: 13, 81: 11, 83: 9, 85: 9, 87: 7, 89: 5, 91: 4, 93: 3, 95: 1, 97: 1 };
export function solPageForIdx(idx) {
  if (HDR[idx] !== undefined) return HDR[idx];
  const partner = idx % 2 === 0 ? idx + 1 : idx - 1;
  return HDR[partner] ?? null;
}
