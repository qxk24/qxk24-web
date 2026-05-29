/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Teaching Console
 * Platform    : Web (Next.js)
 * QXK24       : Kernel v1.7.0
 * Founder     : Masa Bayu
 * Created     : 2026-05-28
 * ============================================================
 */

'use client';

import { AdamStackProvider } from '@/lib/adam/adam-stack-context';
import ADAMPageShell from '@/components/adam/ADAMPageShell';

export default function ADAMPage() {
  return (
    <AdamStackProvider stackId="production">
      <ADAMPageShell />
    </AdamStackProvider>
  );
}
