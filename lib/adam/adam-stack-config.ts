/**
 * ============================================================
 * QIUBBX MANAGEMENT SYSTEM
 * ============================================================
 * Module      : ADAM Stack Config (Production + Lab)
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

export type AdamStackId = 'production' | 'lab';

export interface AdamStackConfig {
  id:                   AdamStackId;
  apiBase:              string;
  profileKey:           string;
  workspaceKeyPrefix:   string;
  title:                string;
  headerEngineLabel:    string;
  crossLinkHref:        string;
  crossLinkLabel:       string;
  labBanner?:           string;
  labBannerShort?:      string;
}

const PRODUCTION_API =
  process.env.NEXT_PUBLIC_QXK24_API_URL ?? 'https://api.qxk24.com';

const LAB_API =
  process.env.NEXT_PUBLIC_QXK24_LAB_API_URL ?? 'https://api.qxk24.com/lab';

export function getAdamStackConfig(id: AdamStackId): AdamStackConfig {
  if (id === 'lab') {
    return {
      id:                 'lab',
      apiBase:            LAB_API.replace(/\/$/, ''),
      profileKey:         'qxk24_adam_lab_profile',
      workspaceKeyPrefix: 'qxk24_adam_lab_workspace_',
      title:              'ADAM Lab',
      headerEngineLabel:  'Qwen · AIDIL pilot',
      crossLinkHref:      '/adam',
      crossLinkLabel:     'Production',
      labBanner:
        'Lab stack — same constitutional A, Qwen engine. Separate brain (qxk24_lab). Production Claude backup at /adam.',
      labBannerShort: 'Lab · Qwen · qxk24_lab brain',
    };
  }

  return {
    id:                 'production',
    apiBase:            PRODUCTION_API.replace(/\/$/, ''),
    profileKey:         'qxk24_adam_profile',
    workspaceKeyPrefix: 'qxk24_adam_workspace_',
    title:              'ADAM',
    headerEngineLabel:  'ERA_1 · Claude',
    crossLinkHref:      '/adam/lab',
    crossLinkLabel:     'Lab',
  };
}
