import { SiteFooter, SiteHeader, TutorBanner } from '../../components';
import CoordinatePlaneGenerator from './CoordinatePlaneGenerator';
import CoordinatePlaneIntro from './CoordinatePlaneIntro';

export const metadata = {
  title: '중등 좌표와 그래프 문제 무료 생성 | 매일 배움 연구소',
  description: '중학교 1학년 좌표평면, 사분면, 대칭인 점의 좌표, 그래프 해석 문제지를 무작위로 생성하고 인쇄할 수 있습니다.',
};

export default function CoordinatePlanePage() {
  return <><SiteHeader /><main className="worksheet-page"><CoordinatePlaneIntro /><CoordinatePlaneGenerator /><TutorBanner /></main><SiteFooter /></>;
}
