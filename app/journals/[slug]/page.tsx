import { notFound } from 'next/navigation';
import { JournalAPI } from '@/lib/api';
import { AnalysisSection } from '@/components/journal/AnalysisSection';
import { ReactionBar } from '@/components/journal/ReactionBar';
import { CommentSection } from '@/components/journal/CommentSection';
import { StarRating } from '@/components/journal/StarRating';
import { PageNav } from '@/components/navigation/PageNav';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { journal } = await JournalAPI.get(slug);
    return {
      title: `${journal.title} — QXK24 Journals`,
      description: journal.abstract.slice(0, 160),
    };
  } catch {
    return { title: 'Journal — QXK24' };
  }
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let journal;
  try {
    const res = await JournalAPI.get(slug);
    journal = res.journal;
  } catch {
    notFound();
  }

  const id = String(journal._id);
  const approvedComments = journal.comments.filter((c) => c.approved);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <PageNav
          className="mb-6"
          items={[
            { href: '/journals', label: 'Back to Journals' },
          ]}
        />
        <header className="mb-10">
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full capitalize">
            {journal.category.replace('-', ' ')}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mt-4 mb-4">
            {journal.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>
              By{' '}
              <strong className="text-gray-700">
                {journal.isAnonymous ? 'Anonymous Contributor' : journal.contributorName}
              </strong>
            </span>
            {journal.publishedAt && (
              <span>{new Date(journal.publishedAt).toLocaleDateString()}</span>
            )}
            <span>{journal.views.toLocaleString()} views</span>
          </div>
          {journal.analysis && (
            <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-2xl mt-6">
              <StarRating value={journal.analysis.conventionalRating.overall} label="Conventional" />
              <StarRating value={journal.analysis.alamtologiRating.overall} label="Alamtologi" />
              <span className="text-sm font-bold">{journal.leaderboardScore}/100</span>
            </div>
          )}
        </header>

        <section className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">Abstract</h2>
          <p className="text-gray-700 leading-relaxed text-lg">{journal.abstract}</p>
        </section>

        {journal.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {journal.keywords.map((kw) => (
              <span key={kw} className="text-xs bg-gray-100 px-3 py-1 rounded-full">{kw}</span>
            ))}
          </div>
        )}

        <section className="mb-8 prose prose-gray max-w-none text-gray-800 leading-relaxed">
          {journal.body.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </section>

        {journal.references.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">References</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              {journal.references.map((ref, i) => (
                <li key={i}>{ref}</li>
              ))}
            </ol>
          </section>
        )}

        <ReactionBar journalId={id} reactions={journal.reactions} />
        {journal.analysis && <AnalysisSection analysis={journal.analysis} />}
        <CommentSection journalId={id} comments={approvedComments} />
      </div>
    </main>
  );
}
