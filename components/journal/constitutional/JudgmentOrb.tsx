'use client';

import type { ConstitutionalJudgment } from '@/lib/adam-journal-types';
import { JUDGMENT_THEME } from '@/lib/adam-journal-types';

interface Props {
  judgment: ConstitutionalJudgment;
  ahriScore?: number;
  size?: 'sm' | 'lg';
}

export function JudgmentOrb({ judgment, ahriScore, size = 'lg' }: Props) {
  const theme = JUDGMENT_THEME[judgment];
  const dim = size === 'lg' ? 120 : 72;
  const fontSize = size === 'lg' ? 28 : 18;

  return (
    <div
      className="journal-orb-pulse rounded-full flex flex-col items-center justify-center shrink-0"
      style={{
        width: dim,
        height: dim,
        background: `linear-gradient(145deg, ${theme.from}, ${theme.to})`,
        color: theme.text,
        ['--orb-glow' as string]: theme.ring,
      }}
    >
      <span style={{ fontSize: fontSize * 0.45, letterSpacing: '0.2em', opacity: 0.9 }}>
        {theme.label.toUpperCase()}
      </span>
      {ahriScore !== undefined && (
        <span style={{ fontSize, fontWeight: 700, lineHeight: 1.1 }}>{ahriScore}</span>
      )}
      {ahriScore !== undefined && (
        <span style={{ fontSize: 10, opacity: 0.85 }}>AHRI</span>
      )}
    </div>
  );
}
