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

interface Props {
  role: 'founder' | 'student' | 'adam';
  content: string;
  speakerName?: string;
  isFounderRelay?: boolean;
  judgment?: string;
  k24Address?: string;
  timestamp: Date;
  onEdit?: () => void;
  onDelete?: () => void;
  actionsDisabled?: boolean;
}

function clean(text: string): string {
  if (!text) return '';
  return text
    .replace(/<adam_judgment>[\s\S]*?<\/adam_judgment>/g, '')
    .replace(/═══ FOUNDER TEACHING DATA[\s\S]*?═══ END FOUNDER TEACHING DATA ═══/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/^\s*[-•]\s/gm, '')
    .replace(/^---\s*$/gm, '')
    .trim();
}

const judgmentColor: Record<string, string> = {
  MAKMUR: '#27ae60',
  ISLAH: '#e67e22',
  WAQF: '#c0392b',
};

export default function ADAMMessage({
  role,
  speakerName,
  isFounderRelay,
  content,
  judgment,
  k24Address,
  timestamp,
  onEdit,
  onDelete,
  actionsDisabled,
}: Props) {
  const isAdam = role === 'adam';
  const isRelay = Boolean(isFounderRelay);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isAdam ? 'flex-start' : 'flex-end',
      marginBottom: 20,
      width: '100%',
    }}>
      <div style={{
        maxWidth: 'min(75%, 520px)',
        background: isRelay ? '#fffbeb' : isAdam ? '#f5f5f5' : '#1a1a1a',
        color: isRelay ? '#78350f' : isAdam ? '#1a1a1a' : '#ffffff',
        border: isRelay ? '1px solid #fcd34d' : 'none',
        borderRadius: isAdam ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
        padding: '12px 16px',
        wordBreak: 'break-word',
      }}>
        {(isAdam || (role === 'student' && speakerName)) && (
          <p style={{
            fontSize: 9,
            letterSpacing: '0.2em',
            color: isRelay ? '#b45309' : '#bbb',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            {isRelay ? 'Founder via ADAM' : isAdam ? 'ADAM' : speakerName}
          </p>
        )}
        <p style={{
          fontSize: 'clamp(13px, 3.5vw, 15px)',
          lineHeight: 1.8,
          whiteSpace: 'pre-wrap',
          margin: 0,
        }}>
          {clean(content)}
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
        marginTop: 5,
        paddingLeft: isAdam ? 4 : 0,
        paddingRight: isAdam ? 0 : 4,
      }}>
        {isAdam && judgment && (
          <span style={{
            fontSize: 10,
            letterSpacing: '0.1em',
            color: judgmentColor[judgment] ?? '#888',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}>
            {judgment}
          </span>
        )}
        {isAdam && k24Address && (
          <span style={{ fontSize: 10, color: '#bbb', letterSpacing: '0.1em' }}>
            {k24Address}
          </span>
        )}
        <span style={{ fontSize: 10, color: '#ccc' }}>
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {role === 'founder' && onEdit && onDelete && (
          <span style={{ display: 'flex', gap: 6, marginLeft: 4 }}>
            <button
              type="button"
              onClick={onEdit}
              disabled={actionsDisabled}
              style={{
                fontSize: 10,
                color: actionsDisabled ? '#ddd' : '#888',
                background: 'none',
                border: 'none',
                cursor: actionsDisabled ? 'not-allowed' : 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={actionsDisabled}
              style={{
                fontSize: 10,
                color: actionsDisabled ? '#ddd' : '#c0392b',
                background: 'none',
                border: 'none',
                cursor: actionsDisabled ? 'not-allowed' : 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Delete
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
