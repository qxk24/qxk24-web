/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Session Sleep Beacon
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

import { ADAM_API } from './adam-chat-types';

export function sendAdamSleepBeacon(token: string, sessionId: string): void {
  if (!token || !sessionId) return;

  void fetch(`${ADAM_API}/api/adam/auth/session/sleep`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${token}`,
    },
    body:    JSON.stringify({ sessionId }),
    keepalive: true,
  }).catch(() => {});
}

export const ADAM_SLEEP_MS = 30 * 60 * 1000;
