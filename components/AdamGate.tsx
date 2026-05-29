/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Login Gate (Founder + Students)
 * Platform    : Web (Next.js)
 * QXK24       : Kernel v1.7.0
 * Founder     : Masa Bayu
 * Created     : 2026-05-29
 * ============================================================
 */

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAdamStack } from '@/lib/adam/adam-stack-context';

export interface AdamUserProfile {
  token:    string;
  role:     'founder' | 'student';
  userId:   string;
  userName: string;
}

interface Props {
  onAuthenticated: (profile: AdamUserProfile) => void;
}

interface StudentOption {
  userId: string;
  name:   string;
}

export default function AdamGate({ onAuthenticated }: Props) {
  const { apiBase } = useAdamStack();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${apiBase}/api/adam/student/accounts`)
      .then((r) => r.json())
      .then((d) => { if (d.success && d.students) setStudents(d.students); })
      .catch(() => {});
  }, [apiBase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError('');

    const isFounder = !username.trim();
    const endpoint = isFounder
      ? `${apiBase}/api/adam/auth/login`
      : `${apiBase}/api/adam/student/login`;

    const body = isFounder
      ? { password: password.trim() }
      : { username: username.trim().toLowerCase(), password: password.trim() };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success && data.data?.token) {
        onAuthenticated({
          token:    data.data.token,
          role:     isFounder ? 'founder' : 'student',
          userId:   isFounder ? 'masa-bayu' : data.data.userId,
          userName: isFounder ? 'Masa Bayu' : data.data.name,
        });
      } else if (data.success && data.token) {
        onAuthenticated({
          token:    data.token,
          role:     'student',
          userId:   data.userId,
          userName: data.name,
        });
      } else {
        setError(data.error ?? 'Access denied.');
      }
    } catch {
      setError('Connection failed. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#fafafa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
      position: 'relative',
    }}>
      <Link
        href="/"
        style={{
          position: 'absolute',
          top: 16,
          right: 20,
          fontSize: 11,
          color: '#666',
          background: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: 6,
          padding: '6px 12px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}
      >
        Home
      </Link>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{
            fontSize: 'clamp(18px, 5vw, 24px)',
            color: '#1a1a1a',
            marginBottom: 16,
            direction: 'rtl',
            fontFamily: 'Georgia, serif',
          }}>
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <h1 style={{
            fontSize: 'clamp(22px, 6vw, 32px)',
            fontWeight: 300,
            letterSpacing: '0.3em',
            color: '#1a1a1a',
            marginBottom: 8,
          }}>
            ADAM
          </h1>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase' }}>
            ERA_1 · Alamtologi Students
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{
              display: 'block',
              fontSize: 11,
              letterSpacing: '0.15em',
              color: '#999',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Account
            </label>
            <select
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: 16,
                border: '1px solid #e0e0e0',
                borderRadius: 10,
                background: '#fff',
                color: '#1a1a1a',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Founder (Masa Bayu)</option>
              {students.map((s) => (
                <option key={s.userId} value={s.userId}>{s.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{
              display: 'block',
              fontSize: 11,
              letterSpacing: '0.15em',
              color: '#999',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: 16,
                border: '1px solid #e0e0e0',
                borderRadius: 10,
                outline: 'none',
                background: '#fff',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#c0392b', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            style={{
              width: '100%',
              padding: '15px 16px',
              background: loading || !password.trim() ? '#ddd' : '#1a1a1a',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 13,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: loading || !password.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Verifying...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
