import { SiteFooter, SiteHeader, TutorBanner } from '../../components';
import AlgebraBasicsGenerator from './AlgebraBasicsGenerator';
import AlgebraBasicsIntro from './AlgebraBasicsIntro';

export const metadata = {
  title: '중등 문자와 식·일차방정식 문제 생성 | 매일 배움 연구소',
  description: '중학교 1학년 문자와 식, 일차방정식과 활용 문제를 유형별로 자동 생성합니다.',
};

export default function AlgebraBasicsPage() {
  return <>
    <SiteHeader />
    <main className="worksheet-page">
      <AlgebraBasicsIntro />
      <AlgebraBasicsGenerator />
      <TutorBanner />
    </main>
    <SiteFooter />
  </>;
}
