import { SiteFooter, SiteHeader } from '../../components';
import MiddleScienceArchive from '../MiddleScienceArchive';

export const metadata = {
  title: '국제학교 중학교 과학 G7–G9 | 매일 배움 연구소',
  description: 'Cambridge Lower Secondary(Stage 7–9) 구조를 기준으로 한 국제학교 중학교 과학 단원별 교과서·워크북 자료실입니다.',
};

export default function MiddleSciencePage() {
  return (
    <>
      <SiteHeader />
      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '32px 20px 80px' }}>
        <MiddleScienceArchive />
      </main>
      <SiteFooter />
    </>
  );
}
