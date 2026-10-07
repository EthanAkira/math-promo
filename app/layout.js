import './globals.css';
import { LanguageProvider } from './language';
import { AuthProvider } from './auth';
import { SITE_URL } from './siteConfig';

const TITLE = 'ILLUMIA LAB | Learn. Understand. Illuminate.';
const DESCRIPTION = 'ILLUMIA LAB is a learning space for exploring mathematics, science, coding, languages, and more through understanding, discovery, and creation.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'ILLUMIA LAB',
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
