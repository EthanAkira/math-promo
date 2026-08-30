import './globals.css';
import { LanguageProvider } from './language';
import { AuthProvider } from './auth';
import { SITE_URL } from './siteConfig';

const TITLE = '매일 배움 연구소 | 수학·코딩 문제와 학습 콘텐츠';
const DESCRIPTION = '수학 문제 생성부터 자세한 풀이와 코딩 학습까지, 매일 성장할 수 있는 학습 콘텐츠를 제공합니다.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: '매일 배움 연구소',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body><LanguageProvider><AuthProvider>{children}</AuthProvider></LanguageProvider></body>
    </html>
  );
}
