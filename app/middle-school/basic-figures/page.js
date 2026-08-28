import { SiteFooter, SiteHeader, TutorBanner } from '../../components';
import BasicFiguresGenerator from './BasicFiguresGenerator';
import BasicFiguresIntro from './BasicFiguresIntro';

export const metadata = {
  title: 'G12·AMC12·수능 도형 기하 문제 생성기 | 매일 배움 연구소',
  description: '중등 기본 도형부터 삼각법, 고급 원, 이차곡선, 벡터, 공간좌표, 미적분·통계 시각화까지 문제와 SVG를 자동 생성합니다.',
};

export default function BasicFiguresPage() {
  return <><SiteHeader /><main className="worksheet-page"><BasicFiguresIntro /><BasicFiguresGenerator /><TutorBanner /></main><SiteFooter /></>;
}
