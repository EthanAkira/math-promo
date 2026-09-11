import { SiteFooter, SiteHeader } from '../../components';
import GradeMockArchive from '../GradeMockArchive';

export const metadata = {
  title: '고2 전국연합학력평가 기출문제 | 매일 배움 연구소',
  description: '고등학교 2학년 시·도교육청 전국연합학력평가(6월·9월) 기출문제, 해설지, 정답지를 연도별로 미리보고 다운로드하세요.',
};

export default function CsatGrade2Page() {
  return <><SiteHeader /><main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px 64px' }}>
    <GradeMockArchive grade="g2" label="고2 전국연합학력평가" description="각 시·도교육청이 주관하는 고2 전국연합학력평가(6월·9월)입니다. 고3 수능과 달리 11월 시험은 없습니다." />
  </main><SiteFooter /></>;
}
