import { SiteFooter, SiteHeader } from '../../components';
import JanggiGame from './JanggiGame';

export const metadata = {
  title: '한국 장기 무료 게임 (사람 대 AI) | 매일 배움 연구소',
  description: '난이도를 고르고 AI와 대결하는 무료 온라인 한국 장기(장기). 궁성 대각선, 포의 넘기 규칙까지 정확히 구현했고 규칙 튜토리얼도 포함되어 있습니다.',
};

export default function JanggiPage() {
  return <><SiteHeader /><main className="game-page">
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 18 }}><a href="/">홈</a> / <a href="/games.html">쉬어가는 코너</a> / 장기</p>
    <JanggiGame />
  </main><SiteFooter /></>;
}
