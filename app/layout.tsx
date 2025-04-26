import { Inter } from 'next/font/google';
import './globals.css';
import ClientWrapper from './ClientWrapper'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CHMOVIES - OTT Admin Control Panel',
  description: 'AWTOX admin panel for OTT Platform',
  icons: {
    icon: { url: '/favicon.ico', type: 'image/x-icon', sizes: '16x16' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
