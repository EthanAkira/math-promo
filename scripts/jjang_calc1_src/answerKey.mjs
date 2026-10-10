// 정답표 (한눈에 보는 정답, 미적분 I). c = 객관식 선지 번호, s = 주관식 정수 답.
// 형식: 유형 번호 -> 문항 순서대로 나열한 토큰 ("c3" = ③, "s12" = 12).
const RAW = {
  1: 'c3 c5 c2 c1 c3 c2 c2 c4 c1 s12 c2 s12 c2 s35 c1 c3 c2 s14 s2 s110 s15 c3 c4 c2 c2 c4 c5 c2 c2 c4 c3',
  2: 'c2 c2 c5 s4 s4 c4 c4 s15 c3 c5 c3 c2 s4 c5 s4 c3 s5 c2 c3 s4',
  3: 'c5 s2 s36 s2 c5 c3 c2 c1 c3 c3 s9 s5 s16 s4 c1 c2 s18 s12 s32 s16 s19 s16 c1 c1 c1 c2 c2 c3 c5 c4 c2',
  4: 'c4 c3 c3 c1 s16 c5 c4 s4 c3 c1 c3 c2 s48 c1',
  5: 'c5 c4 c1 c3 c5 c3 c2 c3 c4 c2 c3 c3 c2 c2 c4 c5',
  6: 's2 c4 c1 c3 c2 s7 c3 c1 c1 c2 c4 c4 c5 c3 c5 c2 c3 c5 c5 c5 c1 c3 c3 c3 c1 c4 s1 c5 c2',
  7: 'c3 c1 c2 c1 c5 c2 c3 c2 c4 c3 c1 c3 c1 c2 c1 s10 c4 c4 s21 c3 c1 s2 s2 c4 c5 s1 c5 c1 s2 c5',
  8: 'c2 c5 c2 c3 c2 c4 s11 c1 c4 c3 c1 c2 s21 c4 c1 c1 c2 c3 c3 s3 s25 c3 c1 s0 c1 s10 c3 c3',
  9: 'c4 c5 s6 c3 c1 s48 c1 c4 c3 c5 s21 c3 s12 c1 c1 c1 s14 s25 s2 c2 c2 c2 s32 c5 c5 s18 c4 c1 c4 c4',
  10: 'c5 s48 c2 c2 c4 c1 s12 s12 s28 s13 s50 s2 c1 c5 s97 s21 c2 c2 s5 c4 c2 c1 c5 c3 c4 c2 c5 c1 s9 c4',
  11: 'c4 c2 c1 s8 c1 s37 c2 c4 c1 c4 c1 s3 s25 s14 c2 s22 s14 c1 s16 c5 c5 c2 c1 c5 c3 c2 c1 c2 c4 c2 c1',
  12: 'c2 c4 c3 s22 c2 c3 c4 s12 c1 c1 c4 c3 c2 c2 s33 c3 c3 c3',
  13: 'c3 c4 c1 c4 c3 c2 c2 c1 s12 c1 c5 c2 c4 c3 s25 c5 c2',
  14: 's2 s6 c5 c4 c3 s2 s35 c2 c3 c1 s25 c4 c1 c4 s20 c1 s45 c1 c2 c5 c4 s198 c2 c4 s19 c2 c3 c4 s80 c5',
  15: 'c4 c5 c4 c1 c5 c4 c3 c1 c3 s304 c3 s4 s17 s16 s40 c1 s12 s12 s19 c2 c5 s6 s10 c5 s6 c2 s3 s20 c3 c2',
  16: 'c2 c5 c1 c4 c2 c5 c2 c1 c4 c2 c3 s2 c2 c4 c3 c1 s40 c5 c4 c4 c3 s80 s20 s36 c5 c2 c5 c3',
  17: 'c3 c5 c2 c2 s7 c3 c1 s45 c5 c5 c3 c4 c1 c4 c1 s25 s4 c2 c2 c5',
};

export const EXPECTED_COUNTS = { 1: 31, 2: 20, 3: 31, 4: 14, 5: 16, 6: 29, 7: 30, 8: 28, 9: 30, 10: 30, 11: 31, 12: 18, 13: 17, 14: 30, 15: 30, 16: 28, 17: 20 };

export const ANSWER_KEY = Object.fromEntries(Object.entries(RAW).map(([type, text]) => [
  Number(type),
  text.split(/\s+/).map((tok) => (tok[0] === 'c' ? { kind: 'mc', value: Number(tok.slice(1)) } : { kind: 'short', value: Number(tok.slice(1)) })),
]));
