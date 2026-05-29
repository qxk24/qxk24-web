/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Chat View
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

import ADAMMessage from '../ADAMMessage';
import ADAMKnowledge from '../ADAMKnowledge';
import AIDILStageDashboard from './AIDILStageDashboard';
import WorkspaceSelector from '../WorkspaceSelector';
import {
  ACCEPT_FILES,
  ADAM_MODES,
  MAX_UPLOAD_MB,
  formatFileSize,
  isSendShortcut,
} from '@/lib/adam/adam-chat-types';
import type { useADAMChat } from '@/hooks/useADAMChat';

type ChatState = ReturnType<typeof useADAMChat>;

interface Props {
  chat: ChatState;
  onSignOut: () => void;
}

export default function ADAMChatView({ chat, onSignOut }: Props) {
  const {
    isFounder,
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
    handleRefreshScreen,
    sendMessage,
    autoResize,
    uploadTeachingFile,
    removePendingUpload,
    switchFounderView,
    switchStudentChannel,
    handleWorkspaceSelect,
    resolveConsult,
    startEditMessage,
    confirmDeleteMessage,
    isSessionReadyForSend,
  } = chat;

  const sendDisabled =
    (!input.trim() && !pendingUploads.length) ||
    thinking ||
    uploading ||
    !isSessionReadyForSend();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minHeight: 0,
      height: '100%',
      background: '#fff',
      maxWidth: 720,
      margin: '0 auto',
      width: '100%',
      overflow: 'hidden',
    }}>
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

      <div style={{
        display: 'flex',
        borderBottom: '1px solid #f0f0f0',
        flexShrink: 0,
        overflowX: 'auto',
      }}>
        {isFounder ? (
          ([
            ['CHAT', 'Teaching'],
            ['STAGES', 'Stages'],
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

      {!isFounder && studentChannel === 'private' && (
        <WorkspaceSelector
          token={token}
          currentWorkspaceId={activeWorkspace?.workspaceId ?? null}
          onWorkspaceSelect={handleWorkspaceSelect}
        />
      )}

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {isFounder && founderView === 'STAGES' && (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <AIDILStageDashboard token={token} refreshKey={stagesRefreshKey} />
          </div>
        )}

        {isFounder && founderView === 'KNOWLEDGE' && (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <ADAMKnowledge token={token} />
          </div>
        )}

        {isFounder && founderView === 'CONSULTS' && (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 20, WebkitOverflowScrolling: 'touch' }}>
            {consultsLoading && <p style={{ color: '#bbb', fontSize: 12 }}>Loading consults…</p>}
            {!consultsLoading && consults.length === 0 && (
              <p style={{ color: '#bbb', fontSize: 13, textAlign: 'center', marginTop: 40 }}>
                No pending consults.
              </p>
            )}
            {consults.map((c) => (
              <div key={c.id} style={{ border: '1px solid #eee', borderRadius: 10, padding: 14, marginBottom: 12 }}>
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
        )}

        {((isFounder && activeChatView) || !isFounder) && (
          <>
            {isFounder && founderView === 'CHAT' && (
              <div style={{
                padding: '8px 16px',
                borderBottom: '1px solid #f5f5f5',
                display: 'flex',
                gap: 6,
                overflowX: 'auto',
                flexShrink: 0,
              }}>
                {ADAM_MODES.map((m) => (
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

            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                WebkitOverflowScrolling: 'touch',
              }}>
                {!isSessionReadyForSend() && messages.length === 0 && !sessionLoadError && (
                  <p style={{ textAlign: 'center', color: '#999', fontSize: 12, marginTop: 24 }}>
                    Loading messages…
                  </p>
                )}
                {isSessionReadyForSend() && !historyLoaded && messages.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#bbb', fontSize: 11, marginTop: 12 }}>
                    Syncing history…
                  </p>
                )}
                {historyLoaded && sessionLoadError && (
                  <p style={{ textAlign: 'center', color: '#c0392b', fontSize: 12, marginTop: 16, lineHeight: 1.5 }}>
                    {sessionLoadError}
                  </p>
                )}
                {historyLoaded && messages.length === 0 && !sessionLoadError && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity: 0.35,
                    padding: '40px 0',
                  }}>
                    <p style={{ fontSize: 'clamp(16px, 5vw, 22px)', fontFamily: 'Georgia, serif', direction: 'rtl' }}>
                      بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                    </p>
                    <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#888', textTransform: 'uppercase' }}>
                      {readOnly ? 'Group observation' : isFounder ? 'Begin Teaching' : 'Speak with ADAM'}
                    </p>
                  </div>
                )}
                {messages.map((m) => (
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
                    fontSize: 13,
                    color: '#2980b9',
                  }}>
                    🔍 ADAM is searching: <em>&quot;{searchQuery}&quot;</em>
                  </div>
                )}
                {thinking && !isSearching && (
                  <div style={{ display: 'flex', gap: 6, padding: '8px 4px' }}>
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
                      {pendingUploads.map((p) => (
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
                          }}
                        >
                          📎 {p.fileName} ({formatFileSize(p.sizeBytes)})
                          <button type="button" onClick={() => removePendingUpload(p.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  {uploadError && (
                    <p style={{ color: '#c0392b', fontSize: 12, marginBottom: 8 }}>{uploadError}</p>
                  )}
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ACCEPT_FILES}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void uploadTeachingFile(file);
                      }}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={thinking || uploading}
                      style={{
                        padding: '12px 14px',
                        border: '1px solid #e8e8e8',
                        borderRadius: 12,
                        background: '#fafafa',
                        cursor: thinking || uploading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {uploading ? '…' : '📎'}
                    </button>
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => { setInput(e.target.value); autoResize(); }}
                      onKeyDown={(e) => {
                        if (isSendShortcut(e)) {
                          e.preventDefault();
                          void sendMessage();
                        }
                      }}
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
                        minHeight: 46,
                        background: '#fafafa',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => void sendMessage()}
                      disabled={sendDisabled}
                      style={{
                        padding: '12px 18px',
                        background: sendDisabled ? '#ebebeb' : '#1a1a1a',
                        color: sendDisabled ? '#bbb' : '#fff',
                        border: 'none',
                        borderRadius: 12,
                        cursor: sendDisabled ? 'not-allowed' : 'pointer',
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
