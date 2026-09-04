import { SiteFooter, SiteHeader } from '../../components';
import CsatUnitBrowser from './CsatUnitBrowser';

export const metadata = {
  title: '수능 단원별 기출문제 | 매일 배움 연구소',
  description: '수학Ⅰ, 수학Ⅱ, 확률과 통계, 미적분, 기하 등 수능 출제 범위 단원별로 기출문제와 해설을 모아 확인하세요.',
};

export default function CsatUnitsPage() {
  return <><SiteHeader /><main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px 64px' }}>
    <CsatUnitBrowser />
  </main><SiteFooter /></>;
}
