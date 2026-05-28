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
        <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-gray-900 tracking-tight">
              QXK24
            </Link>
            <nav className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/journals" className="hover:text-amber-600">Journals</Link>
              <Link href="/journals/submit" className="hover:text-amber-600">Submit</Link>
              <Link href="/leaderboard" className="hover:text-amber-600">Leaderboard</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-gray-100 mt-16 py-8 text-center text-sm text-gray-400">
          QXK24 · Alamtologi Constitutional Framework · Masa Bayu
        </footer>
      </body>
    </html>
  );
}
