import { SiteFooter, SiteHeader } from '../components';
import ScienceArchive from './ScienceArchive';

export const metadata = {
  title: '국제학교 과학 G1–G6 | 매일 배움 연구소',
  description: '국제학교 G1–G6 과학 단원별 교과서와 워크북(학습지) 자료 아카이브입니다.',
};

export default function SciencePage() {
  return <><SiteHeader /><main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 64px' }}>
    <ScienceArchive />
  </main><SiteFooter /></>;
}
