import { SiteFooter, SiteHeader } from '../../components';
import ScienceStudy from '../ScienceStudy';

export const metadata = {
  title: '과학 학습 · 연습 학습지 | 매일 배움 연구소',
  description: '국제학교 과학 단원별 학습 내용과 인쇄·태블릿 필기가 가능한 연습 학습지입니다.',
};

export default function ScienceStudyPage() {
  return <><SiteHeader /><main className="worksheet-page">
    <ScienceStudy />
  </main><SiteFooter /></>;
}
