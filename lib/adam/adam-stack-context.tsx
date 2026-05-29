/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Stack Context
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

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  getAdamStackConfig,
  type AdamStackConfig,
  type AdamStackId,
} from './adam-stack-config';

const AdamStackContext = createContext<AdamStackConfig | null>(null);

export function AdamStackProvider({
  stackId,
  children,
}: {
  stackId:  AdamStackId;
  children: ReactNode;
}) {
  const config = useMemo(() => getAdamStackConfig(stackId), [stackId]);
  return (
    <AdamStackContext.Provider value={config}>
      {children}
    </AdamStackContext.Provider>
  );
}

export function useAdamStack(): AdamStackConfig {
  const ctx = useContext(AdamStackContext);
  if (!ctx) {
    return getAdamStackConfig('production');
  }
  return ctx;
}
