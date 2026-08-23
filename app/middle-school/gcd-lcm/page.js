import { SiteFooter, SiteHeader, TutorBanner } from '../../components';
import GcdLcmGenerator from './GcdLcmGenerator';
import GcdLcmIntro from './GcdLcmIntro';

export const metadata = {
  title: '중1 최대공약수와 최소공배수 문제 무료 생성 | 매일 배움 연구소',
  description: '중학교 1학년 공약수, 최대공약수, 공배수, 최소공배수와 활용 문제지를 무작위로 생성하고 인쇄할 수 있습니다.',
};

export default function GcdLcmPage() {
  return <><SiteHeader /><main className="worksheet-page"><GcdLcmIntro /><GcdLcmGenerator /><TutorBanner /></main><SiteFooter /></>;
}
