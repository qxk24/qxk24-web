/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Teaching Console
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

import { useState, useEffect } from 'react';
import FounderGate from '@/components/FounderGate';
import ADAMChat    from '@/components/ADAMChat';
import { verifyFounderToken } from '@/lib/adam-client';

export default function ADAMPage() {
  const [token,           setToken]           = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('qxk24_session_token');
    if (stored) {
      verifyFounderToken(stored).then((valid) => {
        if (valid) {
          setToken(stored);
        } else {
          sessionStorage.removeItem('qxk24_session_token');
        }
        setCheckingSession(false);
      });
    } else {
      setCheckingSession(false);
    }
  }, []);

  function handleAuthenticated(newToken: string) {
    setToken(newToken);
  }

  function handleSignOut() {
    sessionStorage.removeItem('qxk24_session_token');
    setToken(null);
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-300 text-xs tracking-widest">
          Initializing...
        </div>
      </div>
    );
  }

  if (!token) {
    return <FounderGate onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="relative min-h-screen bg-white text-gray-900">
      <button
        onClick={handleSignOut}
        className="fixed top-4 right-4 z-50 text-gray-400 hover:text-gray-600 text-xs tracking-widest uppercase transition-colors"
      >
        Exit
      </button>
      <ADAMChat founderKey={token} />
    </div>
  );
}
