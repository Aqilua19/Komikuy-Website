import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BottomTabBar } from '@/components/layout/BottomTabBar';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'Komakuy — Baca Komik, Streaming Anime & Donghua Sub Indo',
  description: 'Komakuy adalah portal baca komik, manga, manhwa, serta streaming anime dan donghua subtitle Indonesia terlengkap.',
  openGraph: {
    title: 'Komakuy — Baca Komik, Streaming Anime & Donghua Sub Indo',
    description: 'Portal baca komik, manga, manhwa, serta streaming anime dan donghua subtitle Indonesia terlengkap.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Komakuy — Baca Komik, Streaming Anime & Donghua Sub Indo',
    description: 'Portal baca komik, manga, manhwa, serta streaming anime dan donghua subtitle Indonesia terlengkap.',
  },
};

export const viewport: Viewport = {
  themeColor: '#e12d39',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className="dark">
      <head>
        {/* Google Fonts: Outfit & Plus Jakarta Sans */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Font Awesome 6.5.1 (retained for legacy secondary routes) */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* Anti-Flicker Theme Detection Script (Default: Dark) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  if (storedTheme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
        <QueryProvider>
          <AuthProvider>
            <main className="flex-1 pb-[calc(3.75rem+env(safe-area-inset-bottom))] lg:pb-0">
              {children}
            </main>
            <BottomTabBar />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
