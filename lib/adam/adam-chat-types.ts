/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Chat Types
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

export const ADAM_API =
  process.env.NEXT_PUBLIC_QXK24_API_URL ?? 'https://api.qxk24.com';

export type Mode =
  | 'TEACHING'
  | 'QUESTIONING'
  | 'CONSTITUTIONAL'
  | 'AUDIT'
  | 'JOURNAL_GEN';

export interface AdamChatMessage {
  id: string;
  role: 'founder' | 'student' | 'adam';
  content: string;
  judgment?: string;
  k24Address?: string;
  timestamp: Date;
  attachments?: string[];
  speakerName?: string;
  isFounderRelay?: boolean;
  isStudentRelay?: boolean;
}

export interface ConsultItem {
  id: string;
  studentId: string;
  studentName: string;
  studentMessage: string;
  adamSummary: string;
  status: string;
  createdAt: string;
}

export type FounderView = 'CHAT' | 'KNOWLEDGE' | 'STAGES' | 'CONSULTS' | 'GROUP';
export type StudentChannel = 'private' | 'group';

export interface PendingUpload {
  id: string;
  fileName: string;
  sizeBytes: number;
}

export const MAX_UPLOAD_MB = 30;
export const TEXTAREA_MAX_HEIGHT = 220;
export const ACCEPT_FILES = '*/*';

export const ADAM_MODES: Mode[] = [
  'TEACHING',
  'QUESTIONING',
  'CONSTITUTIONAL',
  'AUDIT',
  'JOURNAL_GEN',
];

export function isSendShortcut(e: React.KeyboardEvent): boolean {
  return e.key === 'Enter' && (e.metaKey || e.ctrlKey);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function historyUrl(basePath: string, sessionId: string): string {
  return `${basePath}/${encodeURIComponent(sessionId)}?_=${Date.now()}`;
}
