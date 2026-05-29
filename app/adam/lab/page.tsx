/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Lab Console (Qwen pilot)
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

import { AdamStackProvider } from '@/lib/adam/adam-stack-context';
import ADAMPageShell from '@/components/adam/ADAMPageShell';

export default function ADAMLabPage() {
  return (
    <AdamStackProvider stackId="lab">
      <ADAMPageShell />
    </AdamStackProvider>
  );
}
