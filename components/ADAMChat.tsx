/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Chat
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

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ADAMMessage from './ADAMMessage';
import ADAMKnowledge from './ADAMKnowledge';
import type { AdamUserProfile } from './AdamGate';
import { readApiJson } from '../lib/api-response';

const API = process.env.NEXT_PUBLIC_QXK24_API_URL ?? 'https://api.qxk24.com';

type Mode = 'TEACHING' | 'QUESTIONING' | 'CONSTITUTIONAL' | 'AUDIT' | 'JOURNAL_GEN';

interface Message {
  id: string;
  role: 'founder' | 'student' | 'adam';
  content: string;
  judgment?: string;
  k24Address?: string;
  timestamp: Date;
  attachments?: string[];
  speakerName?: string;
  isFounderRelay?: boolean;
}

interface ConsultItem {
  id: string;
  studentId: string;
  studentName: string;
  studentMessage: string;
  adamSummary: string;
  status: string;
  createdAt: string;
}

type FounderView = 'CHAT' | 'KNOWLEDGE' | 'CONSULTS' | 'GROUP';
type StudentChannel = 'private' | 'group';

interface PendingUpload {
  id: string;
  fileName: string;
  sizeBytes: number;
}

const MAX_UPLOAD_MB = 30;
const TEXTAREA_MAX_HEIGHT = 220;

function isSendShortcut(e: React.KeyboardEvent): boolean {
  return e.key === 'Enter' && (e.metaKey || e.ctrlKey);
}
/** Broad accept so macOS/iCloud files without extensions are still selectable */
const ACCEPT_FILES = '*/*';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  profile: AdamUserProfile;
  onSignOut: () => void;
}

function mapHistoryMessage(m: {
  _id: string;
  role: string;
  content: string;
  createdAt: string;
  judgment?: string | null;
  k24Address?: string | null;
  speakerName?: string | null;
  isFounderRelay?: boolean | null;
}): Message {
  let content = m.content ?? '';
  if (m.role === 'founder') {
    content = content.replace(/═══ FOUNDER TEACHING DATA[\s\S]*?═══ END FOUNDER TEACHING DATA ═══\s*/g, '').trim() || content;
  }
  return {
    id: m._id,
    role: m.role as Message['role'],
    content,
    timestamp: new Date(m.createdAt),
    judgment: m.judgment ?? undefined,
    k24Address: m.k24Address ?? undefined,
    speakerName: m.speakerName ?? undefined,
    isFounderRelay: m.isFounderRelay ?? false,
  };
}

