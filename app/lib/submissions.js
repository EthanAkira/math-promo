// 로그인한 유저가 채점 버튼을 누른 시점에 문제 풀이 결과를 D1에 기록한다.
// 비로그인 사용자는 호출하지 않으며(기존 즉석 채점 그대로 동작), 실패해도 채점 UI를 막지 않도록
// 항상 조용히 무시한다.
export function recordAttempts(user, entries) {
  if (!user || !entries || entries.length === 0) return;
  fetch('/api/submissions/record', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entries }),
  }).catch(() => {});
}

// 부모/선생님 진도관리(B 시스템)용: 이 기기가 학생 연결 코드로 연결돼 있으면(student_device 쿠키)
// 같은 채점 결과를 answer_events로도 올려 부모 리포트에 반영한다.
// 기기가 연결돼 있지 않은 일반 방문자는 서버가 401을 돌려주는데, recordAttempts와 마찬가지로
// 채점 UI에는 아무 영향도 주지 않도록 항상 조용히 무시한다.
export function syncAnswerEvents(entries) {
  if (!entries || entries.length === 0) return;
  fetch('/api/sync/answer-events', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      events: entries.map((entry) => ({
        grade: entry.grade,
        unit: entry.unit,
        isCorrect: entry.isCorrect,
      })),
    }),
  }).catch(() => {});
}
