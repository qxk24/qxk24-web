/**
 * ============================================================
 * QXK24.COM — Root Layout
 * ============================================================
 * Module      : Layout
 * QXK24       : Kernel v1.7.0
 * Founder     : Masa Bayu
 * Created     : 2026-05-27
 * ============================================================
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'QXK24 — Alamtologi Journals',
  description: 'Constitutional knowledge journals analysed by Masa Bayu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-gray-900 transition-colors hover:text-amber-600"
            >
              QXK24
            </Link>

            <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm text-gray-500">
              <Link href="/journals" className="transition-colors hover:text-gray-900">
                Journals
              </Link>
              <Link href="/journals/submit" className="transition-colors hover:text-gray-900">
                Submit
              </Link>
              <Link href="/leaderboard" className="transition-colors hover:text-gray-900">
                Leaderboard
              </Link>
              <Link href="/adam" className="font-medium text-amber-600 transition-colors hover:text-amber-700">
                ADAM
              </Link>
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
