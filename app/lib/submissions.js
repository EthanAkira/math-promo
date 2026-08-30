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
