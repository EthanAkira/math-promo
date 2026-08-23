import './globals.css';
import { LanguageProvider } from './language';

export const metadata = {
  title: '무료 수학 문제 생성기 | 초중고 연산 연습',
  description:
    '초등, 중등, 고등 수학 연산 문제를 무료로 자동 생성해서 풀어보세요. 난이도를 조절하고, 막히는 개념은 1:1 과외로 이어갈 수 있습니다.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
