/**
 * ============================================================
 * QXK24 — ADAM Constitutional Journal Types
 * ============================================================
 */

export type ConstitutionalJudgment = 'MAKMUR' | 'ISLAH' | 'WAQF';
export type JournalCategory =
  | 'RESEARCH'
  | 'APPLICATION'
  | 'CASE_STUDY'
  | 'THEORY'
  | 'IMPLEMENTATION';
export type AlamtologiPrinciple =
  | 'MASA'
  | 'TENAGA'
  | 'AIR'
  | 'API'
  | 'BUMI'
  | 'CAHAYA'
  | 'RUANG';
export type HukumZStatus = 'LULUS' | 'GAGAL' | 'BELUM';
export type AuditStage =
  | 'SUBMISSION'
  | 'REVIEW'
  | 'APPROVAL'
  | 'PUBLICATION'
  | 'POST_PUBLICATION';

export interface HukumZResult {
  pola: HukumZStatus;
  kadar: HukumZStatus;
  pasangan: HukumZStatus;
  keseimbangan: HukumZStatus;
}

export interface PrincipleAnalysis {
  principle: AlamtologiPrinciple;
  weight: number;
  score: number;
  analysis: string;
  evidence: string[];
}

export interface JournalContent {
  introduction: string;
  background: string;
  methodology: string;
  alamtologiAnalysis: PrincipleAnalysis[];
  findings: string;
  discussion: string;
  conclusion: string;
  references: string[];
}

export interface ConstitutionalJournal {
  id: string;
  title: string;
  abstract: string;
  category: JournalCategory;
  principlesFocus: AlamtologiPrinciple[];
  authorName: string;
  authorEmail: string;
  authorOrg?: string;
  content: JournalContent;
  ahriScore: number;
  hukumZAnalysis: HukumZResult;
  tahapAkalAchieved: number;
  cVLevel: number;
  judgment: ConstitutionalJudgment;
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  publishedAt?: string;
  reviewNotes?: string;
  journalNumber?: string;
}

export interface JournalAudit {
  auditId: string;
  targetId: string;
  targetType: string;
  stage: AuditStage;
  judgment: ConstitutionalJudgment;
  hukumZ: HukumZResult;
  healthScore: number;
  findings: string[];
  recommendations: string[];
  canAdvance: boolean;
  auditedAt: string;
}

export const PRINCIPLE_COLORS: Record<AlamtologiPrinciple, { from: string; to: string; glow: string }> = {
  MASA:    { from: '#6366f1', to: '#8b5cf6', glow: 'rgba(99,102,241,0.45)' },
  TENAGA:  { from: '#f59e0b', to: '#ef4444', glow: 'rgba(245,158,11,0.45)' },
  AIR:     { from: '#06b6d4', to: '#3b82f6', glow: 'rgba(6,182,212,0.45)' },
  API:     { from: '#f97316', to: '#dc2626', glow: 'rgba(249,115,22,0.45)' },
  BUMI:    { from: '#22c55e', to: '#15803d', glow: 'rgba(34,197,94,0.45)' },
  CAHAYA:  { from: '#facc15', to: '#eab308', glow: 'rgba(250,204,21,0.5)' },
  RUANG:   { from: '#a855f7', to: '#ec4899', glow: 'rgba(168,85,247,0.45)' },
};

export const JUDGMENT_THEME: Record<
  ConstitutionalJudgment,
  { label: string; from: string; to: string; ring: string; text: string }
> = {
  MAKMUR: {
    label: 'Makmur',
    from: '#10b981',
    to: '#059669',
    ring: 'rgba(16,185,129,0.5)',
    text: '#ecfdf5',
  },
  ISLAH: {
    label: 'Islah',
    from: '#f59e0b',
    to: '#d97706',
    ring: 'rgba(245,158,11,0.5)',
    text: '#fffbeb',
  },
  WAQF: {
    label: 'Waqf',
    from: '#ef4444',
    to: '#b91c1c',
    ring: 'rgba(239,68,68,0.5)',
    text: '#fef2f2',
  },
};
