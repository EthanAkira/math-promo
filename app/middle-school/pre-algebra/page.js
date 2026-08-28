import { SiteFooter, SiteHeader, TutorBanner } from '../../components';
import PreAlgebraGenerator from './PreAlgebraGenerator';
import PreAlgebraIntro from './PreAlgebraIntro';

export const metadata = {
  title: 'Pre-Algebra·한국 중1 수학 문제 생성기 | 매일 배움 연구소',
  description: 'Pre-Algebra와 한국 중학교 1학년 비기하 전 범위의 문제, 수직선, 좌표 그래프, 통계표, 정답과 해설을 자동 생성합니다.',
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
