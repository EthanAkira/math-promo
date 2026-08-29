import { SiteFooter, SiteHeader, TutorBanner } from '../../components';
import PreAlgebraGenerator from './PreAlgebraGenerator';
import PreAlgebraIntro from './PreAlgebraIntro';

export const metadata = {
  title: '중·고등 수학 (2022 개정) · Pre-Algebra · Algebra 1·2 · Precalculus 문제 생성기 | 매일 배움 연구소',
  description: '2022 개정 교육과정(중1~3, 공통수학1·2, 대수, 미적분Ⅰ·Ⅱ, 확률과 통계, 기하) 및 국제학교 과정(Pre-Algebra, Algebra 1·2, Precalculus)의 수학 문제와 정답·해설을 자동 생성합니다.',
};

export default function PreAlgebraPage() {
  return <>
    <SiteHeader />
    <main className="worksheet-page">
      <PreAlgebraIntro />
      <PreAlgebraGenerator />
      <TutorBanner />
    </main>
    <SiteFooter />
  </>;
}
