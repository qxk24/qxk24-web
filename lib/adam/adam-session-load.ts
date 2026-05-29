/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Session Loader
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

import type { StudentWorkspace } from '@/components/WorkspaceSelector';
import { readApiJson } from '../api-response';
import { adamApiFetch, readLastWorkspaceId } from '../adam-session-storage';
import { historyUrl, type FounderView, type StudentChannel } from './adam-chat-types';
import { mapHistoryList } from './adam-founder-display';
import { isAdamAuthFailure } from './adam-fetch-errors';

export interface SessionLoadResult {
  sessionId: string;
  messages: ReturnType<typeof mapHistoryList>;
  readOnly: boolean;
  error: string;
  sessionExpired?: boolean;
}

export interface SessionLoadContext {
  token: string;
  userId: string;
  isFounder: boolean;
  founderView: FounderView;
  studentChannel: StudentChannel;
  activeWorkspace: StudentWorkspace | null;
  workspaceOverride?: StudentWorkspace | null;
  apiBase: string;
  workspaceKeyPrefix: string;
  isStale: () => boolean;
}

function authFailureResult(
  parsed: { status: number; errorMessage: string },
  fallback: string,
): SessionLoadResult {
  return {
    sessionId: '',
    messages: [],
    readOnly: false,
    error: parsed.errorMessage || fallback,
    sessionExpired: isAdamAuthFailure(parsed.status),
  };
}

export async function fetchFounderTeachingHistory(
  apiBase: string,
  token: string,
  isStale: () => boolean,
): Promise<SessionLoadResult> {
  const res = await adamApiFetch(`${apiBase}/api/adam/auth/session`, token);
  if (isStale()) return { sessionId: '', messages: [], readOnly: false, error: '' };
  const parsed = await readApiJson(res);
  if (isStale()) return { sessionId: '', messages: [], readOnly: false, error: '' };
  if (!parsed.ok || !parsed.body?.sessionId) {
    if (isAdamAuthFailure(parsed.status)) {
      return authFailureResult(parsed, 'Session expired. Sign out and sign in again.');
    }
    return {
      sessionId: '',
      messages: [],
      readOnly: false,
      error: parsed.errorMessage || 'Could not start Teaching session. Tap Refresh.',
    };
  }

  const sid = String(parsed.body.sessionId);
  const histRes = await adamApiFetch(
    historyUrl(`${apiBase}/api/adam/chat/history`, sid),
    token,
  );
  if (isStale()) return { sessionId: sid, messages: [], readOnly: false, error: '' };
  const histParsed = await readApiJson(histRes);
  if (isStale()) return { sessionId: sid, messages: [], readOnly: false, error: '' };
  if (!histParsed.ok) {
    if (isAdamAuthFailure(histParsed.status)) {
      return authFailureResult(histParsed, 'Session expired. Sign out and sign in again.');
    }
    return {
      sessionId: sid,
      messages: [],
      readOnly: false,
      error: histParsed.errorMessage || 'Could not load Teaching history.',
    };
  }
  return {
    sessionId: sid,
    messages: mapHistoryList(histParsed.body?.messages),
    readOnly: false,
    error: '',
  };
}

