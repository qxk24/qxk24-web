'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ConstitutionalJournal, JournalAudit } from '@/lib/adam-journal-types';
import { JUDGMENT_THEME } from '@/lib/adam-journal-types';
import { AdamJournalAPI } from '@/lib/adam-journal-api';
import { JudgmentOrb } from './JudgmentOrb';
import { HukumZRing } from './HukumZRing';
import { PrincipleSpectrum } from './PrincipleSpectrum';
import { AuditTimeline } from './AuditTimeline';

interface Props {
  journal: ConstitutionalJournal;
  audits: JournalAudit[];
  founderToken?: string | null;
}

export function JournalDetailView({ journal, audits: initialAudits, founderToken }: Props) {
  const [audits, setAudits] = useState(initialAudits);
  const [journalState, setJournalState] = useState(journal);
  const [reviewNotes, setReviewNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const theme = JUDGMENT_THEME[journalState.judgment];
  const isFounder = Boolean(founderToken);
  const canApprove = isFounder && journalState.status === 'PENDING_REVIEW';
  const canPublish = isFounder && journalState.status === 'APPROVED';

  async function handleApprove() {
    if (!founderToken) return;
    setBusy(true);
    setMsg('');
    try {
      const res = await AdamJournalAPI.approve(journalState.id, founderToken, reviewNotes);
      setJournalState(res.data.journal);
      setAudits(res.data.audits);
      setMsg('Approved — APPROVAL audit recorded.');
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handlePublish() {
    if (!founderToken) return;
    setBusy(true);
    setMsg('');
    try {
      const res = await AdamJournalAPI.publish(journalState.id, founderToken);
      setJournalState(res.data.journal);
      setAudits(res.data.audits);
      setMsg(`Published as ${res.data.journal.journalNumber ?? 'journal'}.`);
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const c = journalState.content;

  return (
    <div className="min-h-screen journal-bg-animated text-white">
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <nav className="flex flex-wrap gap-4 text-sm text-white/60 mb-10">
          <Link href="/journals" className="hover:text-amber-300">← Journals</Link>
          <Link href="/" className="hover:text-white">Home</Link>
        </nav>

        <header
          className="rounded-3xl p-8 mb-10 border border-white/15 backdrop-blur-xl"
          style={{
            background: `linear-gradient(135deg, ${theme.from}33, rgba(15,10,30,0.9))`,
            boxShadow: `0 24px 60px ${theme.ring}`,
          }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <JudgmentOrb judgment={journalState.judgment} ahriScore={journalState.ahriScore} />
            <div className="flex-1">
              {journalState.journalNumber && (
                <p className="font-mono text-amber-300/90 text-sm mb-2">{journalState.journalNumber}</p>
              )}
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{journalState.title}</h1>
              <p className="text-white/75 leading-relaxed">{journalState.abstract}</p>
              <div className="flex flex-wrap gap-3 mt-6 text-sm text-white/55">
                <span>{journalState.authorName}</span>
                <span>·</span>
                <span className="capitalize">{journalState.category.replace('_', ' ').toLowerCase()}</span>
                <span>·</span>
                <span>Tahap Akal {journalState.tahapAkalAchieved}</span>
                <span>·</span>
                <span>CV {journalState.cVLevel}</span>
                <span>·</span>
                <span className="uppercase">{journalState.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </header>

        {(canApprove || canPublish) && (
          <section
            className="mb-10 p-6 rounded-2xl border border-amber-400/40"
            style={{ background: 'rgba(251,191,36,0.12)' }}
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-amber-200 mb-4">
              Founder review
            </h2>
            {canApprove && (
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Review notes for approval audit…"
                rows={3}
                className="w-full mb-3 px-4 py-3 rounded-xl bg-black/30 border border-white/20 text-white text-sm"
              />
            )}
            <div className="flex flex-wrap gap-3">
              {canApprove && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleApprove}
                  className="px-6 py-2 rounded-full bg-emerald-500 text-white font-semibold disabled:opacity-50"
                >
                  Approve
                </button>
              )}
              {canPublish && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={handlePublish}
                  className="px-6 py-2 rounded-full bg-violet-500 text-white font-semibold disabled:opacity-50"
                >
                  Publish
                </button>
              )}
            </div>
            {msg && <p className="mt-3 text-sm text-amber-100">{msg}</p>}
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 text-amber-200/90">Hukum Z</h2>
          <HukumZRing hukumZ={journalState.hukumZAnalysis} />
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 text-amber-200/90">Seven principles</h2>
          <PrincipleSpectrum analyses={c.alamtologiAnalysis ?? []} />
        </section>

        <section className="mb-10 space-y-6 prose-invert">
          {[
            ['Introduction', c.introduction],
            ['Background', c.background],
            ['Methodology', c.methodology],
            ['Findings', c.findings],
            ['Discussion', c.discussion],
            ['Conclusion', c.conclusion],
          ].map(([title, text]) =>
            text ? (
              <div
                key={title as string}
                className="rounded-2xl p-6 border border-white/10"
                style={{ background: 'rgba(0,0,0,0.35)' }}
              >
                <h3 className="text-sm uppercase tracking-widest text-white/50 mb-3">{title}</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{text}</p>
              </div>
            ) : null,
          )}
        </section>

        {c.references?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-4">References</h2>
            <ol className="list-decimal list-inside space-y-2 text-white/70 text-sm">
              {c.references.map((ref, i) => (
                <li key={i}>{ref}</li>
              ))}
            </ol>
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-lg font-bold mb-6 text-amber-200/90">Constitutional audit trail</h2>
          <AuditTimeline audits={audits} />
        </section>
      </div>
    </div>
  );
}
