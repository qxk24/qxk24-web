'use client';

import { useState } from 'react';
import Link from 'next/link';
import { JournalAPI } from '@/lib/api';
import { PageNav } from '@/components/navigation/PageNav';

const CATEGORIES = [
  { value: 'alamtologi', label: 'Alamtologi' },
  { value: 'quran-science', label: 'Quran Science' },
  { value: 'governance', label: 'Governance' },
  { value: 'education', label: 'Education' },
  { value: 'technology', label: 'Technology' },
  { value: 'economics', label: 'Economics' },
  { value: 'social', label: 'Social Sciences' },
  { value: 'health', label: 'Health' },
  { value: 'environment', label: 'Environment' },
  { value: 'other', label: 'Other' },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ms', label: 'Malay' },
  { value: 'ar', label: 'Arabic' },
];

interface FormState {
  title: string;
  abstract: string;
  body: string;
  keywords: string;
  category: string;
  references: string;
  affiliations: string;
  language: string;
  contributorName: string;
  contributorEmail: string;
  contributorBio: string;
  isAnonymous: boolean;
}

const INITIAL: FormState = {
  title: '',
  abstract: '',
  body: '',
  keywords: '',
  category: 'alamtologi',
  references: '',
  affiliations: '',
  language: 'en',
  contributorName: '',
  contributorEmail: '',
  contributorBio: '',
  isAnonymous: false,
};

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100';

export default function SubmitJournalPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const set =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const v = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm((f) => ({ ...f, [k]: v }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const body = {
        ...form,
        keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        references: form.references.split('\n').map((r) => r.trim()).filter(Boolean),
        affiliations: form.affiliations.split('\n').map((a) => a.trim()).filter(Boolean),
      };
      const res = await JournalAPI.submit(body);
      setSuccess(res.message);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <PageNav
            className="mb-6 justify-center"
            items={[
              { href: '/journals', label: 'Back to Journals' },
              { href: '/', label: 'Home' },
            ]}
          />
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Journal Submitted</h1>
          <p className="text-gray-600 mb-6">{success}</p>
          <Link href="/journals" className="px-6 py-3 bg-amber-500 text-white rounded-xl text-sm font-medium">
            Browse Journals
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <PageNav
          className="mb-6"
          items={[
            { href: '/journals', label: 'Back to Journals' },
            { href: '/', label: 'Home' },
          ]}
        />
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Journal</h1>
          <p className="text-gray-500">
            Your submission will be reviewed and analysed by <strong>Masa Bayu</strong>.
          </p>
        </header>

        <div className="flex items-center gap-2 mb-10">
          {([1, 2, 3] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(s)}
              className={`w-8 h-8 rounded-full text-sm font-medium ${
                step === s ? 'bg-amber-500 text-white' : step > s ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <>
              <input type="text" placeholder="Full name *" value={form.contributorName} onChange={set('contributorName')} required className={inputClass} />
              <input type="email" placeholder="Email *" value={form.contributorEmail} onChange={set('contributorEmail')} required className={inputClass} />
              <textarea placeholder="Short bio" value={form.contributorBio} onChange={set('contributorBio')} rows={3} className={`${inputClass} resize-none`} />
              <textarea placeholder="Affiliations (one per line)" value={form.affiliations} onChange={set('affiliations')} rows={3} className={`${inputClass} resize-none`} />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.isAnonymous} onChange={set('isAnonymous')} />
                Publish anonymously
              </label>
              <button type="button" onClick={() => setStep(2)} className="w-full py-3 bg-amber-500 text-white rounded-xl font-medium">
                Continue →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input type="text" placeholder="Title *" value={form.title} onChange={set('title')} required minLength={10} className={inputClass} />
              <div className="grid grid-cols-2 gap-4">
                <select value={form.category} onChange={set('category')} className={inputClass}>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <select value={form.language} onChange={set('language')} className={inputClass}>
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <textarea placeholder="Abstract * (100–3000 chars)" value={form.abstract} onChange={set('abstract')} rows={5} required minLength={100} className={`${inputClass} resize-none`} />
              <p className="text-xs text-gray-400 -mt-3">{form.abstract.length}/3000</p>
              <input type="text" placeholder="Keywords * (comma-separated)" value={form.keywords} onChange={set('keywords')} required className={inputClass} />
              <textarea placeholder="Full paper body *" value={form.body} onChange={set('body')} rows={12} required minLength={500} className={`${inputClass} resize-none font-mono`} />
              <textarea placeholder="References * (one per line, min 3)" value={form.references} onChange={set('references')} rows={6} required className={`${inputClass} resize-none font-mono`} />
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 rounded-xl">← Back</button>
                <button type="button" onClick={() => setStep(3)} className="flex-1 py-3 bg-amber-500 text-white rounded-xl">Review →</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="p-5 bg-gray-50 rounded-2xl text-sm space-y-2">
                <p><span className="text-gray-400">Title:</span> {form.title}</p>
                <p><span className="text-gray-400">Category:</span> {form.category}</p>
                <p><span className="text-gray-400">Contributor:</span> {form.isAnonymous ? 'Anonymous' : form.contributorName}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-sm text-amber-800">
                By submitting, you agree that Masa Bayu will publish an Alamtologi analysis on QXK24.com.
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 rounded-xl">← Back</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 bg-amber-500 text-white rounded-xl disabled:opacity-50">
                  {loading ? 'Submitting…' : 'Submit Journal'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </main>
  );
}
