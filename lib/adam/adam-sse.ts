/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM SSE Helpers
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

/** Parse SSE blocks (handles CRLF from proxies and mobile browsers). */
export function consumeSseBlocks(
  buffer: string,
  onBlock: (event: string, data: string) => void,
): string {
  const parts = buffer.split(/\r?\n\r?\n/);
  const rest = parts.pop() ?? '';

  for (const block of parts) {
    if (!block.trim()) continue;
    let eventName = '';
    const dataLines: string[] = [];

    for (const rawLine of block.split(/\r?\n/)) {
      const line = rawLine.replace(/\r$/, '');
      if (line.startsWith('event:')) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).trim());
      }
    }

    if (eventName) {
      onBlock(eventName, dataLines.join('\n'));
    }
  }

  return rest;
}

export function cleanAdamText(text: string): string {
  if (!text) return '';
  return text.replace(/<adam_judgment>[\s\S]*?<\/adam_judgment>/g, '').trim();
}

export function extractJudgment(text: string): {
  judgment: string;
  k24Address?: string;
} {
  const match = text.match(/<adam_judgment>([\s\S]*?)<\/adam_judgment>/);
  if (match) {
    try {
      const p = JSON.parse(match[1]) as { judgment?: string; k24Address?: string };
      return { judgment: p.judgment ?? 'ISLAH', k24Address: p.k24Address };
    } catch {
      // fall through
    }
  }
  if (/\bMAKMUR\b/.test(text)) return { judgment: 'MAKMUR' };
  if (/\bWAQF\b/.test(text)) return { judgment: 'WAQF' };
  return { judgment: 'ISLAH' };
}
