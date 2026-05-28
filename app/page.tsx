/**
 * ============================================================
 * QXK24.COM — Home
 * ============================================================
 */

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Constitutional Knowledge Journals
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Submit research for dual analysis — conventional academic and Alamtologi
        frameworks — published by Masa Bayu on QXK24.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/journals"
          className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600"
        >
          Browse Journals
        </Link>
        <Link
          href="/journals/submit"
          className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
        >
          Submit a Journal
        </Link>
        <Link
          href="/leaderboard"
          className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
        >
          Leaderboard
        </Link>
      </div>
    </main>
  );
}
