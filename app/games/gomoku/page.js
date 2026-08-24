import { SiteFooter, SiteHeader } from '../../components';
import GomokuBoard from './GomokuBoard';

export const metadata = {
  title: '오목 무료 게임 (사람 대 AI) | 매일 배움 연구소',
  description: '난이도를 고르고 AI와 대결하는 무료 온라인 오목. 흑/백 선택, 무르기를 지원합니다.',
};

export default function GomokuPage() {
  return <><SiteHeader /><main className="game-page">
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 18 }}><a href="/">홈</a> / <a href="/games.html">쉬어가는 코너</a> / 오목</p>
    <GomokuBoard />
  </main><SiteFooter /></>;
}
