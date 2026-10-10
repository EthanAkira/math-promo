import { SiteFooter, SiteHeader } from '../components';
import MathHub from './MathHub';

export const metadata = {
  title: '수학 영역 | 매일 배움 연구소',
  description: 'AMC 8/10/12 경시대회, 수능·평가원 기출, 중등 Pre-Algebra & 기본도형, 초등 사고력 연산을 한 곳에서 고를 수 있습니다.',
};

export default function MathPage() {
  return <><SiteHeader /><main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px 64px' }}>
    <MathHub />
  </main><SiteFooter /></>;
}
