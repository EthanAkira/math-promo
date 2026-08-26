import { SiteFooter, SiteHeader, TutorBanner } from '../../components';
import BasicFiguresGenerator from './BasicFiguresGenerator';
import BasicFiguresIntro from './BasicFiguresIntro';

export const metadata = {
  title: '중1 기본 도형 문제 무료 생성 | 매일 배움 연구소',
  description: '중학교 1학년 점·선·면, 두 점 사이의 거리와 중점, 각의 분류, 맞꼭지각, 수직과 수선 문제지를 무작위로 생성하고 인쇄할 수 있습니다.',
};

export default function BasicFiguresPage() {
  return <><SiteHeader /><main className="worksheet-page"><BasicFiguresIntro /><BasicFiguresGenerator /><TutorBanner /></main><SiteFooter /></>;
}
