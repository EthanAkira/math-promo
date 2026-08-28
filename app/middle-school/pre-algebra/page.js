import { SiteFooter, SiteHeader, TutorBanner } from '../../components';
import PreAlgebraGenerator from './PreAlgebraGenerator';
import PreAlgebraIntro from './PreAlgebraIntro';

export const metadata = {
  title: '중1·중2·중3·고1·Algebra 1·2 문제 생성기 | 매일 배움 연구소',
  description: '한국 중1·2·3·고1과 Pre-Algebra·Algebra 1·2의 대수 문제, 함수 그래프, 통계표, 정답과 해설을 자동 생성합니다.',
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
