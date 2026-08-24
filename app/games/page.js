import { SiteFooter, SiteHeader } from '../components';
import GamesHub from './GamesHub';

export const metadata = {
  title: '쉬어가는 코너 | 매일 배움 연구소',
  description: '스도쿠, 오목, 체스, 윷놀이를 무료로 즐기는 쉬어가는 코너. 난이도를 골라 AI와 대결하거나 혼자 퍼즐을 풀어보세요.',
};

export default function GamesPage() {
  return <><SiteHeader /><main style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px' }}>
    <GamesHub />
  </main><SiteFooter /></>;
}
