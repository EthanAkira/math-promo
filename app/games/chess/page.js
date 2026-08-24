import { SiteFooter, SiteHeader } from '../../components';
import ChessBoard from './ChessBoard';

export const metadata = {
  title: '체스 무료 게임 (사람 대 AI) | 매일 배움 연구소',
  description: '난이도를 고르고 AI와 대결하는 무료 온라인 체스. 캐슬링, 앙파상, 프로모션을 지원합니다.',
};

export default function ChessPage() {
  return <><SiteHeader /><main className="game-page">
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 18 }}><a href="/">홈</a> / <a href="/games">쉬어가는 코너</a> / 체스</p>
    <ChessBoard />
  </main><SiteFooter /></>;
}
