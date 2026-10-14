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
    title: `국제학교 과학 Grade ${g} | 매일 배움 연구소`,
    description: `국제학교 G${g} 과학 단원별 교과서와 워크북(학습지) 자료입니다.`,
  };
}

export default function ScienceGradePage({ params }) {
  const g = Number(String(params.grade).replace('g', ''));
  return <><SiteHeader /><main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 64px' }}>
    <ScienceArchive grade={g} />
  </main><SiteFooter /></>;
}
