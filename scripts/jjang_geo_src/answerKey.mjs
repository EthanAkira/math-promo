// 한눈에 보는 정답 [기하와 벡터]. c = 객관식 선지 번호, s = 주관식 정수 답.
const RAW = {
  1: 'c4 s60 c4 c5 c4 c5 s12 c5 c1 s136 c5 c3 s128 s13 c1 s5 c3 c2 s25 c3 c3 c5 c4',
  2: 's92 c1 c5 c2 s18 c2 s6 c3 s22 c4 c4 c4 s105 s180 s103 s104 s12 c2 c3 c3 c4 s32 c2 c3 s80 c3',
  3: 'c3 c4 s6 c3 c5 c4 s6 c5 c2 c4 s13 s19 c3 c1 c1 s12 c3 c4 c5 c3 c2 c1 s9 c4 c3',
  4: 'c4 c3 c3 c3 c2 c2 c1 c1 c1 c5 s6 c1 c2 c5 c4 s2 c1 s3 c1 c1 s25 c2 c2 c5 c5',
  5: 'c3 c1 c1 c4 c5 c5 c3 c2 s12 c1 c2 c1 c1 c1 s32 s52 s17 c4 c1 c4 c4 c2 s15 c4 c1 c1 s55 c3 s16 s13',
  6: 'c1 s4 c4 c5 c2 c2 c2 c3 c5 s15 c1 c1 c3 c5 c5 c3 c5 c5 c3',
  7: 'c4 c5 s3 c3 c2 c4 c2 c2 c4 s8 c5 s5 c5 c3 c3 c3 c1 c2 c2 c2 s7 s17 c5 c5 c1 c2 c2 s2 c3 s45',
  8: 'c4 c3 c1 c4 c5 c2 s3 c5 c1 c3 c1 c1 s10 s9 s1 c3 c1 c4 c3 c4',
  9: 'c4 c3 c4 c1 c2 c1 c3 s14 c4 s64 s78 c2 s10 c3 c3 c3 c4 c3',
  10: 'c1 c3 c3 c5 c5 c3 c3 c1 c2 c5 c1 s20 c2 s15 c1 s12 s40 s30 c3 c4 c2 c2 c5 c4 c4 c5',
  11: 'c3 c5 c4 c2 s18 c5 c4 c3 c5 s162 c2 s30 s34 c5 s15 c3 s45 s25 s32 c2 c4 c3 c4 s36 s24 c3 c3 c3 c4',
  12: 'c2 c4 c5 c2 c4 c1 c4 c4 c1 c4 c1 c2 c2 s13 c5 c3 c4 c5 s10 c4 c1 c2 c2 c5 c4 c2 c4 c5 c1 c3',
  13: 's14 c5 c2 c3 s16 c5 s12 c5 s10 c2 c3 s24 s20 c5 s20 s13 s11 s9 s84 c4 c5 s625 s12 c3 c3 c2 s72 s21',
  14: 'c3 c3 c1 c5 c4 c2 c4 c4 c5 c2 c5 c4 s12 c5 c2 s12 s12 s43 s12 s19 s11 c1 s4 c4 c3 c4 c2 c4 c3 s18',
  15: 'c3 c1 c2 c2 c4 c3 c2 c3 c3 s18 c1 c4 c1 c2 c4 s12 c2 c1 c5 c2 c5 c2 c3 c2 c4 c2 c3 s33 c3',
  16: 'c4 c3 c4 c4 c2 c1 s15 s10 c4 c4 c2 c2 c3 c4 s7 s18 s30 s27 s36 c4 c1 s216 s40 c1 c2 c1 c5 c1 c4',
  17: 'c2 c5 c3 c5 c4 c1 s10 s16 c2 c3 c2 c2 s53 s15 c1 c3 s9 s7 c1 c2 c3 c3 s49 s60',
};

export const EXPECTED_COUNTS = { 1: 23, 2: 26, 3: 25, 4: 25, 5: 30, 6: 19, 7: 30, 8: 20, 9: 18, 10: 26, 11: 29, 12: 30, 13: 28, 14: 30, 15: 29, 16: 29, 17: 24 };

export const ANSWER_KEY = Object.fromEntries(Object.entries(RAW).map(([type, text]) => [
  Number(type),
  text.split(/\s+/).map((tok) => (tok[0] === 'c' ? { kind: 'mc', value: Number(tok.slice(1)) } : { kind: 'short', value: Number(tok.slice(1)) })),
]));
