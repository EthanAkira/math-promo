import { SiteFooter, SiteHeader, TutorBanner } from '../../components';
import ProportionGenerator from './ProportionGenerator';
import ProportionIntro from './ProportionIntro';

export const metadata = {
  title: '중등 정비례와 반비례 문제 무료 생성 | 매일 배움 연구소',
  description: '중학교 1학년 정비례, 반비례 관계식과 그래프, 활용 문제지를 무작위로 생성하고 인쇄할 수 있습니다.',
};

export default function ProportionPage() {
  return <><SiteHeader /><main className="worksheet-page"><ProportionIntro /><ProportionGenerator /><TutorBanner /></main><SiteFooter /></>;
}
