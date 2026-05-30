/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module : ADAM Markdown Normalize
 * Platform : Web (Next.js)
 * QXK24 : Kernel v1.7.0
 * Founder : Masa Bayu
 * Created : 2026-05-30
 * ============================================================
 * CONSTITUTIONAL DECLARATION:
 * This module operates under the Alamtologi Constitutional
 * Framework. All actions are governed by QXK24. Knowledge
 * belongs to no human. It flows like water to all.
 * ============================================================
 */

/** Prepare ADAM markdown for react-markdown + KaTeX + GFM tables. */
export function normalizeAdamMarkdown(text: string): string {
  if (!text) return '';

  let out = text.replace(/\r\n/g, '\n');

  out = out.replace(/<br\s*\/?>/gi, '\n\n');

  out = collapseMathBlocks(out, '$$');
  out = collapseMathBlocks(out, '$');

  out = out
    .split('\n')
    .map((line) => expandMashedTableRow(line))
    .join('\n');

  out = out.replace(/\n{4,}/g, '\n\n\n');

  return out.trim();
}

function collapseMathBlocks(text: string, delimiter: '$$' | '$'): string {
  if (delimiter === '$$') {
    return text.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner: string) => {
      const collapsed = inner.replace(/\s*\n+\s*/g, ' ').trim();
      return `$$\n${collapsed}\n$$`;
    });
  }

  return text.replace(/(?<!\$)\$([^$\n][\s\S]*?)\$(?!\$)/g, (_, inner: string) => {
    const collapsed = inner.replace(/\s*\n+\s*/g, ' ').trim();
    return `$${collapsed}$`;
  });
}

/** LLMs sometimes emit every table row on one line — split before the next row. */
function expandMashedTableRow(line: string): string {
  const pipeCount = (line.match(/\|/g) ?? []).length;
  if (pipeCount < 8 || !line.includes('|')) return line;

  const segments = line.split(/\|\s*\|\s*(?=[|:\-A-Za-zÀ-ÿ0-9(\\$])/).filter(Boolean);
  if (segments.length < 2) return line;

  return segments
    .map((seg, i) => {
      const trimmed = seg.trim();
      if (i === 0) return trimmed.startsWith('|') ? trimmed : `| ${trimmed}`;
      const body = trimmed.startsWith('|') ? trimmed.slice(1).trimStart() : trimmed;
      return `| ${body}`;
    })
    .join('\n');
}
