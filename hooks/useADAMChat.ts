/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Chat Hook
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

import { useState, useEffect, useRef } from 'react';
import type { AdamUserProfile } from '@/components/AdamGate';
import type { StudentWorkspace } from '@/components/WorkspaceSelector';
import { writeLastWorkspaceId } from '@/lib/adam-session-storage';
import { useAdamStack } from '@/lib/adam/adam-stack-context';
import {
  TEXTAREA_MAX_HEIGHT,
  type AdamChatMessage,
  type FounderView,
  type Mode,
  type PendingUpload,
  type StudentChannel,
} from '@/lib/adam/adam-chat-types';
import { displayFounderContent, founderTextFromMessage } from '@/lib/adam/adam-founder-display';
import { deleteAdamMessage } from '@/lib/adam/adam-message-crud';
import { humanizeAdamError } from '@/lib/adam/adam-error-text';
import { resolveChatUrl, streamAdamChatTurn, type StreamTurnResult } from '@/lib/adam/adam-send-stream';
import { uploadAdamTeachingFile } from '@/lib/adam/adam-upload';
import { ADAM_SLEEP_MS, sendAdamSleepBeacon } from '@/lib/adam/adam-session-sleep';
import { useADAMSession } from './useADAMSession';

export function useADAMChat(profile: AdamUserProfile, onSessionExpired?: () => void) {
  const { apiBase, workspaceKeyPrefix } = useAdamStack();
  const { token, role: userRole, userName, userId } = profile;
  const isFounder = userRole === 'founder';

  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('TEACHING');
  const [thinking, setThinking] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [founderView, setFounderView] = useState<FounderView>('CHAT');
  const [studentChannel, setStudentChannel] = useState<StudentChannel>('private');
  const [activeWorkspace, setActiveWorkspace] = useState<StudentWorkspace | null>(null);
  const [stagesRefreshKey, setStagesRefreshKey] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** Synchronous guard — React `thinking` state can lag behind a double tap */
  const sendInFlightRef = useRef(false);
  const streamAbortRef = useRef<AbortController | null>(null);

  const session = useADAMSession({
    token,
    userId,
    isFounder,
    founderView,
    studentChannel,
    activeWorkspace,
    thinking,
    onRestoredWorkspace: setActiveWorkspace,
    onSessionExpired,
  });

  const sessionIdRef = useRef('');
  sessionIdRef.current = session.sessionId;
  const tokenRef = useRef(token);
  tokenRef.current = token;

  useEffect(() => {
    if (!isFounder) return;

    const onPageHide = () => {
      const sid = sessionIdRef.current;
      if (sid) sendAdamSleepBeacon(apiBase, tokenRef.current, sid);
    };

    window.addEventListener('pagehide', onPageHide);
    return () => window.removeEventListener('pagehide', onPageHide);
  }, [isFounder]);

  useEffect(() => {
    if (!isFounder || !session.sessionId) return;

    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    const resetIdle = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        sendAdamSleepBeacon(apiBase, tokenRef.current, sessionIdRef.current);
      }, ADAM_SLEEP_MS);
    };

    resetIdle();
    const events = ['mousemove', 'keydown', 'touchstart', 'scroll'] as const;
    for (const ev of events) window.addEventListener(ev, resetIdle, { passive: true });

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      for (const ev of events) window.removeEventListener(ev, resetIdle);
    };
  }, [isFounder, session.sessionId]);

  const {
    messages,
    setMessages,
    sessionId,
    historyLoaded,
    setHistoryLoaded,
    readOnly,
    refreshing,
    sessionLoadError,
    setSessionLoadError,
    consults,
    consultsLoading,
    streamingRef,
    loadSessionAndHistory,
    refreshHistoryAfterTurn,
    loadConsults,
    handleRefreshScreen,
    bumpHistoryGeneration,
  } = session;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  useEffect(() => {
    return () => {
      streamAbortRef.current?.abort();
      streamAbortRef.current = null;
      sendInFlightRef.current = false;
    };
  }, []);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
  }

  async function removeMessage(messageId: string): Promise<boolean> {
    const result = await deleteAdamMessage({ apiBase, token, messageId, isFounder });
    if (!result.ok) {
      setUploadError(result.error);
      return false;
    }
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    return true;
  }

  function startEditMessage(msg: AdamChatMessage) {
    if (msg.role !== 'founder' || readOnly || thinking || uploading) return;
    setInput(founderTextFromMessage(msg.content));
    void removeMessage(msg.id).then((ok) => {
      if (!ok) return;
      setTimeout(() => {
        autoResize();
        textareaRef.current?.focus();
      }, 0);
    });
  }

  function confirmDeleteMessage(msg: AdamChatMessage) {
    if ((msg.role !== 'founder' && msg.role !== 'student') || readOnly || thinking || uploading) {
      return;
    }
    if (!confirm('Delete this message?')) return;
    void removeMessage(msg.id);
  }

  async function uploadTeachingFile(file: File) {
    setUploading(true);
    setUploadError('');
    const result = await uploadAdamTeachingFile({ apiBase, token, sessionId, file });
    if (!result.ok) {
      setUploadError(result.error);
    } else {
      setPendingUploads((prev) => [...prev, result.upload]);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function sendMessage() {
    if (sendInFlightRef.current) return;

    const text = input.trim();
    if (readOnly) return;
    const needsSession = isFounder || studentChannel === 'private';
    if (thinking || uploading || streamingRef.current) {
      setUploadError('ADAM is still replying. Wait a moment, then send again.');
      return;
    }
    if (!isSessionReadyForSend()) {
      setUploadError('Chat is still loading. Wait a moment or tap Refresh.');
      return;
    }
    if (!text && !pendingUploads.length) return;
    if (needsSession && !sessionId) {
      setUploadError('Session not ready. Tap Refresh.');
      return;
    }

    const attachmentNames = pendingUploads.map((p) => p.fileName);
    const attachmentPrefix = isFounder ? '📎 Teaching data:' : '📎 Attached:';
    const displayParts: string[] = [];
    if (attachmentNames.length) {
      displayParts.push(`${attachmentPrefix} ${attachmentNames.join(', ')}`);
    }
    if (text) displayParts.push(text);

    const senderRole: AdamChatMessage['role'] = isFounder ? 'founder' : 'student';
    const rawUserContent = displayParts.join('\n\n');
    const userMsg: AdamChatMessage = {
      id: `pending-${senderRole}-${Date.now()}`,
      role: senderRole,
      content: isFounder ? displayFounderContent(rawUserContent) : rawUserContent,
      attachments: attachmentNames,
      timestamp: new Date(),
      speakerName: isFounder ? undefined : userName,
    };

    const uploadIds = pendingUploads.map((p) => p.id);
    const turnSessionId = sessionId;

    sendInFlightRef.current = true;
    streamingRef.current = true;
    const streamAbort = new AbortController();
    streamAbortRef.current = streamAbort;

    bumpHistoryGeneration();
    setUploadError('');
    setSessionLoadError('');
    setMessages((prev) => {
      const trimmed = prev.filter(
        (m) =>
          !(
            m.id.startsWith('pending-adam-') &&
            m.role === 'adam' &&
            !m.content.trim()
          ),
      );
      return [...trimmed, userMsg];
    });
    setInput('');
    setPendingUploads([]);
    setThinking(true);
    setIsSearching(false);
    setSearchQuery('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const adamMsgId = `pending-adam-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: adamMsgId, role: 'adam', content: '', timestamp: new Date() },
    ]);

    const body: Record<string, unknown> = { message: text, mode, uploadIds };
    if (sessionId) body.sessionId = sessionId;

    let turnResult: StreamTurnResult = { completed: false };

    try {
      turnResult = await streamAdamChatTurn({
        token,
        chatUrl: resolveChatUrl(apiBase, isFounder, studentChannel),
        body,
        adamMsgId,
        signal: streamAbort.signal,
        callbacks: {
          onSessionId: session.setSessionId,
          onSearching: (q) => {
            setIsSearching(true);
            setSearchQuery(q);
          },
          onSearchDone: () => setIsSearching(false),
          onAdamUpdate: setMessages,
          onError: setUploadError,
          onScroll: () => {
            requestAnimationFrame(() => {
              bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            });
          },
        },
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        const errText = humanizeAdamError(
          err.message || 'Connection interrupted. Please try again.',
        );
        setUploadError(errText);
        setMessages((prev) =>
          prev.map((m) => (m.id === adamMsgId ? { ...m, content: errText } : m)),
        );
      }
    } finally {
      sendInFlightRef.current = false;
      streamingRef.current = false;
      if (streamAbortRef.current === streamAbort) {
        streamAbortRef.current = null;
      }
      setThinking(false);
      setIsSearching(false);
      setSearchQuery('');
      if (isFounder) setStagesRefreshKey((k) => k + 1);
      // Skip history reload when SSE finished cleanly — avoids a second ghost bubble
      if (!turnResult.completed) {
        void refreshHistoryAfterTurn(turnSessionId);
      }
    }
  }

  async function resolveConsult(consultId: string) {
    try {
      await fetch(`${apiBase}/api/adam/consults/${encodeURIComponent(consultId)}/resolve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadConsults();
    } catch (err) {
      console.error('Resolve consult failed', err);
    }
  }

  function switchFounderView(v: FounderView) {
    setFounderView(v);
    setHistoryLoaded(false);
  }

  function switchStudentChannel(ch: StudentChannel) {
    setStudentChannel(ch);
    setActiveWorkspace(null);
    setHistoryLoaded(false);
  }

  function handleWorkspaceSelect(ws: StudentWorkspace | null) {
    bumpHistoryGeneration();
    setActiveWorkspace(ws);
    setMessages([]);
    const sid = ws?.sessionId ?? '';
    session.setSessionId(sid);
    writeLastWorkspaceId(userId, ws?.workspaceId ?? 'general', workspaceKeyPrefix);
    // New / empty book: allow send as soon as session id is known (do not wait on history)
    if (ws && sid) {
      setHistoryLoaded(true);
    } else {
      setHistoryLoaded(false);
    }
    void loadSessionAndHistory(ws)
      .catch((err) => console.error('Workspace load failed', err))
      .finally(() => setHistoryLoaded(true));
  }

  function isSessionReadyForSend(): boolean {
    if (isFounder) return historyLoaded && Boolean(sessionId);
    if (studentChannel === 'group') return historyLoaded;
    return Boolean(sessionId);
  }

  const showChatInput =
    !readOnly &&
    ((isFounder && founderView === 'CHAT') ||
      (!isFounder && (studentChannel === 'private' || studentChannel === 'group')));
  const activeChatView = isFounder
    ? founderView === 'CHAT' || founderView === 'GROUP'
    : true;

  const headerSubtitle = isFounder
    ? founderView === 'GROUP'
      ? 'Group · Read-only'
      : founderView === 'CONSULTS'
        ? 'Consult inbox'
        : founderView === 'STAGES'
          ? 'AIDIL 1(7) · Living dashboard'
          : sessionId
          ? `Session · ${sessionId.slice(-8)}`
          : historyLoaded
            ? 'QXK24 · ERA_1'
            : 'Loading session…'
    : studentChannel === 'group'
      ? 'Alamtologi Group'
      : activeWorkspace
        ? `${activeWorkspace.title} · Stage ${activeWorkspace.stage}/7`
        : sessionId
          ? `${userName} · General`
          : historyLoaded
            ? userName
            : 'Loading…';

  return {
    isFounder,
    userName,
    token,
    messages,
    input,
    setInput,
    mode,
    setMode,
    sessionId,
    historyLoaded,
    thinking,
    isSearching,
    searchQuery,
    uploading,
    uploadError,
    pendingUploads,
    founderView,
    stagesRefreshKey,
    studentChannel,
    activeWorkspace,
    consults,
    consultsLoading,
    readOnly,
    refreshing,
    sessionLoadError,
    bottomRef,
    textareaRef,
    fileInputRef,
    showChatInput,
    activeChatView,
    headerSubtitle,
    handleRefreshScreen: async () => {
      setUploadError('');
      setPendingUploads([]);
      setIsSearching(false);
      setSearchQuery('');
      await handleRefreshScreen();
    },
    sendMessage,
    autoResize,
    uploadTeachingFile,
    removePendingUpload: (id: string) =>
      setPendingUploads((prev) => prev.filter((p) => p.id !== id)),
    switchFounderView,
    switchStudentChannel,
    handleWorkspaceSelect,
    resolveConsult,
    startEditMessage,
    confirmDeleteMessage,
    isSessionReadyForSend,
  };
}
