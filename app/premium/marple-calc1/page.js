import { SiteFooter, SiteHeader } from '../../components';
import MarpleCalc1Premium from './MarpleCalc1Premium';

export const metadata = {
  title: '마플 수능기출 미적분Ⅰ 유형별 문제집 | 매일 배움 연구소',
  description: '수열의 극한·함수의 극한과 연속·미분·적분 19개 유형별 수능·평가원·교육청 기출과 사관학교·경찰대 고난도 기출, 풀이 이미지, 유사문제 생성기를 제공하는 유료 콘텐츠입니다.',
};

export default function MarpleCalc1PremiumPage() {
  return <><SiteHeader /><main style={{ maxWidth: 980, margin: '0 auto', padding: '36px 20px 72px' }}>
    <MarpleCalc1Premium />
  </main><SiteFooter /></>;
}
