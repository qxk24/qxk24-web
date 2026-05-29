/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Workspace Selector (AIDIL family per book)
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

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { readApiJson } from '@/lib/api-response';
import { adamApiFetch } from '@/lib/adam-session-storage';

const TITLE_MAX = 200;
const DESCRIPTION_MAX = 8000;

const API = process.env.NEXT_PUBLIC_QXK24_API_URL ?? 'https://api.qxk24.com';

const PRINCIPLES = [
  'MASA', 'TENAGA', 'AIR', 'API', 'BUMI', 'CAHAYA', 'RUANG', 'MULTI',
] as const;

const CATEGORIES = [
  'Book', 'Research', 'Essay', 'Teaching',
  'Thesis', 'Article', 'Notes', 'General',
];

export type StudentWorkspace = {
  workspaceId: string;
  title: string;
  description?: string;
  category: string;
  principle: string;
  stage: number;
  messageCount: number;
  masa_last_active: string;
  sessionId: string;
};

const principleColors: Record<string, string> = {
  MASA: '#2c3e50',
  TENAGA: '#e74c3c',
  AIR: '#3498db',
  API: '#e67e22',
  BUMI: '#27ae60',
  CAHAYA: '#f1c40f',
  RUANG: '#9b59b6',
  MULTI: '#95a5a6',
};

type Props = {
  token: string;
  currentWorkspaceId: string | null;
  onWorkspaceSelect: (workspace: StudentWorkspace | null) => void;
};

