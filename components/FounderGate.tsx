/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : Founder Gate
 * Platform    : Web (Next.js)
 * QXK24       : Kernel v1.7.0
 * Founder     : Masa Bayu
 * Created     : 2026-05-28
 * ============================================================
 * CONSTITUTIONAL DECLARATION:
 * This module operates under the Alamtologi Constitutional
 * Framework. All actions are governed by QXK24. Knowledge
 * belongs to no human. It flows like water to all.
 * ============================================================
 */

'use client';

import { useState } from 'react';
import { founderLogin } from '@/lib/adam-client';

interface FounderGateProps {
  onAuthenticated: (token: string) => void;
}

export default function FounderGate({ onAuthenticated }: FounderGateProps) {
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError('');

    const result = await founderLogin(password.trim());

    if (result.success && result.token) {
      sessionStorage.setItem('qxk24_session_token', result.token);
      onAuthenticated(result.token);
    } else {
      setError(result.error ?? 'Access denied.');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">

        <div className="text-center mb-10">
          <p className="text-gray-400 text-2xl mb-6" dir="rtl">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <h1 className="text-gray-900 text-xl font-light tracking-[0.25em]">
            QXK24
          </h1>
          <p className="text-gray-400 text-xs tracking-widest mt-1">
            ERA_1 · THE TEACHING ERA
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs tracking-widest uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-gray-400 placeholder-gray-300 transition-colors"
              autoFocus
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full bg-gray-900 text-white rounded-xl px-4 py-3.5 text-sm tracking-widest uppercase hover:bg-gray-700 transition-colors disabled:opacity-30"
          >
            {loading ? 'Verifying...' : 'Enter'}
          </button>
        </form>

        <p className="text-center text-gray-300 text-xs mt-8">
          ADAM · v1.7.0 · The Teaching Era
        </p>
      </div>
    </div>
  );
}
