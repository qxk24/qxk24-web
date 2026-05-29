/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : API Response Helpers
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

export async function readApiJson(res: Response): Promise<{
  ok: boolean;
  status: number;
  body: Record<string, unknown> | null;
  errorMessage: string;
}> {
  const status = res.status;
  const text = await res.text();

  if (!text.trim()) {
    return {
      ok: false,
      status,
      body: null,
      errorMessage: status === 413
        ? 'File too large. Maximum 30 MB per file.'
        : `Request failed (${status}).`,
    };
  }

  try {
    const body = JSON.parse(text) as Record<string, unknown>;
    const apiError = typeof body.error === 'string' ? body.error : null;
    return {
      ok: res.ok && body.success !== false,
      status,
      body,
      errorMessage: apiError ?? (res.ok ? '' : `Request failed (${status}).`),
    };
  } catch {
    if (status === 413) {
      return {
        ok: false,
        status,
        body: null,
        errorMessage: 'File too large. The server limit is 30 MB per file.',
      };
    }
    const snippet = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
    return {
      ok: false,
      status,
      body: null,
      errorMessage: snippet || `Request failed (${status}).`,
    };
  }
}
