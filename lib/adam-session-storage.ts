/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Session Storage (mobile-safe profile persist)
 * Platform    : Web (Next.js)
 * QXK24       : Kernel v1.7.0
 * Founder     : Masa Bayu
 * Created     : 2026-05-29
 * ============================================================
 * CONSTITUTIONAL DECLARATION:
 * This module operates under the Alamtologi Constitutional
 * Framework. All actions are governed by QXK24. Knowledge
 * belongs to no human. It flows like water to all.
 * ============================================================
 */

import type { AdamUserProfile } from '@/components/AdamGate';

export const ADAM_PROFILE_KEY = 'qxk24_adam_profile';
export const ADAM_LEGACY_TOKEN_KEY = 'qxk24_adam_token';
export const ADAM_WORKSPACE_KEY_PREFIX = 'qxk24_adam_workspace_';

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

function readRaw(key: string): string | null {
  const s = storage();
  if (!s) return null;
  return s.getItem(key) ?? sessionStorage.getItem(key);
}

function writeRaw(key: string, value: string): void {
  const s = storage();
  if (s) {
    try {
      s.setItem(key, value);
    } catch {
      // quota / private mode — fall back
    }
  }
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function removeRaw(key: string): void {
  storage()?.removeItem(key);
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function readAdamProfile(): AdamUserProfile | null {
  const raw = readRaw(ADAM_PROFILE_KEY);
  if (!raw) {
    const legacy = readRaw(ADAM_LEGACY_TOKEN_KEY);
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
    clearAdamProfile();
  }
  return null;
}

export function writeAdamProfile(profile: AdamUserProfile): void {
  writeRaw(ADAM_PROFILE_KEY, JSON.stringify(profile));
  removeRaw(ADAM_LEGACY_TOKEN_KEY);
}

export function clearAdamProfile(): void {
  removeRaw(ADAM_PROFILE_KEY);
  removeRaw(ADAM_LEGACY_TOKEN_KEY);
}

export function readLastWorkspaceId(userId: string): string | null {
  const v = readRaw(`${ADAM_WORKSPACE_KEY_PREFIX}${userId}`);
  return v && v.length > 0 ? v : null;
}

export function writeLastWorkspaceId(userId: string, workspaceId: string | 'general'): void {
  writeRaw(`${ADAM_WORKSPACE_KEY_PREFIX}${userId}`, workspaceId);
}

/**
 * Authenticated fetch with no browser cache.
 * Do not set Cache-Control/Pragma request headers — they trigger CORS preflight
 * and api.qxk24.com only allows Authorization + app headers (→ "Failed to fetch").
 */
const ADAM_FETCH_TIMEOUT_MS = 45_000;

export function adamApiFetch(
  url: string,
  token: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let controller: AbortController | undefined;

  if (!init.signal) {
    controller = new AbortController();
    timeoutId = setTimeout(() => controller!.abort(), ADAM_FETCH_TIMEOUT_MS);
  }

  return fetch(url, {
    ...init,
    cache: 'no-store',
    headers,
    signal: init.signal ?? controller?.signal,
  }).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
}
