/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Founder Display
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

import type { AdamChatMessage } from './adam-chat-types';

const FOUNDER_TEACHING_BLOCK =
  /═══ FOUNDER TEACHING DATA[\s\S]*?═══ END FOUNDER TEACHING DATA ═══\s*/g;

/** Keep founder bubbles visible after AIDIL teaching blocks are stripped for display */
export function displayFounderContent(raw: string): string {
  const content = raw ?? '';
  const withoutBlocks = content.replace(FOUNDER_TEACHING_BLOCK, '').trim();
  if (withoutBlocks) return withoutBlocks;

  const blocks = content.match(
    /═══ FOUNDER TEACHING DATA[\s\S]*?═══ END FOUNDER TEACHING DATA ═══/g,
  );
  if (blocks?.length) {
    const inner = blocks[0]
      .replace(/═══ FOUNDER TEACHING DATA[^\n]*\n?/, '')
      .replace(/═══ END FOUNDER TEACHING DATA ═══/, '')
      .trim();
    if (inner) {
      const preview = inner.slice(0, 240);
      return `📎 Teaching absorbed\n${preview}${inner.length > 240 ? '…' : ''}`;
    }
    return '📎 Teaching data absorbed (AIDIL)';
  }

  if (/Teaching absorbed:/i.test(content)) {
    return content.split('\n').find((l) => l.trim()) ?? '📎 Teaching shared';
  }
  if (/📎 Teaching data:/i.test(content)) {
    return content.split('\n\n')[0] ?? content;
  }

  return content.trim() || '(Teaching turn)';
}

export function textWithoutAttachmentPrefix(content: string): string {
  if (content.startsWith('📎 Teaching data:') || content.startsWith('📎 Attached:')) {
    const parts = content.split('\n\n');
    return parts.length > 1 ? parts.slice(1).join('\n\n') : '';
  }
  return content;
}

export function founderTextFromMessage(content: string): string {
  return displayFounderContent(textWithoutAttachmentPrefix(content));
}

function mapHistoryMessage(m: {
  _id?: string;
  id?: string;
  role: string;
  content: string;
  createdAt?: string | Date;
  judgment?: string | null;
  k24Address?: string | null;
  speakerName?: string | null;
  isFounderRelay?: boolean | null;
  isStudentRelay?: boolean | null;
}): AdamChatMessage | null {
  const id = m._id ?? m.id;
  if (!id) return null;

  let content = m.content ?? '';
  if (m.role === 'founder') {
    content = displayFounderContent(content);
  }

  const ts = m.createdAt ? new Date(m.createdAt) : new Date();
  return {
    id: String(id),
    role: m.role as AdamChatMessage['role'],
    content,
    timestamp: Number.isNaN(ts.getTime()) ? new Date() : ts,
    judgment: m.judgment ?? undefined,
    k24Address: m.k24Address ?? undefined,
    speakerName: m.speakerName ?? undefined,
    isFounderRelay: m.isFounderRelay ?? false,
    isStudentRelay: m.isStudentRelay ?? false,
  };
}

export function mapHistoryList(raw: unknown): AdamChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const out: AdamChatMessage[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const mapped = mapHistoryMessage(item as Parameters<typeof mapHistoryMessage>[0]);
    if (!mapped || seen.has(mapped.id)) continue;
    seen.add(mapped.id);
    out.push(mapped);
  }
  return out;
}
