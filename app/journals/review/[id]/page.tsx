'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { AdamUserProfile } from '@/components/AdamGate';
import { JournalDetailView } from '@/components/journal/constitutional/JournalDetailView';
import type { ConstitutionalJournal, JournalAudit } from '@/lib/adam-journal-types';

const API = process.env.NEXT_PUBLIC_QXK24_API_URL ?? 'https://api.qxk24.com';
const PROFILE_KEY = 'qxk24_adam_profile';

export default function JournalReviewDetailPage() {
  const params = useParams();
  const id = String(params.id ?? '');
  const [journal, setJournal] = useState<ConstitutionalJournal | null>(null);
  const [audits, setAudits] = useState<JournalAudit[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem(PROFILE_KEY);
    if (!raw) {
      setError('Founder login required.');
      return;
    }
    const profile = JSON.parse(raw) as AdamUserProfile;
    if (profile.role !== 'founder') {
      setError('Founder only.');
      return;
    }
    setToken(profile.token);

    fetch(`${API}/api/adam/journal/${id}`, {
      headers: { Authorization: `Bearer ${profile.token}` },
    })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? 'Failed to load');
        setJournal(body.data.journal);
        setAudits(body.data.audits ?? []);
      })
      .catch((e) => setError((e as Error).message));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen journal-bg-animated text-white flex items-center justify-center">
        <p className="text-amber-200">
          {error}{' '}
          <Link href="/adam" className="underline">
            ADAM login
          </Link>
        </p>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="min-h-screen journal-bg-animated text-white flex items-center justify-center">
        <p className="text-white/50">Loading…</p>
      </div>
    );
  }

  return <JournalDetailView journal={journal} audits={audits} founderToken={token} />;
}
