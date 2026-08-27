import { SiteFooter, SiteHeader } from '../../components';
import CsatExamArchive from '../CsatArchive';

export const metadata = {
  title: '대학수학능력시험 기출문제 | 매일 배움 연구소',
  description: '대학수학능력시험(수능) 수학 기출문제, 해설지, 정답지를 연도별로 미리보고 다운로드하세요.',
};

export default function CsatNovPage() {
  return <><SiteHeader /><main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px 64px' }}>
    <CsatExamArchive examType="nov" label="대학수학능력시험" description="매년 11월 시행되는 본수능입니다." />
  </main><SiteFooter /></>;
}
