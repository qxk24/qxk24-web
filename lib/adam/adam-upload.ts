/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Upload
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
import { formatAdamFetchError } from './adam-fetch-errors';
import { MAX_UPLOAD_MB, type PendingUpload } from './adam-chat-types';

export async function uploadAdamTeachingFile(params: {
  apiBase: string;
  token: string;
  sessionId: string;
  file: File;
}): Promise<{ ok: true; upload: PendingUpload } | { ok: false; error: string }> {
  const { apiBase, token, sessionId, file } = params;
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    return { ok: false, error: `File must be ${MAX_UPLOAD_MB}MB or smaller.` };
  }

  const form = new FormData();
  form.append('file', file);
  if (sessionId) form.append('sessionId', sessionId);

  try {
    const res = await fetch(`${apiBase}/api/adam/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const parsed = await readApiJson(res);
    if (!parsed.ok || !parsed.body) {
      return {
        ok: false,
        error: parsed.errorMessage || `Upload failed (${parsed.status})`,
      };
    }
    const data = parsed.body.data as {
      upload?: { id: string; fileName: string; sizeBytes: number };
    } | undefined;
    const upload = data?.upload;
    if (!upload?.id) {
      return { ok: false, error: 'Upload response was invalid. Try again.' };
    }
    return {
      ok: true,
      upload: {
        id: upload.id,
        fileName: upload.fileName,
        sizeBytes: upload.sizeBytes,
      },
    };
  } catch (err: unknown) {
    return { ok: false, error: `Upload failed: ${formatAdamFetchError(err)}` };
  }
}
