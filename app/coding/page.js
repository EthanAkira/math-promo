import { SiteFooter, SiteHeader } from '../components';
import CodingArchive from './CodingArchive';

export const metadata = {
  title: '코딩 & 데이터 사이언스 아카이브 | 매일 배움 연구소',
  description: '파이썬, 알고리즘, 데이터 분석 등 코딩·데이터 사이언스 자료와 문제 아카이브입니다.',
};

export default function CodingPage() {
  return <><SiteHeader /><main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px 64px' }}>
    <CodingArchive />
  </main><SiteFooter /></>;
}
