import { SiteFooter, SiteHeader } from '../../components';
import SudokuBoard from './SudokuBoard';

export const metadata = {
  title: '스도쿠 무료 게임 | 매일 배움 연구소',
  description: '난이도를 고르고 즐기는 무료 온라인 스도쿠. 메모, 힌트, 자동 채점을 지원합니다.',
};

export default function SudokuPage() {
  return <><SiteHeader /><main className="game-page">
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 18 }}><a href="/">홈</a> / <a href="/games">쉬어가는 코너</a> / 스도쿠</p>
    <SudokuBoard />
  </main><SiteFooter /></>;
}
