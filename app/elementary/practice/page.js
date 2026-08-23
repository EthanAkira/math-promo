import { SiteHeader, TutorBanner, SiteFooter } from '../../components';
import PracticeGenerator from './PracticeGenerator';
import PracticeIntro from './PracticeIntro';

export const metadata = {
  title: '초등 1~6학년 수학 문제 무료 생성 | 매일 배움 연구소',
  description: '초등학교 1~6학년 사칙연산, 분수, 소수, 약수와 배수, 비율 문제지를 무작위로 생성하고 인쇄할 수 있습니다.',
};

export default function ElementaryPracticePage() {
  return <><SiteHeader /><main className="worksheet-page">
    <PracticeIntro />
    <PracticeGenerator />
    <TutorBanner />
  </main><SiteFooter /></>;
}
