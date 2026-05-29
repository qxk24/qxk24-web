/**
 * ============================================================
 * QXK24 — ADAM Constitutional Journal API
 * ============================================================
 */

import type { ConstitutionalJournal, JournalAudit } from './adam-journal-types';

const API = process.env.NEXT_PUBLIC_QXK24_API_URL ?? 'https://api.qxk24.com';

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    const err = data as { error?: string };
    throw new Error(err.error ?? `Request failed (${res.status})`);
  }
  return data as T;
}

export const AdamJournalAPI = {
  listPublished: async (limit = 24, skip = 0) => {
    const res = await fetch(
      `${API}/api/adam/journal/public?limit=${limit}&skip=${skip}`,
      { next: { revalidate: 30 } },
    );
    const body = await parseJson<{
      success: boolean;
      data: { journals: ConstitutionalJournal[]; total: number };
    }>(res);
    return body.data;
  },

  getPublished: async (id: string) => {
    const res = await fetch(`${API}/api/adam/journal/public/${id}`, {
      next: { revalidate: 30 },
    });
    const body = await parseJson<{
      success: boolean;
      data: { journal: ConstitutionalJournal; audits: JournalAudit[] };
    }>(res);
    return body.data;
  },

  submit: async (payload: {
    title: string;
    abstract: string;
    rawContent: string;
    category: string;
    principlesFocus: string[];
    authorName: string;
    authorEmail: string;
    authorOrg?: string;
  }) => {
    const res = await fetch(`${API}/api/adam/journal/submit`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    const body = await parseJson<{
      success: boolean;
      data: ConstitutionalJournal;
    }>(res);
    return body.data;
  },

  listPending: async (token: string) => {
    const res = await fetch(`${API}/api/adam/journal?status=PENDING_REVIEW&limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await parseJson<{
      success?: boolean;
      data: { journals: ConstitutionalJournal[] };
    }>(res);
    return body.data?.journals ?? [];
  },

  approve: async (id: string, token: string, reviewNotes: string) => {
    const res = await fetch(`${API}/api/adam/journal/${id}/approve`, {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewNotes }),
    });
    return parseJson<{ data: { journal: ConstitutionalJournal; audits: JournalAudit[] } }>(res);
  },

  publish: async (id: string, token: string) => {
    const res = await fetch(`${API}/api/adam/journal/${id}/publish`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return parseJson<{ data: { journal: ConstitutionalJournal; audits: JournalAudit[] } }>(res);
  },
};
