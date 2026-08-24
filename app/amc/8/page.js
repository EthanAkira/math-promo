import { SiteFooter, SiteHeader } from '../../components';
import AmcLevelArchive from '../AmcLevelArchive';

export const metadata = {
  title: 'AMC 8 기출문제 | 매일 배움 연구소',
  description: 'AMC 8 기출문제, 해설지, 정답지를 연도별로 미리보고 다운로드하세요.',
};

export default function Amc8Page() {
  return <><SiteHeader /><main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px 64px' }}>
    <AmcLevelArchive level="8" label="AMC 8" description="중학생 이하를 대상으로 한 25문항, 40분 시험입니다." />
  </main><SiteFooter /></>;
}
