/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Page Shell (shared /adam + /adam/lab)
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

import { useEffect, useState } from 'react';
import AdamGate, { type AdamUserProfile } from '@/components/AdamGate';
import ADAMChat from '@/components/ADAMChat';
import {
  adamApiFetch,
  clearAdamProfile,
  readAdamProfile,
  writeAdamProfile,
} from '@/lib/adam-session-storage';
import { useAdamStack } from '@/lib/adam/adam-stack-context';

export default function ADAMPageShell() {
  const stack = useAdamStack();
  const [profile, setProfile] = useState<AdamUserProfile | null>(null);
  const [checking, setChecking] = useState(true);
  const [chatEpoch, setChatEpoch] = useState(0);

  useEffect(() => {
    const stored = readAdamProfile(stack.profileKey);
    if (!stored?.token) {
      setChecking(false);
      return;
    }

    adamApiFetch(`${stack.apiBase}/api/adam/auth/verify`, stored.token, { method: 'POST' })
      .then(async (r) => {
        if (r.status === 401 || r.status === 403) {
          clearAdamProfile(stack.profileKey);
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
          writeAdamProfile(next, stack.profileKey);
          setProfile(next);
          setChatEpoch((n) => n + 1);
        } else {
          clearAdamProfile(stack.profileKey);
        }
      })
      .catch(() => {
        setProfile(stored);
        setChatEpoch((n) => n + 1);
      })
      .finally(() => setChecking(false));
  }, [stack.apiBase, stack.profileKey]);

  function handleAuth(p: AdamUserProfile) {
    writeAdamProfile(p, stack.profileKey);
    setProfile(p);
    setChatEpoch((n) => n + 1);
  }

  function handleSignOut() {
    clearAdamProfile(stack.profileKey);
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

  if (!profile?.token) {
    return <AdamGate onAuthenticated={handleAuth} />;
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <ADAMChat
        key={`${stack.id}-${profile.userId}-${chatEpoch}`}
        profile={profile}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
