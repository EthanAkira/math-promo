import { SiteFooter, SiteHeader } from '../../components';
import AmcForecastWorkspace from './AmcForecastWorkspace';

export const metadata = {
  title: 'AMC 출제분석 & 적중 예상문제 연구실 | 매일 배움 연구소',
  description: 'AMC 8, AMC 10, AMC 12 역대 기출 빈도 통계, 4대 영역별 출제 비중표, 5대 킬러 유형 공략법 및 최신 출제 트렌드 반영 25문항 적중 모의고사 실시간 풀이',
};

export default function AmcForecastPage() {
  return (
    <>
      <SiteHeader />
      <main style={{ minHeight: '80vh', background: 'var(--surface, #f8fafc)' }}>
        <AmcForecastWorkspace />
      </main>
      <SiteFooter />
    </>
  );
}
