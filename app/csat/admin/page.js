import { SiteFooter, SiteHeader } from '../../components';
import CsatAdmin from './CsatAdmin';

export const metadata = {
  title: '수능 자료 업로드 (관리자) | 매일 배움 연구소',
  robots: { index: false, follow: false },
};

export default function CsatAdminPage() {
  return <><SiteHeader /><main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px 64px' }}>
    <CsatAdmin />
  </main><SiteFooter /></>;
}
