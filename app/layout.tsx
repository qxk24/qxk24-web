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
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'QXK24 — Alamtologi Journals',
  description: 'Constitutional knowledge journals analysed by Masa Bayu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b border-gray-100 sticky top-0 bg-white z-50">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="font-bold text-gray-900 hover:text-amber-500 transition-colors text-lg"
            >
              QXK24
            </Link>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/journals" className="hover:text-gray-900 transition-colors">
                Journals
              </Link>
              <Link href="/journals/submit" className="hover:text-gray-900 transition-colors">
                Submit
              </Link>
              <Link href="/leaderboard" className="hover:text-gray-900 transition-colors">
                Leaderboard
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
