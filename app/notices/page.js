import { SiteFooter, SiteHeader } from '../components';
import NoticesList from './NoticesList';

export const metadata = {
  title: '공지사항 | 매일 배움 연구소',
  description: '매일 배움 연구소 사이트의 새로운 소식과 업데이트를 확인하세요.',
};

export default function NoticesPage() {
  return <><SiteHeader /><main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px 64px' }}>
    <NoticesList />
  </main><SiteFooter /></>;
}
