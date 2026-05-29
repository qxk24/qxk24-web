'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdamJournalAPI } from '@/lib/adam-journal-api';
import type { AlamtologiPrinciple } from '@/lib/adam-journal-types';
import { JudgmentOrb } from '@/components/journal/constitutional/JudgmentOrb';

const CATEGORIES = [
  { value: 'RESEARCH', label: 'Research' },
  { value: 'APPLICATION', label: 'Application' },
  { value: 'CASE_STUDY', label: 'Case study' },
  { value: 'THEORY', label: 'Theory' },
  { value: 'IMPLEMENTATION', label: 'Implementation' },
] as const;

const PRINCIPLES: AlamtologiPrinciple[] = [
  'MASA', 'TENAGA', 'AIR', 'API', 'BUMI', 'CAHAYA', 'RUANG',
];

export default function SubmitJournalPage() {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [category, setCategory] = useState<string>('RESEARCH');
  const [principlesFocus, setPrinciplesFocus] = useState<AlamtologiPrinciple[]>(['CAHAYA']);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorOrg, setAuthorOrg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Awaited<ReturnType<typeof AdamJournalAPI.submit>> | null>(null);

  function togglePrinciple(p: AlamtologiPrinciple) {
    setPrinciplesFocus((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (principlesFocus.length === 0) {
      setError('Select at least one Alamtologi principle.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const journal = await AdamJournalAPI.submit({
        title,
        abstract,
        rawContent,
        category,
        principlesFocus,
        authorName,
        authorEmail,
        authorOrg: authorOrg || undefined,
      });
      setResult(journal);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="min-h-screen journal-bg-animated text-white flex items-center justify-center px-6">
        <div
          className="max-w-lg w-full text-center p-10 rounded-3xl border border-white/20 backdrop-blur-xl journal-bar-grow"
          style={{ background: 'rgba(15,10,30,0.85)' }}
        >
          <JudgmentOrb judgment={result.judgment} ahriScore={result.ahriScore} />
          <h1 className="text-2xl font-bold mt-8 mb-2">Submitted for constitutional review</h1>
          <p className="text-white/65 text-sm mb-6">
            ADAM has analysed your manuscript and recorded a <strong>SUBMISSION</strong> stage audit.
            The Founder will review before publication.
          </p>
          <p className="text-xs text-white/45 font-mono mb-8 break-all">ID: {result.id}</p>
          <Link
            href="/journals"
            className="inline-block px-8 py-3 rounded-full font-semibold text-slate-900"
            style={{ background: 'linear-gradient(90deg, #fbbf24, #f97316)' }}
          >
            Back to journals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen journal-bg-animated text-white">
      <div className="max-w-2xl mx-auto px-6 py-16 relative z-10">
        <Link href="/journals" className="text-white/60 hover:text-amber-300 text-sm">
          ← Journals
        </Link>
        <h1 className="text-3xl font-bold mt-6 mb-2">Submit manuscript</h1>
        <p className="text-white/60 mb-10">
          ADAM will structure your work, score the seven principles, and open the constitutional audit trail.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Title" value={title} onChange={setTitle} required minLength={10} />
          <Field label="Abstract (min 100 characters)" value={abstract} onChange={setAbstract} required multiline rows={4} />
          <Field label="Full manuscript (min 500 characters)" value={rawContent} onChange={setRawContent} required multiline rows={12} />

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/50 mb-3">
              Principles in focus
            </label>
            <div className="flex flex-wrap gap-2">
              {PRINCIPLES.map((p) => {
                const on = principlesFocus.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePrinciple(p)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                    style={{
                      background: on ? 'linear-gradient(90deg,#fbbf24,#f97316)' : 'rgba(255,255,255,0.1)',
                      color: on ? '#1e1b4b' : '#fff',
                      border: on ? 'none' : '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <Field label="Author name" value={authorName} onChange={setAuthorName} required />
          <Field label="Email" value={authorEmail} onChange={setAuthorEmail} required type="email" />
          <Field label="Organisation (optional)" value={authorOrg} onChange={setAuthorOrg} />

          {error && <p className="text-red-300 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-slate-900 disabled:opacity-50"
            style={{
              background: 'linear-gradient(90deg, #a78bfa, #38bdf8, #fbbf24)',
              backgroundSize: '200% auto',
              animation: loading ? undefined : 'journalGradientShift 6s ease infinite',
            }}
          >
            {loading ? 'ADAM is reading…' : 'Submit for constitutional analysis'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-black/30 border border-white/20 text-white text-sm focus:outline-none focus:border-amber-400';

function Field({
  label,
  value,
  onChange,
  required,
  multiline,
  rows = 3,
  type = 'text',
  minLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  type?: string;
  minLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={rows}
          minLength={minLength}
          className={inputClass}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={minLength}
          className={inputClass}
        />
      )}
    </div>
  );
}
