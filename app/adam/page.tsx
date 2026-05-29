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
 */

'use client';

import { useEffect, useState } from 'react';
import AdamGate, { type AdamUserProfile } from '@/components/AdamGate';
import ADAMChat from '@/components/ADAMChat';
import {
  adamApiFetch,
  clearAdamProfile,
  readAdamProfile,
  writeAdamProfile,
} from '@/lib/adam-session-storage';

const API = process.env.NEXT_PUBLIC_QXK24_API_URL ?? 'https://api.qxk24.com';

export default function ADAMPage() {
  const [profile, setProfile] = useState<AdamUserProfile | null>(null);
  const [checking, setChecking] = useState(true);
  /** Bumped on each login so mobile gets a fresh chat mount + session load */
  const [chatEpoch, setChatEpoch] = useState(0);

  useEffect(() => {
    const stored = readAdamProfile();
    if (!stored?.token) {
      setChecking(false);
      return;
    }

    adamApiFetch(`${API}/api/adam/auth/verify`, stored.token, { method: 'POST' })
      .then(async (r) => {
        if (r.status === 401 || r.status === 403) {
          clearAdamProfile();
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        if (d.success && d.valid) {
          const next: AdamUserProfile = {
            token:    stored.token,
            role:     d.role === 'student' ? 'student' : 'founder',
            userId:   d.userId ?? stored.userId ?? 'masa-bayu',
            userName: d.name ?? stored.userName ?? 'Masa Bayu',
          };
          writeAdamProfile(next);
          setProfile(next);
          setChatEpoch((n) => n + 1);
        } else {
          clearAdamProfile();
        }
      })
      .catch(() => {
        // Flaky mobile network — keep profile; chat will retry session load
        setProfile(stored);
        setChatEpoch((n) => n + 1);
      })
      .finally(() => setChecking(false));
  }, []);

  function handleAuth(p: AdamUserProfile) {
    writeAdamProfile(p);
    setProfile(p);
    setChatEpoch((n) => n + 1);
  }

  function handleSignOut() {
    clearAdamProfile();
    setProfile(null);
    setChatEpoch(0);
  }

  if (checking) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ color: '#bbb', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Loading...
        </p>
      </div>
    );
  }

  if (!profile?.token) return <AdamGate onAuthenticated={handleAuth} />;
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <ADAMChat
        key={`${profile.userId}-${chatEpoch}`}
        profile={profile}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
