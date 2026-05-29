/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Error Boundary
 * Platform    : Web (Next.js)
 * QXK24       : Kernel v1.7.0
 * Founder     : Masa Bayu
 * Created     : 2026-05-29
 * ============================================================
 */

'use client';

import { useEffect } from 'react';
import { clearAdamProfile } from '@/lib/adam-session-storage';

export default function ADAMError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    clearAdamProfile();
  }, []);

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 16, maxWidth: 360, lineHeight: 1.6 }}>
        ADAM could not load — often caused by a stale browser cache after an update.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: '10px 18px',
            background: '#1a1a1a',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        <a
          href="/adam"
          style={{
            padding: '10px 18px',
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#666',
            textDecoration: 'none',
          }}
        >
          Reload ADAM
        </a>
      </div>
    </div>
  );
}
