import { SiteFooter, SiteHeader } from '../../components';
import ScienceArchive from '../ScienceArchive';
import { SCIENCE_GRADES } from '../curriculum';

export const dynamicParams = false;

export function generateStaticParams() {
  return SCIENCE_GRADES.map((g) => ({ grade: `g${g}` }));
}

export function generateMetadata({ params }) {
  const g = String(params.grade).replace('g', '');
  return {
    title: `국제학교 과학 Grade ${g} 단원별 자료실 & 인터랙티브 학습지 | 매일 배움 연구소`,
    description: `NGSS·Cambridge·IB PYP 국제학교 G${g} 과학 단원별 교과서, 워크북(학습지) 및 온라인 인터랙티브 퀴즈 자료입니다.`,
  };
}

export default function ScienceGradePage({ params }) {
  const g = Number(String(params.grade).replace('g', ''));
  return (
    <>
      <SiteHeader />
      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '32px 20px 80px' }}>
        <ScienceArchive grade={g} />
      </main>
      <SiteFooter />
    </>
  );
}