export default function ADAMChat({ profile, onSignOut }: Props) {
  const { token, role: userRole, userName } = profile;
  const isFounder = userRole === 'founder';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('TEACHING');
  const [sessionId, setSessionId] = useState<string>('');
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [founderView, setFounderView] = useState<FounderView>('CHAT');
  const [studentChannel, setStudentChannel] = useState<StudentChannel>('private');
  const [consults, setConsults] = useState<ConsultItem[]>([]);
  const [consultsLoading, setConsultsLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const loadConsults = useCallback(async () => {
    setConsultsLoading(true);
    try {
      const res = await fetch(`${API}/api/adam/consults?pending=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.consults)) {
        setConsults(data.consults.map((c: {
          id: string;
          studentId: string;
          studentName: string;
          studentMessage: string;
          adamSummary?: string;
          status: string;
          createdAt: string;
        }) => ({
          id: c.id,
          studentId: c.studentId,
          studentName: c.studentName,
          studentMessage: c.studentMessage,
          adamSummary: c.adamSummary ?? '',
          status: c.status,
          createdAt: c.createdAt,
        })));
      }
    } catch (err) {
      console.error('Consults load failed', err);
    } finally {
      setConsultsLoading(false);
    }
  }, [token]);

  async function loadSessionAndHistory(): Promise<void> {
    setReadOnly(false);

    if (isFounder && founderView === 'CONSULTS') {
      await loadConsults();
      setMessages([]);
      setSessionId('');
      return;
    }

    if (isFounder && founderView === 'GROUP') {
      setReadOnly(true);
      const histRes = await fetch(`${API}/api/adam/consults/group/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const histData = await histRes.json();
      if (histData.success) {
        setSessionId(histData.sessionId ?? '');
        setMessages(
          Array.isArray(histData.messages)
            ? histData.messages.map(mapHistoryMessage)
            : [],
        );
      } else {
        setSessionId('');
        setMessages([]);
      }
      return;
    }

    if (!isFounder && studentChannel === 'group') {
      const sessRes = await fetch(`${API}/api/adam/student/group/session`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sessData = await sessRes.json();
      const sid = sessData.sessionId as string | undefined;
      setSessionId(sid ?? '');

      const histRes = await fetch(`${API}/api/adam/student/group/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const histData = await histRes.json();
      setMessages(
        histData.success && Array.isArray(histData.messages)
          ? histData.messages.map(mapHistoryMessage)
          : [],
      );
      return;
    }

    if (!isFounder) {
      const res = await fetch(`${API}/api/adam/student/session`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success || !data.sessionId) {
        setSessionId('');
        setMessages([]);
        return;
      }
      const sid = data.sessionId as string;
      setSessionId(sid);

      const histRes = await fetch(`${API}/api/adam/student/chat/history/${encodeURIComponent(sid)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const histData = await histRes.json();
      setMessages(
        histData.success && Array.isArray(histData.messages)
          ? histData.messages.map(mapHistoryMessage)
          : [],
      );
      return;
    }

    const res = await fetch(`${API}/api/adam/auth/session`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.success || !data.sessionId) {
      setSessionId('');
      setMessages([]);
      return;
    }

    const sid = data.sessionId as string;
    setSessionId(sid);

    const histRes = await fetch(`${API}/api/adam/chat/history/${encodeURIComponent(sid)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const histData = await histRes.json();
    setMessages(
      histData.success && Array.isArray(histData.messages)
        ? histData.messages.map(mapHistoryMessage)
        : [],
    );
  }

  useEffect(() => {
    if (!token) return;
    setHistoryLoaded(false);

    (async () => {
      try {
        await loadSessionAndHistory();
      } catch (err) {
        console.error('Session init failed', err);
      } finally {
        setHistoryLoaded(true);
      }
    })();
  }, [token, isFounder, founderView, studentChannel, loadConsults]);

  async function handleRefreshScreen() {
    if (refreshing || thinking) return;
    setRefreshing(true);
    setUploadError('');
    setPendingUploads([]);
    setIsSearching(false);
    setSearchQuery('');
    try {
      await loadSessionAndHistory();
    } catch (err) {
      console.error('Refresh failed', err);
      setUploadError('Could not refresh. Check your connection.');
    } finally {
      setRefreshing(false);
      setHistoryLoaded(true);
    }
  }

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
  }

  function founderTextFromMessage(content: string): string {
    if (content.startsWith('📎 Teaching data:')) {
      const parts = content.split('\n\n');
      return parts.length > 1 ? parts.slice(1).join('\n\n') : '';
    }
    return content;
  }

  function isPersistedMessageId(id: string): boolean {
    return !id.startsWith('pending-');
  }

  async function removeMessage(messageId: string): Promise<boolean> {
    if (isPersistedMessageId(messageId)) {
      try {
        const deleteUrl = isFounder
          ? `${API}/api/adam/chat/messages/${messageId}`
          : `${API}/api/adam/student/chat/messages/${messageId}`;
        const res = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        const parsed = await readApiJson(res);
        if (!parsed.ok) {
          setUploadError(parsed.errorMessage || 'Could not delete message.');
          return false;
        }
      } catch {
        setUploadError('Could not delete message.');
        return false;
      }
    }
    setMessages(prev => prev.filter(m => m.id !== messageId));
    return true;
  }

  function startEditMessage(msg: Message) {
    if (msg.role !== 'founder' || readOnly || thinking || uploading) return;
    const text = founderTextFromMessage(msg.content);
    setInput(text);
    void removeMessage(msg.id).then((ok) => {
      if (!ok) return;
      setTimeout(() => {
        autoResize();
        textareaRef.current?.focus();
      }, 0);
    });
  }

  function confirmDeleteMessage(msg: Message) {
    if ((msg.role !== 'founder' && msg.role !== 'student') || readOnly || thinking || uploading) return;
    if (!confirm('Delete this message?')) return;
    void removeMessage(msg.id);
  }

function clean(text: string): string {
  if (!text) return '';
  return text.replace(/<adam_judgment>[\s\S]*?<\/adam_judgment>/g, '').trim();
}

  function extractJudgment(text: string): { judgment: string; k24Address?: string } {
    const match = text.match(/<adam_judgment>([\s\S]*?)<\/adam_judgment>/);
    if (match) {
      try {
        const p = JSON.parse(match[1]);
        return { judgment: p.judgment, k24Address: p.k24Address };
      } catch {
        // fall through
      }
    }
    if (/\bMAKMUR\b/.test(text)) return { judgment: 'MAKMUR' };
    if (/\bWAQF\b/.test(text)) return { judgment: 'WAQF' };
    return { judgment: 'ISLAH' };
  }

  async function uploadTeachingFile(file: File) {
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setUploadError(`File must be ${MAX_UPLOAD_MB}MB or smaller.`);
      return;
    }

    setUploading(true);
    setUploadError('');

    const form = new FormData();
    form.append('file', file);
    if (sessionId) form.append('sessionId', sessionId);

    try {
      const res = await fetch(`${API}/api/adam/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const parsed = await readApiJson(res);
      if (!parsed.ok || !parsed.body) {
        setUploadError(parsed.errorMessage || `Upload failed (${parsed.status})`);
        return;
      }
      const data = parsed.body.data as { upload?: { id: string; fileName: string; sizeBytes: number } } | undefined;
      const upload = data?.upload;
      if (!upload?.id) {
        setUploadError('Upload response was invalid. Try again.');
        return;
      }
      setPendingUploads(prev => [...prev, {
        id: upload.id,
        fileName: upload.fileName,
        sizeBytes: upload.sizeBytes,
      }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setUploadError(`Upload failed: ${msg}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadTeachingFile(file);
  }

  function removePendingUpload(id: string) {
    setPendingUploads(prev => prev.filter(p => p.id !== id));
  }

  async function sendMessage() {
    const text = input.trim();
    if (readOnly) return;
    const needsSession = isFounder || studentChannel === 'private';
    if ((!text && !pendingUploads.length) || thinking || uploading || !historyLoaded) return;
    if (needsSession && !sessionId) return;

    const attachmentNames = pendingUploads.map(p => p.fileName);
    const displayParts: string[] = [];
    if (attachmentNames.length) {
      displayParts.push(`📎 Teaching data: ${attachmentNames.join(', ')}`);
    }
    if (text) displayParts.push(text);

    const senderRole: Message['role'] = isFounder ? 'founder' : 'student';
    const userMsg: Message = {
      id: `pending-${senderRole}-${Date.now()}`,
      role: senderRole,
      content: displayParts.join('\n\n'),
      attachments: attachmentNames,
      timestamp: new Date(),
      speakerName: isFounder ? undefined : userName,
    };

    const uploadIds = pendingUploads.map(p => p.id);

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setPendingUploads([]);
    setThinking(true);
    setIsSearching(false);
    setSearchQuery('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const adamMsgId = `pending-adam-${Date.now()}`;
    let fullText = '';

    const chatUrl = isFounder
      ? `${API}/api/adam/chat`
      : studentChannel === 'group'
        ? `${API}/api/adam/student/group/chat`
        : `${API}/api/adam/student/chat`;

    const body: Record<string, unknown> = { message: text, mode, uploadIds };
    if (sessionId) body.sessionId = sessionId;

    const controller = new AbortController();

    try {
      const res = await fetch(chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error(`API error: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = '';

      setMessages(prev => [...prev, {
        id: adamMsgId,
        role: 'adam',
        content: '',
        timestamp: new Date(),
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('event:')) {
            currentEvent = line.replace('event:', '').trim();
          } else if (line.startsWith('data:')) {
            const data = line.replace('data:', '').trim();
            try {
              const parsed = JSON.parse(data);
              if (currentEvent === 'adam_thinking' && parsed.sessionId) {
                setSessionId(parsed.sessionId);
              }
              if (currentEvent === 'adam_searching') {
                setIsSearching(true);
                setSearchQuery(typeof parsed.query === 'string' ? parsed.query : 'Searching…');
              }
              if (currentEvent === 'adam_search_done') {
                setIsSearching(false);
              }
              if (currentEvent === 'adam_chunk' && parsed.text) {
                fullText += parsed.text;
                setMessages(prev => prev.map(m =>
                  m.id === adamMsgId ? { ...m, content: clean(fullText) } : m
                ));
              }
              if (currentEvent === 'adam_complete') {
                const fromText = extractJudgment(fullText);
                const judgment = parsed.judgment ?? fromText.judgment;
                const k24Address = parsed.k24Address ?? fromText.k24Address;
                const display = parsed.response
                  ? clean(parsed.response)
                  : clean(fullText);
                setMessages(prev => prev.map(m =>
                  m.id === adamMsgId
                    ? { ...m, content: display, judgment, k24Address }
                    : m
                ));
                if (parsed.sessionId) setSessionId(parsed.sessionId);
                if (parsed.messageId) {
                  setMessages(prev => prev.map(m =>
                    m.id === adamMsgId ? { ...m, id: parsed.messageId } : m
                  ));
                }
              }
            } catch {
              // ignore malformed SSE JSON
            }
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setMessages(prev => prev.map(m =>
          m.id === adamMsgId
            ? { ...m, content: 'Connection interrupted. Please try again.' }
            : m
        ));
      }
    } finally {
      setThinking(false);
      setIsSearching(false);
      setSearchQuery('');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (isSendShortcut(e)) {
      e.preventDefault();
      sendMessage();
    }
  }

  const modes: Mode[] = ['TEACHING', 'QUESTIONING', 'CONSTITUTIONAL', 'AUDIT', 'JOURNAL_GEN'];

  const showChatInput = !readOnly && (
    (isFounder && founderView === 'CHAT') ||
    (!isFounder && (studentChannel === 'private' || studentChannel === 'group'))
  );

  const activeChatView = isFounder
    ? founderView === 'CHAT' || founderView === 'GROUP'
    : true;

  async function resolveConsult(consultId: string) {
    try {
      await fetch(`${API}/api/adam/consults/${encodeURIComponent(consultId)}/resolve`, {
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
    setHistoryLoaded(false);
  }

  const headerSubtitle = isFounder
    ? founderView === 'GROUP'
      ? 'Group · Read-only'
      : founderView === 'CONSULTS'
        ? 'Consult inbox'
        : sessionId
          ? `Session · ${sessionId.slice(-8)}`
          : historyLoaded
            ? 'QXK24 · ERA_1'
            : 'Loading session…'
    : studentChannel === 'group'
      ? 'Alamtologi Group'
      : sessionId
        ? `${userName} · ${sessionId.slice(-8)}`
        : historyLoaded
          ? userName
          : 'Loading…';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      background: '#fff',
      maxWidth: 720,
      margin: '0 auto',
      width: '100%',
    }}>

      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a', letterSpacing: '0.15em', margin: 0 }}>
            ADAM
          </h1>
          <p style={{ fontSize: 10, color: '#bbb', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            {headerSubtitle}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={handleRefreshScreen}
            disabled={refreshing || thinking}
            title="Reload session and messages"
            aria-label="Refresh screen"
            style={{
              fontSize: 11,
              color: refreshing ? '#999' : '#666',
              background: '#fafafa',
              border: '1px solid #e8e8e8',
              borderRadius: 6,
              padding: '6px 12px',
              cursor: refreshing || thinking ? 'not-allowed' : 'pointer',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: refreshing || thinking ? 0.6 : 1,
            }}
          >
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
          <button
            type="button"
            onClick={onSignOut}
            style={{
              fontSize: 11,
              color: '#bbb',
              background: 'none',
              border: '1px solid #e8e8e8',
              borderRadius: 6,
              padding: '6px 12px',
              cursor: 'pointer',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #f0f0f0',
        flexShrink: 0,
        overflowX: 'auto',
      }}>
        {isFounder ? (
          ([
            ['CHAT', 'Teaching'],
            ['KNOWLEDGE', 'Absorb'],
            ['CONSULTS', 'Consults'],
            ['GROUP', 'Group'],
          ] as const).map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => switchFounderView(v)}
              style={{
                flex: 1,
                minWidth: 72,
                padding: '11px 8px',
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: 'none',
                borderBottom: founderView === v ? '2px solid #1a1a1a' : '2px solid transparent',
                background: 'none',
                color: founderView === v ? '#1a1a1a' : '#bbb',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))
        ) : (
          (['private', 'group'] as const).map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => switchStudentChannel(ch)}
              style={{
                flex: 1,
                padding: '11px 8px',
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                border: 'none',
                borderBottom: studentChannel === ch ? '2px solid #1a1a1a' : '2px solid transparent',
                background: 'none',
                color: studentChannel === ch ? '#1a1a1a' : '#bbb',
                cursor: 'pointer',
              }}
            >
              {ch === 'private' ? 'Private' : 'Group'}
            </button>
          ))
        )}
      </div>

      {/* Mode Selector — founder teaching only */}
      {isFounder && founderView === 'CHAT' && (
        <div style={{
          padding: '10px 20px',
          borderBottom: '1px solid #f5f5f5',
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          flexShrink: 0,
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}>
          {modes.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                padding: '6px 14px',
                fontSize: 10,
                letterSpacing: '0.1em',
                borderRadius: 20,
                border: mode === m ? '1px solid #1a1a1a' : '1px solid #e8e8e8',
                background: mode === m ? '#1a1a1a' : '#fff',
                color: mode === m ? '#fff' : '#aaa',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
                flexShrink: 0,
              }}
            >
              {m.replace('_', ' ')}
            </button>
          ))}
        </div>
      )}

      {founderView === 'KNOWLEDGE' && isFounder ? (
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <ADAMKnowledge token={token} />
        </div>
      ) : founderView === 'CONSULTS' && isFounder ? (
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {consultsLoading && (
            <p style={{ color: '#bbb', fontSize: 12 }}>Loading consults…</p>
          )}
          {!consultsLoading && consults.length === 0 && (
            <p style={{ color: '#bbb', fontSize: 13, textAlign: 'center', marginTop: 40 }}>
              No pending consults.
            </p>
          )}
          {consults.map((c) => (
            <div
              key={c.id}
              style={{
                border: '1px solid #eee',
                borderRadius: 10,
                padding: 14,
                marginBottom: 12,
              }}
            >
              <p style={{ fontSize: 11, color: '#999', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {c.studentName} · {new Date(c.createdAt).toLocaleString()}
              </p>
              <p style={{ fontSize: 14, margin: '0 0 8px', lineHeight: 1.6 }}>{c.studentMessage}</p>
              {c.adamSummary && (
                <p style={{ fontSize: 12, color: '#666', margin: '0 0 10px', fontStyle: 'italic' }}>
                  ADAM: {c.adamSummary}
                </p>
              )}
              <button
                type="button"
                onClick={() => resolveConsult(c.id)}
                style={{
                  fontSize: 11,
                  padding: '6px 12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: 6,
                  background: '#fafafa',
                  cursor: 'pointer',
                }}
              >
                Mark resolved
              </button>
            </div>
          ))}
        </div>
      ) : activeChatView ? (
      <>
      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        WebkitOverflowScrolling: 'touch',
      }}>
        {messages.length === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.35,
            padding: '40px 0',
          }}>
            <p style={{
              fontSize: 'clamp(16px, 5vw, 22px)',
              marginBottom: 10,
              direction: 'rtl',
              fontFamily: 'Georgia, serif',
              color: '#1a1a1a',
              textAlign: 'center',
            }}>
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#888', textTransform: 'uppercase' }}>
              {readOnly ? 'Group observation' : isFounder ? 'Begin Teaching' : 'Speak with ADAM'}
            </p>
          </div>
        )}

        {messages.map(m => (
          <ADAMMessage
            key={m.id}
            {...m}
            actionsDisabled={thinking || uploading}
            onEdit={m.role === 'founder' && !readOnly ? () => startEditMessage(m) : undefined}
            onDelete={
              !readOnly && (m.role === 'founder' || (m.role === 'student' && !isFounder))
                ? () => confirmDeleteMessage(m)
                : undefined
            }
          />
        ))}

        {isSearching && (
          <div style={{
            padding: '10px 14px',
            background: '#f0f7ff',
            borderLeft: '3px solid #3498db',
            margin: '8px 0',
            borderRadius: 4,
            fontSize: 13,
            color: '#2980b9',
          }}>
            🔍 ADAM is searching: <em>&quot;{searchQuery}&quot;</em>
          </div>
        )}

        {thinking && !isSearching && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 4px' }}>
            {[0, 0.2, 0.4].map((delay, i) => (
              <div
                key={i}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#ddd',
                  animation: `adamPulse 1.2s ease-in-out ${delay}s infinite`,
                }}
              />
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {showChatInput && (
      <div style={{
        padding: '12px 16px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        borderTop: '1px solid #f0f0f0',
        flexShrink: 0,
        background: '#fff',
      }}>
        {pendingUploads.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            {pendingUploads.map(p => (
              <span
                key={p.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  padding: '6px 10px',
                  background: '#f5f5f5',
                  borderRadius: 8,
                  color: '#444',
                  maxWidth: '100%',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  📎 {p.fileName} ({formatSize(p.sizeBytes)})
                </span>
                <button
                  type="button"
                  onClick={() => removePendingUpload(p.id)}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#999',
                    fontSize: 14,
                    lineHeight: 1,
                    padding: 0,
                  }}
                  aria-label="Remove file"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {uploadError && (
          <p style={{ color: '#c0392b', fontSize: 12, marginBottom: 8 }}>{uploadError}</p>
        )}

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        {isFounder && (
          <>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_FILES}
          onChange={handleFilePick}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={thinking || uploading}
          title={`Attach teaching file (max ${MAX_UPLOAD_MB}MB)`}
          style={{
            padding: '12px 14px',
            border: '1px solid #e8e8e8',
            borderRadius: 12,
            background: '#fafafa',
            color: '#666',
            fontSize: 18,
            cursor: thinking || uploading ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            minHeight: 46,
            lineHeight: 1,
          }}
        >
          {uploading ? '…' : '📎'}
        </button>
          </>
        )}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => { setInput(e.target.value); autoResize(); }}
          onKeyDown={handleKeyDown}
          placeholder={isFounder ? 'Teach ADAM...' : studentChannel === 'group' ? 'Message the group...' : 'Ask ADAM...'}
          rows={1}
          style={{
            flex: 1,
            padding: '12px 14px',
            fontSize: 15,
            border: '1px solid #e8e8e8',
            borderRadius: 12,
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.5,
            color: '#1a1a1a',
            background: '#fafafa',
            boxSizing: 'border-box',
            WebkitAppearance: 'none',
            minHeight: 46,
            maxHeight: TEXTAREA_MAX_HEIGHT,
            overflowY: 'auto',
          }}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={
            (!input.trim() && !pendingUploads.length) || thinking || uploading || !historyLoaded
            || ((isFounder || studentChannel === 'private') && !sessionId)
          }
          style={{
            padding: '12px 18px',
            background:
              (!input.trim() && !pendingUploads.length) || thinking || uploading || !historyLoaded
              || ((isFounder || studentChannel === 'private') && !sessionId)
                ? '#ebebeb' : '#1a1a1a',
            color:
              (!input.trim() && !pendingUploads.length) || thinking || uploading || !historyLoaded
              || ((isFounder || studentChannel === 'private') && !sessionId)
                ? '#bbb' : '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: 14,
            cursor:
              (!input.trim() && !pendingUploads.length) || thinking || uploading || !historyLoaded
              || ((isFounder || studentChannel === 'private') && !sessionId)
                ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            minHeight: 46,
            letterSpacing: '0.05em',
          }}
        >
          Send
        </button>
        </div>
        {isFounder && (
          <p style={{ fontSize: 10, color: '#ccc', marginTop: 8, textAlign: 'center' }}>
            Enter for new line · {typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent) ? '⌘' : 'Ctrl'}+Enter to send
            {' · '}PDF, DOCX, images up to {MAX_UPLOAD_MB}MB
          </p>
        )}
      </div>
      )}
      </>
      ) : null}
    </div>
  );
}
