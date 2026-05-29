/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Session Hook
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

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { StudentWorkspace } from '@/components/WorkspaceSelector';
import { readApiJson } from '@/lib/api-response';
import { adamApiFetch, readLastWorkspaceId } from '@/lib/adam-session-storage';
import {
  ADAM_API,
  historyUrl,
  type AdamChatMessage,
  type ConsultItem,
  type FounderView,
  type StudentChannel,
} from '@/lib/adam/adam-chat-types';
import { mapHistoryList } from '@/lib/adam/adam-founder-display';
import { loadAdamSessionAndHistory } from '@/lib/adam/adam-session-load';
import { formatAdamFetchError } from '@/lib/adam/adam-fetch-errors';
import { clearAdamProfile } from '@/lib/adam-session-storage';

export function useADAMSession(params: {
  token: string;
  userId: string;
  isFounder: boolean;
  founderView: FounderView;
  studentChannel: StudentChannel;
  activeWorkspace: StudentWorkspace | null;
  thinking: boolean;
  onRestoredWorkspace?: (ws: StudentWorkspace | null) => void;
  onSessionExpired?: () => void;
}) {
  const {
    token,
    userId,
    isFounder,
    founderView,
    studentChannel,
    activeWorkspace,
    thinking,
    onRestoredWorkspace,
    onSessionExpired,
  } = params;

  const [messages, setMessages] = useState<AdamChatMessage[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sessionLoadError, setSessionLoadError] = useState('');
  const [consults, setConsults] = useState<ConsultItem[]>([]);
  const [consultsLoading, setConsultsLoading] = useState(false);

  const streamingRef = useRef(false);
  const historyLoadGenRef = useRef(0);
  const activeWorkspaceRef = useRef(activeWorkspace);
  activeWorkspaceRef.current = activeWorkspace;

  const applySessionLoad = useCallback((result: {
    sessionId: string;
    messages: AdamChatMessage[];
    readOnly: boolean;
    error: string;
    sessionExpired?: boolean;
  }) => {
    if (result.sessionExpired) {
      clearAdamProfile();
      onSessionExpired?.();
    }
    setSessionId(result.sessionId);
    setMessages(result.messages);
    setReadOnly(result.readOnly);
    setSessionLoadError(result.error);
  }, [onSessionExpired]);

  const loadSessionAndHistory = useCallback(async (
    workspaceOverride?: StudentWorkspace | null,
  ) => {
    if (streamingRef.current) return;
    const gen = ++historyLoadGenRef.current;
    const stale = () =>
      gen !== historyLoadGenRef.current || streamingRef.current;

    setReadOnly(false);
    setSessionLoadError('');

    try {
      const result = await loadAdamSessionAndHistory({
        token,
        userId,
        isFounder,
        founderView,
        studentChannel,
        activeWorkspace: activeWorkspaceRef.current,
        workspaceOverride,
        isStale: stale,
      });
      if (stale()) return;
      applySessionLoad(result);
    } catch (err: unknown) {
      if (stale()) return;
      const msg = formatAdamFetchError(err);
      console.error('loadSessionAndHistory failed', err);
      setSessionLoadError(`${msg} Tap Refresh or sign out and sign in again.`);
      setMessages([]);
    }
  }, [token, userId, isFounder, founderView, studentChannel, applySessionLoad]);

  const refreshHistoryAfterTurn = useCallback(async (sid: string) => {
    const gen = historyLoadGenRef.current;
    if (streamingRef.current || !sid) return;
    const stale = () => gen !== historyLoadGenRef.current || streamingRef.current;
    try {
      if (isFounder) {
        const histRes = await adamApiFetch(
          historyUrl(`${ADAM_API}/api/adam/chat/history`, sid),
          token,
        );
        if (stale()) return;
        const histParsed = await readApiJson(histRes);
        if (stale() || !histParsed.ok) return;
        setMessages(mapHistoryList(histParsed.body?.messages));
        return;
      }
      const result = await loadAdamSessionAndHistory({
        token,
        userId,
        isFounder: false,
        founderView: 'CHAT',
        studentChannel,
        activeWorkspace: activeWorkspaceRef.current,
        isStale: stale,
      });
      if (stale()) return;
      setMessages(result.messages);
      if (result.sessionId) setSessionId(result.sessionId);
    } catch (err) {
      console.error('refreshHistoryAfterTurn failed', err);
    }
  }, [token, userId, isFounder, studentChannel]);

  const loadConsults = useCallback(async () => {
    setConsultsLoading(true);
    try {
      const res = await adamApiFetch(`${ADAM_API}/api/adam/consults?pending=true`, token);
      const parsed = await readApiJson(res);
      if (parsed.ok && Array.isArray(parsed.body?.consults)) {
        setConsults((parsed.body.consults as ConsultItem[]).map((c) => ({
          ...c,
          adamSummary: c.adamSummary ?? '',
        })));
      }
    } catch (err) {
      console.error('Consults load failed', err);
    } finally {
      setConsultsLoading(false);
    }
  }, [token]);

  const loadSessionRef = useRef(loadSessionAndHistory);
  loadSessionRef.current = loadSessionAndHistory;

  useEffect(() => {
    if (!token) return;
    setHistoryLoaded(false);
    setSessionLoadError('');

    (async () => {
      try {
        if (isFounder && founderView === 'CONSULTS') {
          await loadConsults();
          setMessages([]);
          setSessionId('');
          return;
        }
        if (isFounder && founderView === 'KNOWLEDGE') {
          setMessages([]);
          setSessionId('');
          return;
        }
        if (isFounder && founderView === 'STAGES') {
          setMessages([]);
          setSessionId('');
          return;
        }

        let restoredWs: StudentWorkspace | null = null;
        if (!isFounder && studentChannel === 'private') {
          const lastId = readLastWorkspaceId(userId);
          if (lastId && lastId !== 'general') {
            const wsRes = await adamApiFetch(`${ADAM_API}/api/workspaces`, token);
            const wsParsed = await readApiJson(wsRes);
            if (wsParsed.ok && Array.isArray(wsParsed.body?.workspaces)) {
              restoredWs = (wsParsed.body.workspaces as StudentWorkspace[]).find(
                (w) => w.workspaceId === lastId,
              ) ?? null;
            }
          }
        }

        await loadSessionRef.current(restoredWs);
        if (restoredWs) onRestoredWorkspace?.(restoredWs);
      } catch (err) {
        console.error('Session init failed', err);
        const msg = formatAdamFetchError(err);
        setSessionLoadError(`${msg} Tap Refresh or sign out and sign in again.`);
      } finally {
        setHistoryLoaded(true);
      }
    })();
  }, [token, isFounder, founderView, studentChannel, loadConsults, userId, onRestoredWorkspace]);

  useEffect(() => {
    if (!token) return;
    const reloadFromCache = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      setHistoryLoaded(false);
      void loadSessionRef.current()
        .catch((err) => console.error('Session reload failed', err))
        .finally(() => setHistoryLoaded(true));
    };
    window.addEventListener('pageshow', reloadFromCache);
    return () => window.removeEventListener('pageshow', reloadFromCache);
  }, [token]);

  async function handleRefreshScreen() {
    if (refreshing || thinking) return;
    setRefreshing(true);
    setSessionLoadError('');
    try {
      await loadSessionAndHistory();
    } catch {
      setSessionLoadError('Could not refresh. Check your connection.');
    } finally {
      setRefreshing(false);
      setHistoryLoaded(true);
    }
  }

  function bumpHistoryGeneration() {
    historyLoadGenRef.current++;
  }

  return {
    messages,
    setMessages,
    sessionId,
    setSessionId,
    historyLoaded,
    setHistoryLoaded,
    readOnly,
    refreshing,
    sessionLoadError,
    setSessionLoadError,
    consults,
    consultsLoading,
    streamingRef,
    historyLoadGenRef,
    loadSessionAndHistory,
    refreshHistoryAfterTurn,
    loadConsults,
    handleRefreshScreen,
    bumpHistoryGeneration,
  };
}
