import { SiteFooter, SiteHeader } from '../../components';
import AmcLevelArchive from '../AmcLevelArchive';

export const metadata = {
  title: 'AMC 12 기출문제 | 매일 배움 연구소',
  description: 'AMC 12 (A/B) 기출문제, 해설지, 정답지를 연도별로 미리보고 다운로드하세요.',
};

export default function Amc12Page() {
  return <><SiteHeader /><main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px 64px' }}>
    <AmcLevelArchive level="12" label="AMC 12" description="12학년 이하를 대상으로 한 25문항, 75분 시험입니다. 연도별로 A/B 두 회차가 있습니다." />
  </main><SiteFooter /></>;
}
