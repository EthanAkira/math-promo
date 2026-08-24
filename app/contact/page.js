import { SiteFooter, SiteHeader } from '../components';
import ContactForm from './ContactForm';

export const metadata = {
  title: '문의하기 | 매일 배움 연구소',
  description: '매일 배움 연구소에 궁금한 점, 의견, 오류를 보내주세요.',
};

export default function ContactPage() {
  return <><SiteHeader /><main style={{ maxWidth: 640, margin: '0 auto', padding: '40px 20px 64px' }}>
    <ContactForm />
  </main><SiteFooter /></>;
}
