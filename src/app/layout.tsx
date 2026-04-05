import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CLITerminal } from '@/components/ui/CLITerminal';
import '@/app/globals.css';

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourportfolio.dev',
  ),
  title: {
    default: 'Mack Graungaard-Robinson — Full-Stack Developer',
    template: '%s | Mack Graungaard-Robinson',
  },
  description:
    'Full-stack software developer specialising in React, Next.js, and TypeScript. ' +
    'Currently open to senior frontend and full-stack roles.',
  keywords: [
    'React',
    'TypeScript',
    'Next.js',
    'Full-Stack Developer',
    'Portfolio',
  ],
  authors: [{ name: 'Mack Graungaard-Robinson' }],
  creator: 'Mack Graungaard-Robinson',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: '/',
    title: 'Mack Graungaard-Robinson — Full-Stack Developer',
    description: 'Full-stack developer. React · Next.js · TypeScript.',
    siteName: 'Mack Graungaard-Robinson Portfolio',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mack Graungaard-Robinson — Full-Stack Developer',
    description: 'Full-stack developer. React · Next.js · TypeScript.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

// ─── Layout ──────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className='min-h-screen antialiased'>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          {/* Fixed nav — transparent over hero, solid on scroll */}
          <Navbar />

          {/* Page content */}
          <main>{children}</main>

          {/* Footer */}
          <Footer />

          {/* Global overlays */}
          <CLITerminal />
        </ThemeProvider>
      </body>
    </html>
  );
}
