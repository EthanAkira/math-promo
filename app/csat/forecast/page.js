import { SiteFooter, SiteHeader } from '../../components';
import CsatForecastWorkspace from './CsatForecastWorkspace';

export const metadata = {
  title: '수능 수학 출제분석 & 이번 년도 출제 예측실 | 매일 배움 연구소',
  description: '최근 5개년 수능 수학 출제 빈도·난도 분석, 72대 세부유형 사전, 킬러/준킬러 복합개념 분석 및 이번 년도 기출예상·유사문제 실시간 생성',
};

export default function CsatForecastPage() {
  return (
    <>
      <SiteHeader />
      <main style={{ minHeight: '80vh' }}>
        <CsatForecastWorkspace />
      </main>
      <SiteFooter />
    </>
  );
}
