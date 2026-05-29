/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM AIDIL Stage Dashboard API
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

import { readApiJson } from '../api-response';
import { adamApiFetch } from '../adam-session-storage';

export interface AidilFamilyStageCard {
  family: string;
  principle: string;
  stage: number;
  maxStage: number;
  status: 'active' | 'complete';
  progressBar: string;
  nucleus: string;
  nextStageNeeds: string;
  estimatedStage7: string;
  completedAt?: string;
  cycleNote?: string;
  masaOpened?: string;
  checkpointId?: string;
}

export interface ConstitutionalCheckpoint {
  checkpointId: string;
  family: string;
  principle: string;
  cycle: number;
  sealedContent: string;
  masa_sealed: string;
  k24Address: string;
  judgment: string;
  isConstitutional: boolean;
  canBeErased: boolean;
}

export interface AidilStageDashboard {
  founderId: string;
  era: string;
  kernel: string;
  totalTransformations: number;
  activeCount: number;
  completedCount: number;
  families: AidilFamilyStageCard[];
  textBlock: string;
  generatedAt: string;
}

export interface AidilStagesResponse {
  dashboard: AidilStageDashboard;
  checkpoints: ConstitutionalCheckpoint[];
}

export async function fetchAidilStageDashboard(
  apiBase: string,
  token: string,
): Promise<AidilStagesResponse> {
  const res = await adamApiFetch(`${apiBase}/api/adam/brain/stages`, token);
  const parsed = await readApiJson(res);
  if (!parsed.ok || !parsed.body?.dashboard) {
    throw new Error(parsed.errorMessage || 'Could not load AIDIL stage dashboard.');
  }
  return {
    dashboard: parsed.body.dashboard as AidilStageDashboard,
    checkpoints: (parsed.body.checkpoints ?? []) as ConstitutionalCheckpoint[],
  };
}
