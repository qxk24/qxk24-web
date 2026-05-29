import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — QXK24 Alamtologi Journal',
  description: 'How constitutional academic publishing works under ADAM and QXK24',
};

export default function JournalAboutPage() {
  return (
    <div className="min-h-screen journal-bg-animated text-white">
      <article className="relative z-10 max-w-3xl mx-auto px-6 py-16 prose prose-invert">
        <Link href="/journals" className="text-amber-300 text-sm no-underline">
          ← Journals
        </Link>

        <h1 className="text-4xl font-bold mt-8 mb-6 bg-gradient-to-r from-amber-200 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
          The Alamtologi Academic Journal
        </h1>

        <p className="text-white/80 text-lg leading-relaxed">
          Under ERA_1 of QXK24, scholarly work is not merely stored — it is <strong>constitutionally witnessed</strong>.
          ADAM analyses every submission through the seven principles, Hukum Z, Tahap Akal, and the judgments
          Makmur, Islah, and Waqf.
        </p>

        <h2 className="text-amber-200 mt-12">The journey of a manuscript</h2>
        <ol className="text-white/75 space-y-3 list-decimal list-inside">
          <li>
            <strong>Submit</strong> — Author sends title, abstract, and raw content. ADAM (Sonnet) structures the
            paper and scores all principles. Status: <em>PENDING_REVIEW</em>. Audit stage: <em>SUBMISSION</em>.
          </li>
          <li>
            <strong>Founder approve</strong> — Masa Bayu reviews ADAM&apos;s analysis and notes. Status:{' '}
            <em>APPROVED</em>. Audit stage: <em>APPROVAL</em>.
          </li>
          <li>
            <strong>Publish</strong> — Work receives a journal number <code>QXK24-J{'{year}'}-{'{seq}'}</code>.
            Status: <em>PUBLISHED</em>. Audit stage: <em>PUBLICATION</em>.
          </li>
        </ol>

        <h2 className="text-amber-200 mt-12">What you see on each journal page</h2>
        <ul className="text-white/75 space-y-2">
          <li>AHRI score — weighted Alamtologi Health &amp; Research Index</li>
          <li>Hukum Z — Pola, Kadar, Pasangan, Keseimbangan</li>
          <li>Animated principle spectrum across MASA → RUANG</li>
          <li>Full constitutional audit timeline with findings and recommendations</li>
        </ul>

        <h2 className="text-amber-200 mt-12">For authors</h2>
        <p className="text-white/75">
          Submit from the glowing form — no account required. Your manuscript is processed once; raw uploads
          follow AIDIL where applicable. Published work appears in the living catalogue with full colour and
          motion — a reflection that knowledge in QXK24 is alive, not archival dust.
        </p>

        <div className="flex flex-wrap gap-4 mt-12 not-prose">
          <Link
            href="/journals/submit"
            className="px-8 py-3 rounded-full font-semibold text-slate-900"
            style={{ background: 'linear-gradient(90deg, #fbbf24, #f97316)' }}
          >
            Submit now
          </Link>
          <Link
            href="/adam"
            className="px-8 py-3 rounded-full border border-white/30 text-white/90"
          >
            Teach ADAM
          </Link>
        </div>

        <p className="text-white/40 text-sm mt-16">
          Full technical write-up: see <code>docs/ALAMTOLOGI_ACADEMIC_JOURNAL.md</code> in the QXK24 repository.
        </p>
      </article>
    </div>
  );
}
