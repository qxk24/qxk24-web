/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Fetch Errors
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

/** Normalize browser fetch failures into actionable ADAM UI text */
export function formatAdamFetchError(err: unknown): string {
  if (err instanceof DOMException && err.name === 'AbortError') {
    return 'Request timed out. Check your connection and tap Refresh.';
  }

  const msg =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : '';

  const lower = msg.toLowerCase();

  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('network error') ||
    lower.includes('load failed')
  ) {
    return (
      'Cannot reach the ADAM API. Check your internet, use https://qxk24.com/adam, ' +
      'then sign out and sign in again.'
    );
  }

  if (lower.includes('invalid or expired token') || lower.includes('authorization token required')) {
    return 'Session expired. Sign out and sign in again.';
  }

  return msg.trim() || 'Network error';
}

export function isAdamAuthFailure(status: number): boolean {
  return status === 401 || status === 403;
}
