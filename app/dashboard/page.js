import { SiteFooter, SiteHeader } from '../components';
import DashboardClient from './DashboardClient';

export const metadata = {
  title: '내 학습 통계 | 매일 배움 연구소',
  description: '로그인 후 단원별 정답률을 확인할 수 있는 개인 학습 대시보드입니다.',
};

export default function DashboardPage() {
  return <><SiteHeader /><main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px 64px' }}>
    <DashboardClient />
  </main><SiteFooter /></>;
}
