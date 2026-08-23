import { SiteFooter, SiteHeader, TutorBanner } from '../../components';
import PrimeFactorizationGenerator from './PrimeFactorizationGenerator';
import PrimeFactorizationIntro from './PrimeFactorizationIntro';

export const metadata = {
  title: '중1 소인수분해 문제 무료 생성 | 매일 배움 연구소',
  description: '중학교 1학년 소수와 합성수, 거듭제곱, 소인수분해, 약수와 약수의 개수 문제지를 무작위로 생성하고 인쇄할 수 있습니다.',
};

export default function PrimeFactorizationPage() {
  return <><SiteHeader /><main className="worksheet-page"><PrimeFactorizationIntro /><PrimeFactorizationGenerator /><TutorBanner /></main><SiteFooter /></>;
}
