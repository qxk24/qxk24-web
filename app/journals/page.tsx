/**
 * ============================================================
 * QXK24.COM — Constitutional Journal Listing
 * ============================================================
 */

import { AdamJournalAPI } from '@/lib/adam-journal-api';
import { JournalsGallery } from '@/components/journal/constitutional/JournalsGallery';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journals — QXK24 Alamtologi',
  description: 'Constitutional academic journals analysed and audited by ADAM',
};

export default async function JournalsPage() {
  let journals: Awaited<ReturnType<typeof AdamJournalAPI.listPublished>>['journals'] = [];
  let total = 0;

  try {
    const data = await AdamJournalAPI.listPublished(48, 0);
    journals = data.journals;
    total = data.total;
  } catch {
    journals = [];
  }

  return <JournalsGallery journals={journals} total={total} />;
}
