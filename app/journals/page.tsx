/**
 * ============================================================
 * QXK24.COM — Journal Listing
 * ============================================================
 */

import Link from 'next/link';
import { JournalAPI } from '@/lib/api';
import { JournalCard } from '@/components/journal/JournalCard';
import { PageNav } from '@/components/navigation/PageNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journals — QXK24',
  description: 'Published Alamtologi journals analysed by Masa Bayu',
};

export default async function JournalsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string; sortBy?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  query.set('page', params.page ?? '1');
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  if (params.sortBy) query.set('sortBy', params.sortBy);

  let journals: Awaited<ReturnType<typeof JournalAPI.list>>['journals'] = [];
  let pages = 1;
  try {
    const res = await JournalAPI.list(query);
    journals = res.journals;
    pages = res.pages;
  } catch {
    journals = [];
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <PageNav
        className="mb-6"
        items={[
          { href: '/', label: 'Home', icon: '🏠' },
        ]}
      />
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Journals</h1>
          <p className="text-gray-500">Peer-reviewed by Masa Bayu under the Alamtologi framework.</p>
        </div>
        <Link
          href="/journals/submit"
          className="px-5 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600"
        >
          Submit
        </Link>
      </div>

      {journals.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No published journals yet.</p>
      ) : (
        <div className="grid gap-6">
          {journals.map((j) => (
            <JournalCard key={String(j._id)} journal={{ ...j, _id: String(j._id), slug: j.slug ?? '' }} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <p className="text-center text-sm text-gray-400 mt-10">
          Page {params.page ?? '1'} of {pages}
        </p>
      )}
    </main>
  );
}
