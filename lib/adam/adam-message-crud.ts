/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Message CRUD
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

import { readApiJson } from '../api-response';

export function isPersistedAdamMessageId(id: string): boolean {
  return !id.startsWith('pending-');
}

export async function deleteAdamMessage(params: {
  apiBase: string;
  token: string;
  messageId: string;
  isFounder: boolean;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { apiBase, token, messageId, isFounder } = params;
  if (!isPersistedAdamMessageId(messageId)) {
    return { ok: true };
  }

  const deleteUrl = isFounder
    ? `${apiBase}/api/adam/chat/messages/${messageId}`
    : `${apiBase}/api/adam/student/chat/messages/${messageId}`;

  try {
    const res = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const parsed = await readApiJson(res);
    if (!parsed.ok) {
      return { ok: false, error: parsed.errorMessage || 'Could not delete message.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not delete message.' };
  }
}
