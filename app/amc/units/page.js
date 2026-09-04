import { SiteFooter, SiteHeader } from '../../components';
import AmcUnitBrowser from './AmcUnitBrowser';

export const metadata = {
  title: 'AMC 단원별 기출문제 | 매일 배움 연구소',
  description: '대수, 기하, 정수론, 조합과 확률 등 AMC 출제 범위 단원별로 기출문제와 해설을 모아 확인하세요.',
};

export default function AmcUnitsPage() {
  return <><SiteHeader /><main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px 64px' }}>
    <AmcUnitBrowser />
  </main><SiteFooter /></>;
}
