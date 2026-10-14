import { SiteFooter, SiteHeader } from '../components';
import ScienceArchive from './ScienceArchive';

export const metadata = {
  title: '국제학교 과학 G1–G6 탐구 연구소 & 아카이브 | 매일 배움 연구소',
  description: 'NGSS, Cambridge Primary, IB PYP 국제 표준 과학 커리큘럼(G1–G6) 단원별 교과서, 워크북 및 실시간 인터랙티브 학습지 아카이브입니다.',
};

export default function SciencePage() {
  return (
    <>
      <SiteHeader />
      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '32px 20px 80px' }}>
        <a href="/science/middle" className="button button-secondary no-print" style={{ marginBottom: 16, display: 'inline-flex' }}>
          중학교 과학 G7–G9 (Cambridge Lower Secondary) →
        </a>
        <ScienceArchive />
      </main>
      <SiteFooter />
    </>
  );
}
