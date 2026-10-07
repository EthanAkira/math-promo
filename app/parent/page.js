import { SiteHeader, SiteFooter } from '../components';
import ParentDashboard from './ParentDashboard';

export const metadata = {
  title: '부모님/선생님 리포트 | 매일 배움 연구소',
  description: '전화번호로 로그인해서 자녀의 학습 진도, 취약 단원, 학습 시간을 확인하고 선생님을 초대하세요.',
};

export default function ParentPage() {
  return (
    <>
      <SiteHeader />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 64px' }}>
        <ParentDashboard />
      </main>
      <SiteFooter />
    </>
  );
}
