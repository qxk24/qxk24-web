'use client';

import Link from 'next/link';
import type { ConstitutionalJournal } from '@/lib/adam-journal-types';
import { ConstitutionalJournalCard } from './ConstitutionalJournalCard';

interface Props {
  journals: ConstitutionalJournal[];
  total: number;
}

export function JournalsGallery({ journals, total }: Props) {
  return (
    <div className="min-h-screen journal-bg-animated text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="journal-float absolute top-20 left-[10%] w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: '#8b5cf6' }}
        />
        <div
          className="journal-float absolute bottom-32 right-[5%] w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: '#06b6d4', animationDelay: '2s' }}
        />
        <div
          className="journal-float absolute top-1/2 left-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl -translate-x-1/2"
          style={{ background: '#f59e0b', animationDelay: '4s' }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <header className="mb-14 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300/90 mb-4 journal-float">
            QXK24 · ERA_1
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              background: 'linear-gradient(90deg, #fde68a, #f472b6, #38bdf8, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Alamtologi Academic Journals
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-lg">
            Every manuscript is analysed by ADAM, audited at each constitutional stage, and published
            under the seven principles.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/journals/submit"
              className="px-8 py-3 rounded-full font-semibold text-slate-900 transition-transform hover:scale-105"
              style={{
                background: 'linear-gradient(90deg, #fbbf24, #f97316)',
                boxShadow: '0 8px 32px rgba(251,191,36,0.4)',
              }}
            >
              Submit manuscript
            </Link>
            <Link
              href="/journals/about"
              className="px-8 py-3 rounded-full font-medium border border-white/30 text-white/90 hover:bg-white/10"
            >
              About the journal
            </Link>
            <Link
              href="/journals/review"
              className="px-8 py-3 rounded-full font-medium border border-violet-400/50 text-violet-200 hover:bg-violet-500/20"
            >
              Founder review
            </Link>
            <Link href="/" className="px-6 py-3 text-white/60 hover:text-white text-sm">
              Home
            </Link>
          </div>
          {total > 0 && (
            <p className="mt-6 text-sm text-white/45">{total} published work{total !== 1 ? 's' : ''}</p>
          )}
        </header>

        {journals.length === 0 ? (
          <div
            className="text-center py-24 rounded-3xl border border-dashed border-white/20"
            style={{ background: 'rgba(0,0,0,0.25)' }}
          >
            <p className="text-white/60 text-lg mb-4">No published journals yet.</p>
            <Link href="/journals/submit" className="text-amber-300 underline">
              Be the first to submit
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {journals.map((j, i) => (
              <ConstitutionalJournalCard key={j.id} journal={j} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