export async function loadAdamSessionAndHistory(
  ctx: SessionLoadContext,
): Promise<SessionLoadResult> {
  const {
    token,
    userId,
    isFounder,
    founderView,
    studentChannel,
    activeWorkspace,
    workspaceOverride,
    apiBase,
    workspaceKeyPrefix,
    isStale,
  } = ctx;

  if (isFounder && founderView === 'KNOWLEDGE') {
    return { sessionId: '', messages: [], readOnly: false, error: '' };
  }
  if (isFounder && founderView === 'STAGES') {
    return { sessionId: '', messages: [], readOnly: false, error: '' };
  }
  if (isFounder && founderView === 'CONSULTS') {
    return { sessionId: '', messages: [], readOnly: false, error: '' };
  }

  if (isFounder && founderView === 'GROUP') {
    const histRes = await adamApiFetch(`${apiBase}/api/adam/consults/group/history`, token);
    if (isStale()) return { sessionId: '', messages: [], readOnly: true, error: '' };
    const histParsed = await readApiJson(histRes);
    if (isStale()) return { sessionId: '', messages: [], readOnly: true, error: '' };
    if (histParsed.ok && histParsed.body) {
      return {
        sessionId: String(histParsed.body.sessionId ?? ''),
        messages: mapHistoryList(histParsed.body.messages),
        readOnly: true,
        error: '',
      };
    }
    return {
      sessionId: '',
      messages: [],
      readOnly: true,
      error: histParsed.errorMessage || 'Could not load group history.',
    };
  }

  if (!isFounder && studentChannel === 'group') {
    const sessRes = await adamApiFetch(`${apiBase}/api/adam/student/group/session`, token);
    if (isStale()) return { sessionId: '', messages: [], readOnly: false, error: '' };
    const sessParsed = await readApiJson(sessRes);
    if (isStale()) return { sessionId: '', messages: [], readOnly: false, error: '' };
    const sid = sessParsed.body?.sessionId ? String(sessParsed.body.sessionId) : '';

    const histRes = await adamApiFetch(`${apiBase}/api/adam/student/group/history`, token);
    if (isStale()) return { sessionId: sid, messages: [], readOnly: false, error: '' };
    const histParsed = await readApiJson(histRes);
    if (isStale()) return { sessionId: sid, messages: [], readOnly: false, error: '' };
    if (!histParsed.ok) {
      return {
        sessionId: sid,
        messages: [],
        readOnly: false,
        error: histParsed.errorMessage || 'Could not load group history.',
      };
    }
    return {
      sessionId: sid,
      messages: mapHistoryList(histParsed.body?.messages),
      readOnly: false,
      error: '',
    };
  }

  if (!isFounder) {
    let workspace =
      workspaceOverride !== undefined ? workspaceOverride : activeWorkspace;

    if (!workspace && studentChannel === 'private' && workspaceOverride === undefined) {
      const lastId = readLastWorkspaceId(userId, workspaceKeyPrefix);
      if (lastId && lastId !== 'general') {
        const wsRes = await adamApiFetch(`${apiBase}/api/workspaces`, token);
        if (isStale()) return { sessionId: '', messages: [], readOnly: false, error: '' };
        const wsParsed = await readApiJson(wsRes);
        if (isStale()) return { sessionId: '', messages: [], readOnly: false, error: '' };
        if (wsParsed.ok && Array.isArray(wsParsed.body?.workspaces)) {
          const found = (wsParsed.body.workspaces as StudentWorkspace[]).find(
            (w) => w.workspaceId === lastId,
          );
          if (found) workspace = found;
        }
      }
    }

    if (workspace) {
      const sid = workspace.sessionId;
      const histRes = await adamApiFetch(
        historyUrl(`${apiBase}/api/adam/student/chat/history`, sid),
        token,
      );
      if (isStale()) return { sessionId: sid, messages: [], readOnly: false, error: '' };
      const histParsed = await readApiJson(histRes);
      if (isStale()) return { sessionId: sid, messages: [], readOnly: false, error: '' };
      if (!histParsed.ok) {
        return {
          sessionId: sid,
          messages: [],
          readOnly: false,
          error: histParsed.errorMessage || 'Could not load book history.',
        };
      }
      return {
        sessionId: sid,
        messages: mapHistoryList(histParsed.body?.messages),
        readOnly: false,
        error: '',
      };
    }

    const res = await adamApiFetch(`${apiBase}/api/adam/student/session`, token);
    if (isStale()) return { sessionId: '', messages: [], readOnly: false, error: '' };
    const parsed = await readApiJson(res);
    if (isStale()) return { sessionId: '', messages: [], readOnly: false, error: '' };
    if (!parsed.ok || !parsed.body?.sessionId) {
      return {
        sessionId: '',
        messages: [],
        readOnly: false,
        error: parsed.errorMessage || 'Could not start session. Tap Refresh.',
      };
    }
    const sid = String(parsed.body.sessionId);
    const histRes = await adamApiFetch(
      historyUrl(`${apiBase}/api/adam/student/chat/history`, sid),
      token,
    );
    if (isStale()) return { sessionId: sid, messages: [], readOnly: false, error: '' };
    const histParsed = await readApiJson(histRes);
    if (isStale()) return { sessionId: sid, messages: [], readOnly: false, error: '' };
    if (!histParsed.ok) {
      return {
        sessionId: sid,
        messages: [],
        readOnly: false,
        error: histParsed.errorMessage || 'Could not load messages.',
      };
    }
    return {
      sessionId: sid,
      messages: mapHistoryList(histParsed.body?.messages),
      readOnly: false,
      error: '',
    };
  }

  return fetchFounderTeachingHistory(apiBase, token, isStale);
}
