import { SiteFooter, SiteHeader } from '../../components';
import YutnoriGame from './YutnoriGame';

export const metadata = {
  title: '윷놀이 무료 게임 (사람 대 AI) | 매일 배움 연구소',
  description: '컴퓨터와 겨루는 전통 윷놀이. 시작 전 놀이의 의의와 규칙, 윷놀이 속 수학을 간단히 알아보세요. 언어를 바꾸면 설명과 게임 화면도 함께 바뀝니다.',
};

export default function YutnoriPage() {
  return <><SiteHeader /><main className="game-page">
    <YutnoriGame />
  </main><SiteFooter /></>;
}
