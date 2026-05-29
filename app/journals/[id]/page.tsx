import { notFound } from 'next/navigation';
import { AdamJournalAPI } from '@/lib/adam-journal-api';
import { JournalDetailView } from '@/components/journal/constitutional/JournalDetailView';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const { journal } = await AdamJournalAPI.getPublished(id);
    return {
      title: `${journal.title} — QXK24 Journal`,
      description: journal.abstract.slice(0, 160),
    };
  } catch {
    return { title: 'Journal — QXK24' };
  }
}

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let journal;
  let audits;
  try {
    const data = await AdamJournalAPI.getPublished(id);
    journal = data.journal;
    audits = data.audits;
  } catch {
    notFound();
  }

  return <JournalDetailView journal={journal} audits={audits} />;
}
