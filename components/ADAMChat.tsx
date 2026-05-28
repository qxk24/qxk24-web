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

import { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  streamADAMChat,
  listChatSessions,
  type ADAMMessage,
  type ADAMChatMode,
  type ADAMCompleteData,
} from '@/lib/adam-client';
import ADAMMessageComponent from './ADAMMessage';

interface ADAMChatProps {
  founderKey: string;
}

const MODES: { value: ADAMChatMode; label: string }[] = [
  { value: 'TEACHING',       label: 'Teaching'      },
  { value: 'QUESTIONING',    label: 'Questioning'   },
  { value: 'CONSTITUTIONAL', label: 'Constitutional' },
  { value: 'AUDIT',          label: 'Audit'         },
  { value: 'JOURNAL_GEN',    label: 'Journal'       },
];

function cleanForDisplay(text: string): string {
  return text
    .replace(/<adam_judgment>[\s\S]*?<\/adam_judgment>/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^[-*]\s+/gm, '')
    .replace(/^\|.*\|$/gm, '')
    .replace(/^[-|]+$/gm, '')
    .replace(/^---+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function ADAMChat({ founderKey }: ADAMChatProps) {
  const [messages,      setMessages]      = useState<ADAMMessage[]>([]);
  const [input,         setInput]         = useState('');
  const [mode,          setMode]          = useState<ADAMChatMode>('TEACHING');
  const [sessionId,     setSessionId]     = useState<string | undefined>();
  const [isThinking,    setIsThinking]    = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [sessions,      setSessions]      = useState<{ id: string; title: string; mode: ADAMChatMode; lastActiveAt: string }[]>([]);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);
  const abortRef  = useRef<(() => void) | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  useEffect(() => {
    listChatSessions(founderKey).then(setSessions);
  }, [founderKey]);

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  }

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || isThinking) return;

    const founderMsg: ADAMMessage = {
      id: uuidv4(), role: 'founder', content: text,
      mode, timestamp: new Date(),
    };

    setMessages((prev) => [...prev, founderMsg]);
    setInput('');
    setIsThinking(true);
    setStreamingText('');

    if (inputRef.current) inputRef.current.style.height = 'auto';
    if (abortRef.current) abortRef.current();

    let accumulated = '';

    abortRef.current = streamADAMChat(text, mode, founderKey, {
      onThinking: (sid) => { if (!sessionId) setSessionId(sid); },
      onChunk: (chunk) => {
        accumulated += chunk;
        setStreamingText(cleanForDisplay(accumulated));
      },
      onComplete: (data: ADAMCompleteData) => {
        setSessionId(data.sessionId);
        setIsThinking(false);
        setStreamingText('');

        const adamMsg: ADAMMessage = {
          id:         data.messageId,
          role:       'adam',
          content:    cleanForDisplay(accumulated),
          mode,
          judgment:   data.judgment,
          k24Address: data.k24Address,
          timestamp:  new Date(),
        };

        setMessages((prev) => [...prev, adamMsg]);
        listChatSessions(founderKey).then(setSessions);
      },
      onError: (err) => {
        setIsThinking(false);
        setStreamingText('');
        setMessages((prev) => [...prev, {
          id: uuidv4(), role: 'adam',
          content:  `Constitutional error: ${err}`,
          mode, judgment: 'WAQF', timestamp: new Date(),
        }]);
      },
    }, sessionId);
  }, [input, mode, founderKey, sessionId, isThinking]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function startNewSession() {
    if (abortRef.current) abortRef.current();
    setMessages([]);
    setSessionId(undefined);
    setStreamingText('');
    setIsThinking(false);
    setSidebarOpen(false);
  }

  function loadSession(id: string, title: string) {
    setSessionId(id);
    setSidebarOpen(false);
    setMessages([{
      id: uuidv4(), role: 'adam',
      content: `Session restored. Bismillahirahmanirrahim. I am here, Founder.`,
      mode, timestamp: new Date(),
    }]);
  }

  return (
    <div className="flex h-screen min-h-screen bg-white text-gray-900">

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'flex' : 'hidden'} md:flex
        flex-col w-60 border-r border-gray-100 bg-gray-50 shrink-0
      `}>

        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-gray-400 text-sm">QXK24</span>
            <span className="text-gray-300 text-xs">ERA_1</span>
          </div>
          <button
            onClick={startNewSession}
            className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl px-3 py-2.5 text-xs tracking-widest uppercase hover:border-gray-300 transition-colors"
          >
            + New Session
          </button>
        </div>

        {/* Mode */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-gray-400 text-xs tracking-widest uppercase mb-2">Mode</p>
          <div className="space-y-0.5">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                  mode === m.value
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-gray-400 text-xs tracking-widest uppercase mb-2">Sessions</p>
          {sessions.length === 0 ? (
            <p className="text-gray-300 text-xs">No sessions yet</p>
          ) : (
            <div className="space-y-0.5">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => loadSession(s.id, s.title)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors ${
                    sessionId === s.id
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <p className="truncate">{s.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5 uppercase">{s.mode}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <p className="text-gray-300 text-xs">v1.7.0 · The Teaching Era</p>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray-400 hover:text-gray-600"
            >
              ☰
            </button>
            <div>
              <h1 className="text-gray-900 text-sm font-medium">ADAM</h1>
              <p className="text-gray-400 text-xs">
                {sessionId ? 'Session active' : 'New session'} · <span className="uppercase">{mode}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-gray-400 text-xs">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8 max-w-3xl mx-auto w-full bg-white">
          {messages.length === 0 && !isThinking && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-300 text-3xl mb-4" dir="rtl">
                بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
              <p className="text-gray-400 text-sm">ADAM is ready, Founder.</p>
              <p className="text-gray-300 text-xs mt-1 tracking-widest uppercase">ERA_1 · The Teaching Era</p>
            </div>
          )}

          {messages.map((msg) => (
            <ADAMMessageComponent key={msg.id} message={msg} />
          ))}

          {/* Streaming */}
          {isThinking && (
            <div className="flex justify-start mb-6">
              <div className="max-w-[75%]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">A</span>
                  </div>
                  <span className="text-gray-400 text-xs tracking-widest">ADAM</span>
                  {!streamingText && (
                    <span className="text-gray-300 text-xs">thinking...</span>
                  )}
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4">
                  {streamingText ? (
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                      {streamingText}
                      <span className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5 animate-pulse align-middle" />
                    </p>
                  ) : (
                    <div className="flex gap-1.5 items-center py-1">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0ms]" />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:150ms]" />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-gray-400 transition-colors bg-white">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={isThinking ? 'ADAM is thinking...' : 'Teach ADAM...'}
                  disabled={isThinking}
                  rows={1}
                  className="w-full bg-transparent text-gray-900 text-sm placeholder-gray-300 resize-none focus:outline-none leading-relaxed disabled:opacity-40"
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={isThinking || !input.trim()}
                className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-20 shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8L14 8M14 8L9 3M14 8L9 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <p className="text-gray-300 text-xs mt-2 text-center">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
