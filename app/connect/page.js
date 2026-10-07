import { SiteHeader, SiteFooter } from '../components';
import ConnectForm from './ConnectForm';

export const metadata = {
  title: '기기 연결 | 매일 배움 연구소',
  description: '부모님이 발급한 연결 코드로 이 태블릿/기기를 자녀 계정에 연결합니다.',
};

export default function ConnectPage() {
  return (
    <>
      <SiteHeader />
      <main style={{ maxWidth: 480, margin: '0 auto', padding: '40px 20px 64px' }}>
        <ConnectForm />
      </main>
      <SiteFooter />
    </>
  );
}
