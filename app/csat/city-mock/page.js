import { SiteFooter, SiteHeader } from '../../components';
import CsatExamArchive from '../CsatArchive';

export const metadata = {
  title: '시교육청 학력평가 기출문제 | 매일 배움 연구소',
  description: '각 시·도교육청이 주관하는 전국연합학력평가 기출문제, 해설지, 정답지를 연도별로 미리보고 다운로드하세요.',
};

export default function CsatCityMockPage() {
  return <><SiteHeader /><main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px 64px' }}>
    <CsatExamArchive examType="city-mock" label="시교육청 학력평가" description="서울·경기·인천 등 각 시·도교육청이 주관하는 전국연합학력평가입니다." />
  </main><SiteFooter /></>;
}
