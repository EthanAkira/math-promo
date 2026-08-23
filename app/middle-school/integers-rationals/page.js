import { SiteFooter, SiteHeader, TutorBanner } from '../../components';
import IntegerRationalGenerator from './IntegerRationalGenerator';
import IntegerRationalIntro from './IntegerRationalIntro';

export const metadata = {
  title: '중1 정수와 유리수 문제 무료 생성 | 매일 배움 연구소',
  description: '중학교 1학년 양수와 음수, 정수와 유리수, 수직선, 절댓값, 대소관계와 부등호 문제지를 무작위로 생성하고 인쇄할 수 있습니다.',
};

export default function IntegerRationalPage() {
  return <><SiteHeader /><main className="worksheet-page"><IntegerRationalIntro /><IntegerRationalGenerator /><TutorBanner /></main><SiteFooter /></>;
}
