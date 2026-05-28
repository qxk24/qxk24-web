/**
 * ============================================================
 * QXK24.COM — API Client
 * ============================================================
 * Module      : API Client
 * QXK24       : Kernel v1.7.0
 * Founder     : Masa Bayu
 * Created     : 2026-05-27
 * ============================================================
 */

import type { Journal, JournalComment, JournalReaction, LeaderboardEntry } from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.qiubbx.com';

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-App-Source': 'QXK24-Web',
      ...options.headers,
    },
    next: options.method === 'GET' ? { revalidate: 60 } : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    const err = data as { error?: string; message?: string };
    throw new Error(err.error ?? err.message ?? 'API error');
  }
  return data as T;
}

export const JournalAPI = {
  list: (params: URLSearchParams) =>
    api<{ success: boolean; journals: Journal[]; total: number; pages: number }>(
      `/api/journals?${params.toString()}`,
    ),

  get: (slug: string) =>
    api<{ success: boolean; journal: Journal }>(`/api/journals/${slug}`),

  submit: (body: unknown) =>
    api<{ success: boolean; message: string; journalId: string }>(
      '/api/journals/submit',
      { method: 'POST', body: JSON.stringify(body) },
    ),

  react: (id: string, type: string) =>
    api<{ success: boolean; reactions: JournalReaction[] }>(
      `/api/journals/${id}/react`,
      { method: 'POST', body: JSON.stringify({ type }) },
    ),

  comment: (id: string, body: unknown) =>
    api<{ success: boolean; message: string }>(
      `/api/journals/${id}/comment`,
      { method: 'POST', body: JSON.stringify(body) },
    ),

  comments: (id: string) =>
    api<{ success: boolean; comments: JournalComment[] }>(
      `/api/journals/${id}/comments`,
    ),

  leaderboard: (limit = 20) =>
    api<{ success: boolean; leaderboard: LeaderboardEntry[] }>(
      `/api/journals/leaderboard?limit=${limit}`,
    ),
};
