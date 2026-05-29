import Link from 'next/link';
import { JournalAPI } from '@/lib/api';
import { StarRating } from '@/components/journal/StarRating';
import { PageNav } from '@/components/navigation/PageNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard — QXK24 Journals',
  description: 'Top-ranked journals by Alamtologi constitutional score',
};

export default async function LeaderboardPage() {
  let leaderboard: Awaited<ReturnType<typeof JournalAPI.leaderboard>>['leaderboard'] = [];
  try {
    const res = await JournalAPI.leaderboard(20);
    leaderboard = res.leaderboard;
  } catch {
    leaderboard = [];
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <PageNav
          className="mb-6"
          items={[
            { href: '/', label: 'Home' },
          ]}
        />
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Journal Leaderboard</h1>
          <p className="text-gray-500">
            Ranked by QXK24 Constitutional Score — Alamtologi (60%), conventional (25%), reactions (15%).
          </p>
          <div className="mt-5 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-widest">
              Score Formula
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm text-amber-800">
              <span className="bg-amber-100 px-2 py-1 rounded-lg font-mono text-xs">
                Alamtologi ÷ 5 × 60
              </span>
              <span className="text-amber-400">+</span>
              <span className="bg-amber-100 px-2 py-1 rounded-lg font-mono text-xs">
                Conventional ÷ 5 × 25
              </span>
              <span className="text-amber-400">+</span>
              <span className="bg-amber-100 px-2 py-1 rounded-lg font-mono text-xs">
                Reactions ÷ 100 × 15
              </span>
              <span className="text-amber-600 font-semibold">= Score / 100</span>
            </div>
          </div>
        </header>

        {leaderboard.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No journals published yet.</p>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((entry, idx) => {
              const totalReactions = entry.reactions.reduce((s, r) => s + r.count, 0);
              const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null;
              return (
                <Link
                  key={entry._id}
                  href={`/journals/community/${entry.slug}`}
                  className="block p-5 rounded-2xl border border-gray-100 hover:border-amber-200 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      idx < 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {medal ?? `#${idx + 1}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{entry.title}</h3>
                        <span className="text-xl font-bold flex-shrink-0">
                          {entry.leaderboardScore}
                          <span className="text-xs text-gray-400 font-normal">/100</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {entry.isAnonymous ? 'Anonymous' : entry.contributorName}
                      </p>
                      {entry.analysis && (
                        <div className="flex flex-wrap gap-4 mt-3">
                          <StarRating value={entry.analysis.alamtologiRating.overall} label="Alamtologi" size="sm" />
                          <StarRating value={entry.analysis.conventionalRating.overall} label="Conventional" size="sm" />
                          <span className="text-xs text-gray-400">{totalReactions} reactions</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
