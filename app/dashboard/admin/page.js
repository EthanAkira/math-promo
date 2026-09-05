import { SiteFooter, SiteHeader } from '../../components';
import DashboardAdmin from './DashboardAdmin';

export const metadata = {
  title: '학생 학습 통계 관리자 | 매일 배움 연구소',
  description: '관리자(선생님)가 전체 학생의 단원별 정답률을 확인하는 페이지입니다.',
};

export default function DashboardAdminPage() {
  return <><SiteHeader /><main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 64px' }}>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">홈</a> / <a href="/dashboard">내 학습 통계</a> / 관리자</p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>학생 학습 통계 관리자</h1>
    <DashboardAdmin />
  </main><SiteFooter /></>;
}
