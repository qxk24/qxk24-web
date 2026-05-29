/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Send Stream
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
import { ADAM_API } from './adam-chat-types';
import { humanizeAdamError } from './adam-error-text';
import { cleanAdamText, consumeSseBlocks, extractJudgment } from './adam-sse';
import type { AdamChatMessage } from './adam-chat-types';

export interface StreamCallbacks {
  onSessionId: (sessionId: string) => void;
  onSearching: (query: string) => void;
  onSearchDone: () => void;
  onAdamUpdate: (updater: (prev: AdamChatMessage[]) => AdamChatMessage[]) => void;
  onError: (message: string) => void;
  onScroll: () => void;
}

export interface StreamTurnResult {
  completed: boolean;
  messageId?: string;
}

export async function streamAdamChatTurn(params: {
  token: string;
  chatUrl: string;
  body: Record<string, unknown>;
  adamMsgId: string;
  callbacks: StreamCallbacks;
  signal?: AbortSignal;
}): Promise<StreamTurnResult> {
  const { token, chatUrl, body, adamMsgId, callbacks, signal } = params;
  let fullText = '';
  let streamClosed = false;
  let completed = false;
  let messageId: string | undefined;

  const res = await fetch(chatUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok || !res.body) {
    const parsed = await readApiJson(res);
    throw new Error(
      parsed.errorMessage ||
        (parsed.status === 413
          ? 'Request too large. Use a shorter message or smaller file (max 30 MB).'
          : `API error (${parsed.status}).`),
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const handleSseEvent = (eventName: string, data: string) => {
    if (streamClosed || !data) return;
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(data) as Record<string, unknown>;
    } catch {
      return;
    }

    if (eventName === 'adam_thinking' && typeof parsed.sessionId === 'string') {
      callbacks.onSessionId(parsed.sessionId);
    }
    if (eventName === 'adam_searching') {
      callbacks.onSearching(
        typeof parsed.query === 'string' ? parsed.query : 'Searching…',
      );
    }
    if (eventName === 'adam_search_done') {
      callbacks.onSearchDone();
    }
    if (eventName === 'adam_chunk' && typeof parsed.text === 'string') {
      fullText += parsed.text;
      callbacks.onAdamUpdate((prev) =>
        prev.map((m) =>
          m.id === adamMsgId ? { ...m, content: cleanAdamText(fullText) } : m,
        ),
      );
    }
    if (eventName === 'adam_error') {
      streamClosed = true;
      const errText = humanizeAdamError(
        typeof parsed.error === 'string'
          ? parsed.error
          : 'ADAM could not complete this turn.',
      );
      fullText = errText;
      callbacks.onAdamUpdate((prev) =>
        prev.map((m) => (m.id === adamMsgId ? { ...m, content: errText } : m)),
      );
      callbacks.onError(errText);
    }
    if (eventName === 'adam_complete') {
      streamClosed = true;
      completed = true;
      const fromText = extractJudgment(fullText);
      const judgment = String(parsed.judgment ?? fromText.judgment);
      const k24Address =
        typeof parsed.k24Address === 'string' ? parsed.k24Address : fromText.k24Address;
      const display =
        typeof parsed.response === 'string'
          ? cleanAdamText(parsed.response)
          : cleanAdamText(fullText);
      callbacks.onAdamUpdate((prev) =>
        prev.map((m) =>
          m.id === adamMsgId
            ? { ...m, content: display || '…', judgment, k24Address }
            : m,
        ),
      );
      if (typeof parsed.sessionId === 'string') {
        callbacks.onSessionId(parsed.sessionId);
      }
      if (typeof parsed.messageId === 'string') {
        messageId = parsed.messageId;
        callbacks.onAdamUpdate((prev) =>
          prev.map((m) => (m.id === adamMsgId ? { ...m, id: messageId! } : m)),
        );
      }
      callbacks.onScroll();
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    buffer = consumeSseBlocks(buffer, handleSseEvent);
  }
  consumeSseBlocks(`${buffer}\n\n`, handleSseEvent);

  // Stream closed after chunks but complete event lost (proxy timeout) — still one turn
  if (!completed && fullText.trim().length > 0) {
    completed = true;
  }

  return { completed, messageId };
}

export function resolveChatUrl(
  isFounder: boolean,
  studentChannel: 'private' | 'group',
): string {
  if (isFounder) return `${ADAM_API}/api/adam/chat`;
  if (studentChannel === 'group') {
    return `${ADAM_API}/api/adam/student/group/chat`;
  }
  return `${ADAM_API}/api/adam/student/chat`;
}
