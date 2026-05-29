'use client';

import type { JournalAudit } from '@/lib/adam-journal-types';
import { JUDGMENT_THEME } from '@/lib/adam-journal-types';

const STAGE_LABELS: Record<string, string> = {
  SUBMISSION:   'Submission',
  REVIEW:       'Review',
  APPROVAL:     'Founder approval',
  PUBLICATION:  'Publication',
  POST_PUBLICATION: 'Post-publication',
};

export function AuditTimeline({ audits }: { audits: JournalAudit[] }) {
  if (!audits.length) {
    return (
      <p className="text-white/50 text-sm text-center py-8">No constitutional audits recorded yet.</p>
    );
  }

  const ordered = [...audits].sort(
    (a, b) => new Date(a.auditedAt).getTime() - new Date(b.auditedAt).getTime(),
  );

  return (
    <ol className="relative border-l-2 border-white/20 ml-4 space-y-8 py-2">
      {ordered.map((audit, i) => {
        const theme = JUDGMENT_THEME[audit.judgment];
        return (
          <li
            key={audit.auditId}
            className="journal-audit-slide pl-8 relative"
            style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}
          >
            <span
              className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white/30"
              style={{
                background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                boxShadow: `0 0 12px ${theme.ring}`,
              }}
            />
            <div
              className="rounded-2xl p-5 border border-white/10 backdrop-blur-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(0,0,0,0.25))',
              }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                  {STAGE_LABELS[audit.stage] ?? audit.stage}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: theme.from, color: theme.text }}
                >
                  {theme.label}
                </span>
                <span className="text-xs text-white/50">
                  Health {audit.healthScore} · {audit.canAdvance ? 'May advance' : 'Hold'}
                </span>
              </div>
              <p className="text-xs text-white/45 mb-3">
                {new Date(audit.auditedAt).toLocaleString()}
              </p>
              {audit.findings.length > 0 && (
                <ul className="text-sm text-white/75 space-y-1 mb-2">
                  {audit.findings.slice(0, 3).map((f) => (
                    <li key={f.slice(0, 40)}>· {f}</li>
                  ))}
                </ul>
              )}
              {audit.recommendations.length > 0 && (
                <p className="text-xs text-amber-200/80">
                  → {audit.recommendations[0]}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
