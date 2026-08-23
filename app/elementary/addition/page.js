import { SiteHeader, TutorBanner, SiteFooter } from '../../components';
import Generator from './Generator';

export const metadata = {
  title: '초등 덧셈 문제 무료 생성 | 매일 배움 연구소',
  description:
    '초등학교 1학년부터 4학년까지 난이도별 덧셈 문제를 무료로 자동 생성합니다. 회원가입 없이 바로 풀고 채점해보세요.',
};

export default function AdditionPage() {
  return (
    <>
      <SiteHeader />
      <main className="worksheet-page">
        <p
          style={{
            fontSize: 13,
            color: 'var(--ink-soft)',
            marginBottom: 6,
          }}
        >
          <a href="/" style={{ color: 'var(--ink-soft)' }}>
            홈
          </a>{' '}
          / 초등 / 덧셈
        </p>
        <h1
          className="font-display"
          style={{ fontSize: 26, margin: '0 0 8px' }}
        >
          초등 덧셈 문제
        </h1>
        <p className="no-print" style={{ color: 'var(--ink-soft)', margin: '0 0 28px' }}>
          문제지 번호와 QR이 함께 만들어집니다. 태블릿에서 풀거나 A4로 인쇄해 사용하세요.
        </p>

        <Generator />

        <TutorBanner />
      </main>
      <SiteFooter />
    </>
  );
}
