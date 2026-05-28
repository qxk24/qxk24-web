/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM API Client
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

export const ADAM_API_BASE =
  process.env.NEXT_PUBLIC_QXK24_API_URL ?? 'https://api.qxk24.com';

export type ADAMChatMode =
  | 'TEACHING'
  | 'QUESTIONING'
  | 'AUDIT'
  | 'CONSTITUTIONAL'
  | 'JOURNAL_GEN';

export type ADAMJudgment = 'MAKMUR' | 'ISLAH' | 'WAQF';

export interface ADAMMessage {
  id:          string;
  role:        'founder' | 'adam';
  content:     string;
  mode:        ADAMChatMode;
  judgment?:   ADAMJudgment;
  k24Address?: string;
  timestamp:   Date;
}

export interface ADAMCompleteData {
  sessionId:  string;
  messageId:  string;
  k24Address: string;
  judgment:   ADAMJudgment;
  mode:       ADAMChatMode;
}

export interface ADAMStreamCallbacks {
  onThinking:  (sessionId: string) => void;
  onChunk:     (text: string) => void;
  onComplete:  (data: ADAMCompleteData) => void;
  onError:     (error: string) => void;
}

export function streamADAMChat(
  message:    string,
  mode:       ADAMChatMode,
  founderKey: string,
  callbacks:  ADAMStreamCallbacks,
  sessionId?: string,
): () => void {
  const controller = new AbortController();

  const body: Record<string, string> = { message, mode };
  if (sessionId) body.sessionId = sessionId;

  fetch(`${ADAM_API_BASE}/api/adam/chat`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Accept':        'text/event-stream',
      'Authorization': `Bearer ${founderKey}`,
    },
    body:   JSON.stringify(body),
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok || !res.body) {
        let detail = `API error: ${res.status}`;
        try {
          const errJson = await res.json();
          if (errJson.error) detail = `${detail} — ${errJson.error}`;
        } catch {
          // non-JSON error body
        }
        callbacks.onError(detail);
        return;
      }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        let currentEvent = '';
        for (const line of lines) {
          if (line.startsWith('event:')) {
            currentEvent = line.replace('event:', '').trim();
          } else if (line.startsWith('data:')) {
            const rawData = line.replace('data:', '').trim();
            try {
              const parsed = JSON.parse(rawData);
              switch (currentEvent) {
                case 'adam_thinking':
                  callbacks.onThinking(parsed.sessionId ?? '');
                  break;
                case 'adam_chunk':
                  callbacks.onChunk(parsed.text ?? '');
                  break;
                case 'adam_complete':
                  callbacks.onComplete(parsed as ADAMCompleteData);
                  break;
                case 'adam_error':
                  callbacks.onError(parsed.error ?? 'Unknown error');
                  break;
              }
            } catch {}
          }
        }
      }
    })
    .catch((err) => {
      if (err.name !== 'AbortError') {
        callbacks.onError(err.message ?? 'Connection failed');
      }
    });

  return () => controller.abort();
}

export async function founderLogin(
  password: string,
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch(`${ADAM_API_BASE}/api/adam/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password }),
    });
    const json = await res.json();
    if (json.success && json.data?.token) {
      return { success: true, token: json.data.token };
    }
    return { success: false, error: 'Access denied.' };
  } catch {
    return { success: false, error: 'Connection failed.' };
  }
}

export async function verifyFounderToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${ADAM_API_BASE}/api/adam/auth/verify`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    return json.valid === true;
  } catch {
    return false;
  }
}

export async function verifyFounderKey(key: string): Promise<boolean> {
  return verifyFounderToken(key);
}

export async function listChatSessions(
  founderKey: string,
  mode?: ADAMChatMode,
): Promise<{ id: string; title: string; mode: ADAMChatMode; lastActiveAt: string }[]> {
  try {
    const url = mode
      ? `${ADAM_API_BASE}/api/adam/chat/sessions?mode=${mode}`
      : `${ADAM_API_BASE}/api/adam/chat/sessions`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${founderKey}` },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.sessions ?? [];
  } catch {
    return [];
  }
}
