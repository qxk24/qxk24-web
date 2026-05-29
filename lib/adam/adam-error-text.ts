/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Error Text
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

/** Turn API/Anthropic errors into short text for students and Founder */
export function humanizeAdamError(raw: string): string {
  const msg = raw?.trim() ?? '';
  if (!msg) return 'ADAM could not complete this turn.';

  if (/credit balance|purchase credits|billing/i.test(msg)) {
    return (
      'ADAM is paused — teaching credits need renewal on the server. ' +
      'Please ask the Founder to top up the Anthropic account, then try again.'
    );
  }
  if (/internal server error|api_error|temporarily overloaded/i.test(msg)) {
    return (
      'ADAM hit a temporary server error. Wait a few seconds and tap Send again — ' +
      'your message is already saved.'
    );
  }

  const jsonStart = msg.search(/[{[]/);
  if (jsonStart >= 0) {
    const prefix = msg.slice(0, jsonStart).trim();
    const jsonPart = msg.slice(jsonStart);
    try {
      const parsed = JSON.parse(jsonPart) as {
        error?: { message?: string } | string;
        message?: string;
      };
      const inner =
        typeof parsed.error === 'object' && parsed.error?.message
          ? parsed.error.message
          : typeof parsed.error === 'string'
            ? parsed.error
            : parsed.message;
      if (typeof inner === 'string' && inner.length > 0) {
        return humanizeAdamError(inner);
      }
    } catch {
      // not JSON — fall through
    }
    if (prefix) return humanizeAdamError(prefix);
  }

  if (msg.length > 320) return `${msg.slice(0, 320)}…`;
  return msg;
}
