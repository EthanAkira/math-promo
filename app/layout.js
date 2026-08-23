import './globals.css';
import { LanguageProvider } from './language';

export const metadata = {
  title: '매일 배움 연구소 | 수학·코딩 문제와 학습 콘텐츠',
  description:
    '수학 문제 생성부터 자세한 풀이와 코딩 학습까지, 매일 성장할 수 있는 학습 콘텐츠를 제공합니다.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
