'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AdamUserProfile } from '@/components/AdamGate';
import { AdamJournalAPI } from '@/lib/adam-journal-api';
import type { ConstitutionalJournal } from '@/lib/adam-journal-types';
import { ConstitutionalJournalCard } from '@/components/journal/constitutional/ConstitutionalJournalCard';

const PROFILE_KEY = 'qxk24_adam_profile';

export default function JournalReviewPage() {
  const [token, setToken] = useState<string | null>(null);
  const [journals, setJournals] = useState<ConstitutionalJournal[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PROFILE_KEY);
      if (!raw) {
        setError('Founder login required. Open ADAM and sign in as Founder first.');
        return;
      }
      const profile = JSON.parse(raw) as AdamUserProfile;
      if (profile.role !== 'founder') {
        setError('Founder access only.');
        return;
      }
      setToken(profile.token);
      AdamJournalAPI.listPending(profile.token)
        .then(setJournals)
        .catch((e) => setError((e as Error).message));
    } catch {
      setError('Could not read session.');
    }
  }, []);

  return (
    <div className="min-h-screen journal-bg-animated text-white">
      <div className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        <Link href="/journals" className="text-white/60 hover:text-amber-300 text-sm">
          ← Journals
        </Link>
        <h1 className="text-3xl font-bold mt-6 mb-2">Founder review queue</h1>
        <p className="text-white/60 mb-10">Pending manuscripts awaiting approval and publication.</p>

        {error && (
          <p className="text-amber-200 mb-8">
            {error}{' '}
            <Link href="/adam" className="underline">
              Go to ADAM
            </Link>
          </p>
        )}

        {token && journals.length === 0 && !error && (
          <p className="text-white/50">No pending reviews.</p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {journals.map((j, i) => (
            <div key={j.id}>
              <ConstitutionalJournalCard
                journal={j}
                index={i}
                detailHref={`/journals/review/${j.id}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
