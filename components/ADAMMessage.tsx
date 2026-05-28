/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Message
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

import type { ADAMMessage, ADAMJudgment } from '@/lib/adam-client';

interface ADAMMessageProps {
  message: ADAMMessage;
}

function JudgmentBadge({ judgment }: { judgment: ADAMJudgment }) {
  const config = {
    MAKMUR: { bg: 'bg-emerald-50',  text: 'text-emerald-600', border: 'border-emerald-200' },
    ISLAH:  { bg: 'bg-amber-50',    text: 'text-amber-600',   border: 'border-amber-200'   },
    WAQF:   { bg: 'bg-red-50',      text: 'text-red-600',     border: 'border-red-200'     },
  }[judgment];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs border ${config.bg} ${config.border} ${config.text}`}>
      {judgment}
    </span>
  );
}

function cleanContent(content: string): string {
  return content
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

export default function ADAMMessageComponent({ message }: ADAMMessageProps) {
  const isFounder = message.role === 'founder';
  const content   = cleanContent(message.content);

  const time = new Date(message.timestamp).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  });

  if (isFounder) {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-[70%]">
          <div className="bg-gray-900 text-white rounded-2xl rounded-tr-sm px-5 py-3.5">
            <p className="text-sm leading-relaxed">{content}</p>
          </div>
          <p className="text-gray-300 text-xs mt-1 text-right">{time}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-[75%]">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">A</span>
          </div>
          <span className="text-gray-400 text-xs tracking-widest">ADAM</span>
          {message.k24Address && (
            <span className="text-gray-300 text-xs">{message.k24Address}</span>
          )}
          {message.judgment && (
            <JudgmentBadge judgment={message.judgment} />
          )}
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4">
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        <p className="text-gray-300 text-xs mt-1 ml-1">{time}</p>
      </div>
    </div>
  );
}
