/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : Founder Upload File Detection (Web)
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

export const FOUNDER_UPLOAD_EXTENSIONS = [
  '.pdf', '.doc', '.docx',
  '.txt', '.md', '.markdown',
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif',
] as const;

const EXT_LABEL: Record<string, string> = {
  '.pdf': 'PDF',
  '.doc': 'DOC',
  '.docx': 'DOCX',
  '.txt': 'TXT',
  '.md': 'MD',
  '.markdown': 'MD',
  '.jpg': 'JPG',
  '.jpeg': 'JPG',
  '.png': 'PNG',
  '.gif': 'GIF',
  '.webp': 'WEBP',
  '.heic': 'HEIC',
  '.heif': 'HEIF',
};

const MIME_ALIASES: Record<string, string> = {
  'application/x-pdf': 'application/pdf',
  'application/x-msword': 'application/msword',
};

const KNOWN_MIMES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
]);

function extensionOf(fileName: string): string {
  const i = fileName.lastIndexOf('.');
  if (i <= 0) return '';
  return fileName.slice(i).toLowerCase();
}

function sniffHeader(bytes: Uint8Array): { ext?: string; mime?: string } {
  if (bytes.length >= 4) {
    const sig4 = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
    if (sig4 === '%PDF') return { ext: '.pdf', mime: 'application/pdf' };
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { ext: '.jpg', mime: 'image/jpeg' };
  }
  if (
    bytes.length >= 8
    && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
  ) {
    return { ext: '.png', mime: 'image/png' };
  }
  if (bytes.length >= 6 && bytes[0] === 0x50 && bytes[1] === 0x4b) {
    const sample = new TextDecoder('latin1').decode(bytes.subarray(0, Math.min(bytes.length, 4096)));
    if (sample.includes('word/')) {
      return {
        ext: '.docx',
        mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
    }
  }
  return {};
}

export function supportedFormatsHint(): string {
  return 'PDF, DOCX, DOC, TXT, MD, JPG, PNG, GIF, WEBP';
}

export async function detectFounderFile(file: File): Promise<{
  allowed: boolean;
  label: string;
  effectiveExt: string;
}> {
  const name = file.name.toLowerCase();
  const ext = extensionOf(name);
  const mime = MIME_ALIASES[file.type] ?? file.type;

  if ((FOUNDER_UPLOAD_EXTENSIONS as readonly string[]).includes(ext)) {
    return { allowed: true, label: EXT_LABEL[ext] ?? 'FILE', effectiveExt: ext };
  }
  if (KNOWN_MIMES.has(mime) || mime.startsWith('image/')) {
    const fromMime = mime === 'application/pdf' ? '.pdf'
      : mime.includes('wordprocessingml') ? '.docx'
      : mime === 'application/msword' ? '.doc'
      : mime.startsWith('image/') ? '.jpg'
      : '';
    return { allowed: true, label: EXT_LABEL[fromMime] ?? 'FILE', effectiveExt: fromMime };
  }

  const head = new Uint8Array(await file.slice(0, 4096).arrayBuffer());
  const sniffed = sniffHeader(head);
  if (sniffed.ext) {
    return {
      allowed: true,
      label: EXT_LABEL[sniffed.ext] ?? 'FILE',
      effectiveExt: sniffed.ext,
    };
  }

  return { allowed: false, label: 'FILE', effectiveExt: '' };
}
