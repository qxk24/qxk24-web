'use client';

import type { HukumZResult, HukumZStatus } from '@/lib/adam-journal-types';

const LABELS: { key: keyof HukumZResult; label: string; color: string }[] = [
  { key: 'pola', label: 'Pola', color: '#8b5cf6' },
  { key: 'kadar', label: 'Kadar', color: '#06b6d4' },
  { key: 'pasangan', label: 'Pasangan', color: '#f59e0b' },
  { key: 'keseimbangan', label: 'Keseimbangan', color: '#22c55e' },
];

function statusStyle(s: HukumZStatus): { bg: string; text: string } {
  if (s === 'LULUS') return { bg: '#10b981', text: '#ecfdf5' };
  if (s === 'GAGAL') return { bg: '#ef4444', text: '#fef2f2' };
  return { bg: '#64748b', text: '#f8fafc' };
}

export function HukumZRing({ hukumZ }: { hukumZ: HukumZResult }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {LABELS.map(({ key, label, color }, i) => {
        const status = hukumZ[key];
        const st = statusStyle(status);
        return (
          <div
            key={key}
            className="journal-bar-grow rounded-2xl p-4 text-center border border-white/10 backdrop-blur-md"
            style={{
              animationDelay: `${i * 0.12}s`,
              background: `linear-gradient(160deg, ${color}33, rgba(15,10,30,0.85))`,
              boxShadow: `0 8px 32px ${color}22`,
            }}
          >
            <p className="text-xs uppercase tracking-widest text-white/70 mb-2">{label}</p>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: st.bg, color: st.text }}
            >
              {status}
            </span>
          </div>
        );
      })}
    </div>
  );
}
