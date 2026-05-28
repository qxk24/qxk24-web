'use client';

import { useState } from 'react';
import { JournalComment } from '@/lib/types';
import { JournalAPI } from '@/lib/api';

interface CommentSectionProps {
  journalId: string;
  comments: JournalComment[];
}

export function CommentSection({ journalId, comments: initial }: CommentSectionProps) {
  const [comments] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ authorName: '', authorEmail: '', body: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await JournalAPI.comment(journalId, form);
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="comments" className="mt-12 pt-8 border-t border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Discussion ({comments.length})</h2>
      <div className="space-y-6 mb-10">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-sm">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm">
                {c.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{c.authorName}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{c.body}</p>
              </div>
            </div>
          ))
        )}
      </div>
      {submitted ? (
        <p className="text-green-700 text-sm p-4 bg-green-50 rounded-2xl">
          Comment submitted for review by Masa Bayu.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your name"
              value={form.authorName}
              onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
            />
            <input
              type="email"
              placeholder="Email (not published)"
              value={form.authorEmail}
              onChange={(e) => setForm((f) => ({ ...f, authorEmail: e.target.value }))}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
            />
          </div>
          <textarea
            placeholder="Your comment…"
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            rows={4}
            required
            minLength={10}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-amber-500 text-white rounded-xl text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Submitting…' : 'Submit Comment'}
          </button>
        </form>
      )}
    </section>
  );
}
