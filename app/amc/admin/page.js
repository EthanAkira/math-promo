import { SiteFooter, SiteHeader } from '../../components';
import AmcAdmin from './AmcAdmin';

export const metadata = {
  title: 'AMC 자료 업로드 (관리자) | 매일 배움 연구소',
  robots: { index: false, follow: false },
};

export default function AmcAdminPage() {
  return <><SiteHeader /><main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px 64px' }}>
    <AmcAdmin />
  </main><SiteFooter /></>;
}
