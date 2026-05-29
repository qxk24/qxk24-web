'use client';

import type { PrincipleAnalysis } from '@/lib/adam-journal-types';
import { PRINCIPLE_COLORS } from '@/lib/adam-journal-types';

export function PrincipleSpectrum({ analyses }: { analyses: PrincipleAnalysis[] }) {
  const sorted = [...analyses].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4">
      {sorted.map((item, i) => {
        const colors = PRINCIPLE_COLORS[item.principle];
        return (
          <div
            key={item.principle}
            className="journal-bar-grow"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex justify-between items-end mb-2">
              <span
                className="text-sm font-bold tracking-wide"
                style={{
                  background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {item.principle}
              </span>
              <span className="text-white/80 text-sm font-semibold">{item.score}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${item.score}%`,
                  background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
                  boxShadow: `0 0 16px ${colors.glow}`,
                }}
              />
            </div>
            {item.analysis && (
              <p className="text-white/60 text-xs mt-2 line-clamp-2">{item.analysis}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
