import { jsonResponse, CORS_HEADERS } from '../auth/_shared.js';
import { getSessionGuardian, getGuardianLink } from '../guardian/_shared.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_SAMPLES_FOR_WEAK_UNIT = 5;

function accuracy(correct, total) {
  return total > 0 ? Math.round((correct / total) * 1000) / 10 : null; // 소수점 1자리 %
}

// 부모 또는 선생님(guardian_links로 연결된 사람만)이 자동 집계 리포트를 조회.
// query: ?studentId=xxx
export async function onRequestGet({ request, env }) {
  if (!env.DB) return jsonResponse({ error: 'Guardian auth is not configured.' }, { status: 500 });

  const guardian = await getSessionGuardian(env.DB, request);
  if (!guardian) return jsonResponse({ error: 'Not authenticated.' }, { status: 401 });

  const url = new URL(request.url);
  const studentId = url.searchParams.get('studentId');
  if (!studentId) return jsonResponse({ error: 'studentId is required.' }, { status: 400 });

  const link = await getGuardianLink(env.DB, guardian.id, studentId);
  if (!link) return jsonResponse({ error: 'You are not linked to this student.' }, { status: 403 });

  const now = Date.now();
  const thisWeekStart = now - 7 * DAY_MS;
  const lastWeekStart = now - 14 * DAY_MS;
  const trendWindowStart = now - 30 * DAY_MS; // 취약 단원 판단은 최근 30일 기준(샘플 수 확보)

  const [thisWeek, lastWeek, weakUnits, studyTime, recentFeedback] = await Promise.all([
    env.DB.prepare(
      `SELECT COUNT(*) AS total, SUM(is_correct) AS correct FROM answer_events WHERE student_id = ? AND occurred_at >= ?`
    ).bind(studentId, thisWeekStart).first(),
    env.DB.prepare(
      `SELECT COUNT(*) AS total, SUM(is_correct) AS correct FROM answer_events
       WHERE student_id = ? AND occurred_at >= ? AND occurred_at < ?`
    ).bind(studentId, lastWeekStart, thisWeekStart).first(),
    env.DB.prepare(
      `SELECT unit, COUNT(*) AS total, SUM(is_correct) AS correct FROM answer_events
       WHERE student_id = ? AND occurred_at >= ? AND unit IS NOT NULL
       GROUP BY unit HAVING total >= ?
       ORDER BY (CAST(correct AS REAL) / total) ASC LIMIT 3`
    ).bind(studentId, trendWindowStart, MIN_SAMPLES_FOR_WEAK_UNIT).all(),
    env.DB.prepare(
      `SELECT COUNT(*) AS sessionCount, SUM(COALESCE(ended_at, started_at) - started_at) AS totalMs,
              SUM(problems_solved) AS totalProblems
       FROM study_sessions WHERE student_id = ? AND started_at >= ?`
    ).bind(studentId, thisWeekStart).first(),
    env.DB.prepare(
      `SELECT guardian_feedback.comment AS comment, guardian_feedback.created_at AS created_at,
              guardians.name AS guardian_name, guardian_links.role AS role
       FROM guardian_feedback
       JOIN guardians ON guardians.id = guardian_feedback.guardian_id
       LEFT JOIN guardian_links ON guardian_links.guardian_id = guardian_feedback.guardian_id
                                AND guardian_links.student_id = guardian_feedback.student_id
       WHERE guardian_feedback.student_id = ?
       ORDER BY guardian_feedback.created_at DESC LIMIT 5`
    ).bind(studentId).all(),
  ]);

  return jsonResponse({
    ok: true,
    period: { thisWeekStart, lastWeekStart, now },
    progress: {
      thisWeek: { total: thisWeek.total || 0, correct: thisWeek.correct || 0, accuracy: accuracy(thisWeek.correct || 0, thisWeek.total || 0) },
      lastWeek: { total: lastWeek.total || 0, correct: lastWeek.correct || 0, accuracy: accuracy(lastWeek.correct || 0, lastWeek.total || 0) },
    },
    weakUnits: (weakUnits.results || []).map((r) => ({
      unit: r.unit,
      total: r.total,
      correct: r.correct,
      accuracy: accuracy(r.correct, r.total),
    })),
    studyTime: {
      sessionCount: studyTime.sessionCount || 0,
      totalMinutes: studyTime.totalMs ? Math.round(studyTime.totalMs / 60000) : 0,
      totalProblems: studyTime.totalProblems || 0,
    },
    recentFeedback: (recentFeedback.results || []).map((r) => ({
      comment: r.comment,
      createdAt: r.created_at,
      guardianName: r.guardian_name,
      role: r.role,
    })),
  });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
