'use client';

import Link from 'next/link';
import type { ConstitutionalJournal } from '@/lib/adam-journal-types';
import { JUDGMENT_THEME, PRINCIPLE_COLORS } from '@/lib/adam-journal-types';
import { JudgmentOrb } from './JudgmentOrb';

interface Props {
  journal: ConstitutionalJournal;
  index: number;
  detailHref?: string;
}

export function ConstitutionalJournalCard({ journal, index, detailHref }: Props) {
  const theme = JUDGMENT_THEME[journal.judgment];
  const focus = journal.principlesFocus[0];
  const accent = focus ? PRINCIPLE_COLORS[focus] : PRINCIPLE_COLORS.CAHAYA;

  return (
    <Link
      href={detailHref ?? `/journals/${journal.id}`}
      className="journal-bar-grow block group"
      style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
    >
      <article
        className="relative overflow-hidden rounded-3xl p-6 border border-white/15 transition-transform duration-300 group-hover:scale-[1.02] group-hover:border-white/30"
        style={{
          background: `linear-gradient(145deg, ${accent.from}22, rgba(10,8,24,0.92) 45%, ${theme.from}18)`,
          boxShadow: `0 20px 50px ${accent.glow}`,
        }}
      >
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-40 blur-3xl journal-float"
          style={{ background: accent.from }}
        />
        <div className="flex gap-4 items-start relative z-10">
          <JudgmentOrb judgment={journal.judgment} ahriScore={journal.ahriScore} size="sm" />
          <div className="min-w-0 flex-1">
            {journal.journalNumber && (
              <span className="text-xs font-mono text-white/50 tracking-wider">
                {journal.journalNumber}
              </span>
            )}
            <h2 className="text-lg font-bold text-white mt-1 mb-2 line-clamp-2 group-hover:text-amber-100 transition-colors">
              {journal.title}
            </h2>
            <p className="text-sm text-white/65 line-clamp-3 mb-4">{journal.abstract}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span
                className="px-2 py-1 rounded-full capitalize"
                style={{ background: `${accent.from}44`, color: '#fff' }}
              >
                {journal.category.replace('_', ' ').toLowerCase()}
              </span>
              <span className="text-white/50">Tahap {journal.tahapAkalAchieved}</span>
              <span className="text-white/50">{journal.authorName}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
