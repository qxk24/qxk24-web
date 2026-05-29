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

const API = process.env.NEXT_PUBLIC_QXK24_API_URL ?? 'https://api.qxk24.com';
const PROFILE_KEY = 'qxk24_adam_profile';
const LEGACY_TOKEN_KEY = 'qxk24_adam_token';

function readStoredProfile(): AdamUserProfile | null {
  const raw = sessionStorage.getItem(PROFILE_KEY);
  if (!raw) {
    const legacy = sessionStorage.getItem(LEGACY_TOKEN_KEY);
    if (legacy) {
      return { token: legacy, role: 'founder', userId: 'masa-bayu', userName: 'Masa Bayu' };
    }
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed === 'string' && parsed.length > 0) {
      return { token: parsed, role: 'founder', userId: 'masa-bayu', userName: 'Masa Bayu' };
    }
    if (parsed && typeof parsed === 'object' && 'token' in parsed) {
      const p = parsed as AdamUserProfile;
      if (typeof p.token === 'string' && p.token.length > 0) return p;
    }
  } catch {
    sessionStorage.removeItem(PROFILE_KEY);
  }
  return null;
}

export default function ADAMPage() {
  const [profile, setProfile] = useState<AdamUserProfile | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = readStoredProfile();
    if (!stored?.token) {
      setChecking(false);
      return;
    }

    fetch(`${API}/api/adam/auth/verify`, {
      headers: { Authorization: `Bearer ${stored.token}` },
      method: 'POST',
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.valid) {
          const next: AdamUserProfile = {
            token:    stored.token,
            role:     d.role === 'student' ? 'student' : 'founder',
            userId:   d.userId ?? stored.userId ?? 'masa-bayu',
            userName: d.name ?? stored.userName ?? 'Masa Bayu',
          };
          sessionStorage.setItem(PROFILE_KEY, JSON.stringify(next));
          sessionStorage.removeItem(LEGACY_TOKEN_KEY);
          setProfile(next);
        } else {
          sessionStorage.removeItem(PROFILE_KEY);
          sessionStorage.removeItem(LEGACY_TOKEN_KEY);
        }
      })
      .catch(() => {
        sessionStorage.removeItem(PROFILE_KEY);
        sessionStorage.removeItem(LEGACY_TOKEN_KEY);
      })
      .finally(() => setChecking(false));
  }, []);

  function handleAuth(p: AdamUserProfile) {
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    setProfile(p);
  }

  function handleSignOut() {
    sessionStorage.removeItem(PROFILE_KEY);
    setProfile(null);
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
  return <ADAMChat profile={profile} onSignOut={handleSignOut} />;
}
