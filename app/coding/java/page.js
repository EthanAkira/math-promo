import { SiteFooter, SiteHeader } from '../../components';
import CodingArchive from '../CodingArchive';

export const metadata = {
  title: '자바 Java | 코딩 & 데이터 사이언스 | 매일 배움 연구소',
  description: '자바 Java 학습 자료와 문제 아카이브입니다.',
};

export default function Page() {
  return <><SiteHeader /><main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px 64px' }}>
    <CodingArchive track="java" />
  </main><SiteFooter /></>;
}
