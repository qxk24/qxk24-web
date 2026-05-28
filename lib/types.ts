/**
 * ============================================================
 * QXK24.COM — Shared Types
 * ============================================================
 * Module      : Types
 * QXK24       : Kernel v1.7.0
 * Founder     : Masa Bayu
 * Created     : 2026-05-27
 * ============================================================
 */

export interface AlamtologiRating {
  MASA: number;
  BAYU: number;
  AIR: number;
  API: number;
  BUMI: number;
  CAHAYA: number;
  RUANG: number;
  overall: number;
}

export interface ConventionalRating {
  methodology: number;
  originality: number;
  clarity: number;
  references: number;
  contribution: number;
  overall: number;
}

export interface MasaBayuAnalysis {
  conventional: string;
  alamtologi: string;
  conventionalRating: ConventionalRating;
  alamtologiRating: AlamtologiRating;
  quranVerses: string[];
  publishedAt: string;
  author: 'Masa Bayu';
}

export interface JournalReaction {
  type: 'insightful' | 'profound' | 'transformative' | 'aligned' | 'questioning';
  count: number;
}

export interface JournalComment {
  _id: string;
  authorName: string;
  body: string;
  createdAt: string;
  approved: boolean;
}

export interface Journal {
  _id: string;
  title: string;
  abstract: string;
  body: string;
  keywords: string[];
  category: string;
  references: string[];
  affiliations: string[];
  language: string;
  contributorName: string;
  contributorBio: string;
  isAnonymous: boolean;
  status: 'pending' | 'published' | 'archived' | 'rejected';
  slug: string;
  analysis: MasaBayuAnalysis | null;
  reactions: JournalReaction[];
  comments: JournalComment[];
  views: number;
  leaderboardScore: number;
  submittedAt: string;
  publishedAt: string | null;
}

export interface LeaderboardEntry {
  _id: string;
  title: string;
  slug: string;
  contributorName: string;
  isAnonymous: boolean;
  leaderboardScore: number;
  analysis: {
    alamtologiRating: { overall: number };
    conventionalRating: { overall: number };
  } | null;
  reactions: JournalReaction[];
  publishedAt: string;
  category: string;
}

export const ALAMTOLOGI_PRINCIPLES: Record<keyof Omit<AlamtologiRating, 'overall'>, string> = {
  MASA: 'Time Alignment',
  BAYU: 'Flow & Momentum',
  AIR: 'Clarity & Truth',
  API: 'Transformative Power',
  BUMI: 'Grounded Reality',
  CAHAYA: 'Illumination',
  RUANG: 'Space & Potential',
};