export default function WorkspaceSelector({
  token,
  currentWorkspaceId,
  onWorkspaceSelect,
}: Props) {
  const [workspaces, setWorkspaces] = useState<StudentWorkspace[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'General',
    principle: 'MULTI',
  });

  const loadWorkspaces = useCallback(async () => {
    try {
      const res = await adamApiFetch(`${API}/api/workspaces`, token);
      const data = await res.json();
      if (data.success && Array.isArray(data.workspaces)) {
        setWorkspaces(data.workspaces);
      }
    } catch (err) {
      console.error('Failed to load workspaces', err);
    }
  }, [token]);

  useEffect(() => {
    void loadWorkspaces();
  }, [loadWorkspaces]);

  async function handleCreate(e?: FormEvent) {
    e?.preventDefault();
    const title = form.title.trim();
    const description = form.description.trim();
    if (!title) {
      setCreateError('Please enter a book title.');
      return;
    }
    if (title.length > TITLE_MAX) {
      setCreateError(`Title is too long (max ${TITLE_MAX} characters).`);
      return;
    }
    if (description.length > DESCRIPTION_MAX) {
      setCreateError(`Description is too long (max ${DESCRIPTION_MAX} characters).`);
      return;
    }

    setCreating(true);
    setCreateError('');
    try {
      const res = await adamApiFetch(`${API}/api/workspaces`, token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || undefined,
          category: form.category,
          principle: form.principle,
        }),
      });
      const parsed = await readApiJson(res);
      if (parsed.ok && parsed.body?.workspace) {
        await loadWorkspaces();
        setShowCreate(false);
        setCreateError('');
        setForm({ title: '', description: '', category: 'General', principle: 'MULTI' });
        onWorkspaceSelect(parsed.body.workspace as StudentWorkspace);
        return;
      }
      setCreateError(
        parsed.errorMessage ||
          'Could not create book. Check your connection and try again.',
      );
    } catch (err) {
      console.error('Failed to create workspace', err);
      setCreateError('Network error. Check your connection and try again.');
    } finally {
      setCreating(false);
    }
  }

  const activeWs = workspaces.find(w => w.workspaceId === currentWorkspaceId);

  return (
    <div style={{ padding: '0 20px 12px', flexShrink: 0 }}>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>

        <button
          type="button"
          onClick={() => onWorkspaceSelect(null)}
          style={{
            flexShrink: 0,
            padding: '6px 12px',
            borderRadius: 20,
            border: !currentWorkspaceId ? '2px solid #1a1a1a' : '1px solid #eee',
            background: !currentWorkspaceId ? '#1a1a1a' : '#fff',
            color: !currentWorkspaceId ? '#fff' : '#666',
            cursor: 'pointer',
            fontSize: 12,
            whiteSpace: 'nowrap',
          }}
        >
          General
        </button>

        {workspaces.map(ws => (
          <button
            key={ws.workspaceId}
            type="button"
            onClick={() => onWorkspaceSelect(ws)}
            style={{
              flexShrink: 0,
              padding: '6px 12px',
              borderRadius: 20,
              border: currentWorkspaceId === ws.workspaceId
                ? `2px solid ${principleColors[ws.principle] ?? '#1a1a1a'}`
                : '1px solid #eee',
              background: currentWorkspaceId === ws.workspaceId
                ? principleColors[ws.principle] ?? '#1a1a1a'
                : '#fff',
              color: currentWorkspaceId === ws.workspaceId ? '#fff' : '#666',
              cursor: 'pointer',
              fontSize: 12,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 9, opacity: 0.8 }}>
              {'●'.repeat(Math.min(ws.stage, 7))}
            </span>
            {ws.title.length > 15 ? `${ws.title.slice(0, 15)}…` : ws.title}
          </button>
        ))}

        <button
          type="button"
          onClick={() => {
            setCreateError('');
            setShowCreate(true);
          }}
          style={{
            flexShrink: 0,
            padding: '6px 12px',
            borderRadius: 20,
            border: '1px dashed #ccc',
            background: '#fafafa',
            color: '#999',
            cursor: 'pointer',
            fontSize: 12,
            whiteSpace: 'nowrap',
          }}
        >
          + New Book
        </button>
      </div>

      {activeWs && (
        <div style={{
          padding: '6px 12px',
          background: '#f8f8f8',
          borderRadius: 8,
          fontSize: 11,
          color: '#888',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>
            {activeWs.title} · {activeWs.principle} · Stage {activeWs.stage}/7
          </span>
          <span>{activeWs.messageCount} messages</span>
        </div>
      )}

      {showCreate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 400,
          }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>New Book / Project</h3>
            <p style={{ margin: '0 0 20px', fontSize: 12, color: '#888' }}>
              ADAM treats this as a separate AIDIL family. No mixing with other books.
            </p>

            <form
              onSubmit={(e) => void handleCreate(e)}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <input
                placeholder="Title (e.g. Tafsir Masa, Book 1)"
                value={form.title}
                maxLength={TITLE_MAX}
                onChange={e => {
                  setCreateError('');
                  setForm(p => ({ ...p, title: e.target.value }));
                }}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #eee',
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />

              <textarea
                placeholder="Description (optional)"
                value={form.description}
                maxLength={DESCRIPTION_MAX}
                onChange={e => {
                  setCreateError('');
                  setForm(p => ({ ...p, description: e.target.value }));
                }}
                rows={4}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #eee',
                  borderRadius: 8,
                  fontSize: 13,
                  resize: 'none',
                }}
              />

              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    border: '1px solid #eee',
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  value={form.principle}
                  onChange={e => setForm(p => ({ ...p, principle: e.target.value }))}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    border: '1px solid #eee',
                    borderRadius: 8,
                    fontSize: 13,
                    color: principleColors[form.principle],
                  }}
                >
                  {PRINCIPLES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div style={{
                padding: '10px 14px',
                background: '#f8f8f8',
                borderRadius: 8,
                fontSize: 11,
                color: '#888',
              }}>
                AIDIL: own nucleus and transformation chain. Stage 1/7 begins with your first message.
                {form.description.length > 0 && (
                  <span style={{ display: 'block', marginTop: 6 }}>
                    Description: {form.description.length}/{DESCRIPTION_MAX}
                  </span>
                )}
              </div>

              {createError && (
                <p style={{
                  margin: 0,
                  fontSize: 12,
                  color: '#c0392b',
                  lineHeight: 1.5,
                }}>
                  {createError}
                </p>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    setCreateError('');
                    setShowCreate(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid #eee',
                    borderRadius: 8,
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !form.title.trim()}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: 8,
                    background: creating ? '#ccc' : '#1a1a1a',
                    color: '#fff',
                    cursor: creating || !form.title.trim() ? 'default' : 'pointer',
                    fontSize: 13,
                  }}
                >
                  {creating ? 'Creating…' : 'Create Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
