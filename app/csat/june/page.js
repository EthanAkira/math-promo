import { SiteFooter, SiteHeader } from '../../components';
import CsatExamArchive from '../CsatArchive';

export const metadata = {
  title: '6월 모의고사 기출문제 | 매일 배움 연구소',
  description: '수능 수학 6월 모의고사 기출문제, 해설지, 정답지를 연도별로 미리보고 다운로드하세요.',
};

export default function CsatJunePage() {
  return <><SiteHeader /><main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px 64px' }}>
    <CsatExamArchive examType="june" label="6월 모의고사" description="한국교육과정평가원이 주관하는 고3 전국연합학력평가(6월)입니다." />
  </main><SiteFooter /></>;
}
