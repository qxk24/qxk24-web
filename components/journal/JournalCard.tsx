import Link from 'next/link';
import type { Journal } from '@/lib/types';
import { StarRating } from './StarRating';

interface JournalCardProps {
  journal: Journal;
}

export function JournalCard({ journal }: JournalCardProps) {
  const author = journal.isAnonymous ? 'Anonymous Contributor' : journal.contributorName;

  return (
    <Link
      href={`/journals/community/${journal.slug}`}
      className="block p-6 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all"
    >
      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full capitalize">
        {journal.category.replace('-', ' ')}
      </span>
      <h2 className="text-lg font-semibold text-gray-900 mt-3 mb-2 line-clamp-2">
        {journal.title}
      </h2>
      <p className="text-sm text-gray-600 line-clamp-3 mb-4">{journal.abstract}</p>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
        <span>{author}</span>
        {journal.analysis && (
          <StarRating value={journal.analysis.alamtologiRating.overall} size="sm" />
        )}
      </div>
    </Link>
  );
}
