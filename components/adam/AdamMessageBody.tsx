/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module : Adam Message Body
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

'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Components } from 'react-markdown';
import 'katex/dist/katex.min.css';
import { normalizeAdamMarkdown } from '@/lib/adam/adam-markdown-normalize';
import styles from './AdamMessageBody.module.css';

export function stripAdamDisplayMetadata(text: string): string {
  if (!text) return '';
  return text
    .replace(/<adam_judgment>[\s\S]*?<\/adam_judgment>/g, '')
    .replace(
      /═══ FOUNDER TEACHING DATA[\s\S]*?═══ END FOUNDER TEACHING DATA ═══/g,
      '',
    )
    .trim();
}

const markdownComponents: Components = {
  p: ({ children }) => <p className={styles.p}>{children}</p>,
  ul: ({ children }) => <ul className={styles.ul}>{children}</ul>,
  ol: ({ children }) => <ol className={styles.ol}>{children}</ol>,
  li: ({ children }) => <li className={styles.li}>{children}</li>,
  strong: ({ children }) => <strong className={styles.strong}>{children}</strong>,
  em: ({ children }) => <em className={styles.em}>{children}</em>,
  h1: ({ children }) => <h3 className={styles.h1}>{children}</h3>,
  h2: ({ children }) => <h4 className={styles.h2}>{children}</h4>,
  h3: ({ children }) => <h5 className={styles.h3}>{children}</h5>,
  hr: () => <hr className={styles.hr} />,
  blockquote: ({ children }) => (
    <blockquote className={styles.blockquote}>{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className={styles.thead}>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className={styles.tr}>{children}</tr>,
  th: ({ children }) => <th className={styles.th}>{children}</th>,
  td: ({ children }) => <td className={styles.td}>{children}</td>,
  code: ({ className, children, ...props }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <code className={`${styles.codeBlock} ${className ?? ''}`} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={styles.codeInline} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className={styles.pre}>{children}</pre>,
};

interface Props {
  content: string;
  variant: 'adam' | 'plain';
}

export default function AdamMessageBody({ content, variant }: Props) {
  const text = normalizeAdamMarkdown(stripAdamDisplayMetadata(content));
  if (!text) return null;

  if (variant === 'plain') {
    return <p className={styles.plain}>{text}</p>;
  }

  return (
    <div className={styles.markdown}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={markdownComponents}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
