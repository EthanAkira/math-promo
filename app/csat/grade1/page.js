import { SiteFooter, SiteHeader } from '../../components';
import GradeMockArchive from '../GradeMockArchive';
import Grade1NationalMockWorkspace from './Grade1NationalMockWorkspace';

export const metadata = {
  title: '고1 전국연합학력평가 기출문제 풀이 & 해설 연구실 (6월·9월·11월·고2 3월) | 매일 배움 연구소',
  description: '고등학교 1학년 전국연합학력평가 6월·9월·11월 및 고2 3월(고1 전범위) 총 358문항 기출문제, 정답, 단계별 통큰해설 및 실시간 알고리즘 유사 변형 문제 생성 엔진을 만나보세요.',
};

export default function CsatGrade1Page() {
  return (
    <>
      <SiteHeader />
      <main style={{ maxWidth: 1040, margin: '0 auto', padding: '32px 20px 64px' }}>
        {/* Interactive Grade 1 National Mock Exam & Generator Workspace */}
        <Grade1NationalMockWorkspace />

        {/* Existing PDF Archive & Downloader Section */}
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '2px solid #e2e8f0' }}>
          <GradeMockArchive
            grade="g1"
            label="고1 전국연합학력평가 시험지 아카이브"
            description="각 시·도교육청이 주관하는 고1 전국연합학력평가 공식 시험지 및 해설지 파일 다운로드 아카이브입니다."
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
