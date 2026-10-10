export const CODING_TRACKS = [
  { id: 'python', icon: '🐍', ko: 'Python', en: 'Python', descKo: '문법 기초부터 자료구조, 알고리즘, 데이터 처리까지 파이썬으로 배웁니다.', descEn: 'From syntax basics to data structures, algorithms and data handling in Python.' },
  { id: 'java', icon: '☕', ko: 'Java', en: 'Java', descKo: '객체지향 프로그래밍과 AP Computer Science A 대비 문제를 다룹니다.', descEn: 'Object-oriented programming and AP Computer Science A practice in Java.' },
  { id: 'stats', icon: '📊', ko: '통계학 기초', en: 'Statistics Basics', descKo: '기술통계, 확률분포, 추정과 검정 등 데이터 사이언스의 수학적 토대입니다.', descEn: 'Descriptive statistics, distributions, estimation and testing — the math behind data science.' },
  { id: 'r', icon: '📈', ko: 'R', en: 'R', descKo: '통계 분석과 데이터 시각화를 위한 R 언어 자료입니다.', descEn: 'R language resources for statistical analysis and data visualization.' },
  { id: 'c', icon: '⚙️', ko: 'C', en: 'C', descKo: '메모리와 포인터, 자료구조 등 컴퓨터 구조에 가까운 C 언어 기초입니다.', descEn: 'C fundamentals: memory, pointers and data structures close to the machine.' },
];

export const trackById = (id) => CODING_TRACKS.find((t) => t.id === id);
