import { SiteFooter, SiteHeader } from '../../../components';
import MiddleScienceArchive from '../../MiddleScienceArchive';
import { MIDDLE_GRADES } from '../../middleCurriculum';

export const dynamicParams = false;

export function generateStaticParams() {
  return MIDDLE_GRADES.map((g) => ({ grade: `g${g}` }));
}

export function generateMetadata({ params }) {
  const g = String(params.grade).replace('g', '');
  return {
    title: `국제학교 중학교 과학 Grade ${g} | 매일 배움 연구소`,
    description: `Cambridge Lower Secondary Stage ${g} 구조를 기준으로 한 G${g} 과학 단원별 교과서·워크북 자료실입니다.`,
  };
}

export default function MiddleScienceGradePage({ params }) {
  const g = Number(String(params.grade).replace('g', ''));
  return (
    <>
      <SiteHeader />
      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '32px 20px 80px' }}>
        <MiddleScienceArchive grade={g} />
      </main>
      <SiteFooter />
    </>
  );
}
