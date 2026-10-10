import { SiteFooter, SiteHeader } from '../../components';
import Calculus1Premium from './Calculus1Premium';

export const metadata = {
  title: '미적분 유형별 기출·응용 문제 | 매일 배움 연구소',
  description: '수학Ⅱ·미적분 17개 유형별 수능·모의평가 기출문제와 응용·예상문제, 해설, 그리고 유사문제 생성기를 제공하는 유료 콘텐츠입니다.',
};

export default function Calculus1PremiumPage() {
  return <><SiteHeader /><main style={{ maxWidth: 980, margin: '0 auto', padding: '36px 20px 72px' }}>
    <Calculus1Premium />
  </main><SiteFooter /></>;
}
