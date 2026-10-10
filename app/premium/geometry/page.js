import { SiteFooter, SiteHeader } from '../../components';
import GeometryPremium from './GeometryPremium';

export const metadata = {
  title: '기하와 벡터 유형별 기출·응용 문제 | 매일 배움 연구소',
  description: '이차곡선·평면벡터·공간도형과 공간좌표 17개 유형별 수능·모의평가 기출문제와 응용·예상문제, 해설, 유사문제 생성기를 제공하는 유료 콘텐츠입니다.',
};

export default function GeometryPremiumPage() {
  return <><SiteHeader /><main style={{ maxWidth: 980, margin: '0 auto', padding: '36px 20px 72px' }}>
    <GeometryPremium />
  </main><SiteFooter /></>;
}
