/**
 * ============================================================
 * QXK24.COM — Home Page
 * ============================================================
 * Module      : Home
 * QXK24       : Kernel v1.7.0
 * Founder     : Masa Bayu
 * Created     : 2026-05-28
 * ============================================================
 */

import Link from 'next/link';

const FEATURES = [
  {
    icon: '⚖️',
    title: 'QXK24',
    body: 'The constitutional law engine. Every action is evaluated — ALLOW, REVIEW, or BLOCK — by principles from the Holy Quran.',
  },
  {
    icon: '🛡️',
    title: 'QXEngine',
    body: 'The on-device constitutional enforcer. Validates every action before it reaches the backend. Logs every decision.',
  },
  {
    icon: '📍',
    title: 'QXMemloc',
    body: 'The constitutional memory locator. Tracks resource health and reports real-time telemetry to the founder console.',
  },
] as const;

const JOURNAL_STEPS = [
  { step: '01', label: 'You Submit' },
  { step: '02', label: 'Masa Bayu Analyses' },
  { step: '03', label: 'Published on QXK24' },
  { step: '04', label: 'Leaderboard Ranked' },
] as const;

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pb-16 pt-12 text-center sm:px-8 sm:pb-20 sm:pt-20">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
          <span className="text-xs font-medium tracking-wide text-amber-700">
            ERA_1 — Teaching Era · Kernel v1.7.0
          </span>
        </div>

        <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
          Knowledge flows
          <br />
          <span className="text-amber-500">like water.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl">
          QXK24 is the world&apos;s first constitutional digital kernel — grounded in Quranic science,{' '}
          <strong className="text-gray-700">Alamtologi</strong>, founded by{' '}
          <strong className="text-gray-700">Masa Bayu</strong>.
        </p>

        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/journals/submit"
            className="rounded-2xl bg-amber-500 px-8 py-4 text-center text-sm font-semibold text-white shadow-sm shadow-amber-200 transition-colors hover:bg-amber-600"
          >
            Submit a Journal
          </Link>
          <Link
            href="/journals"
            className="rounded-2xl border border-gray-200 bg-gray-50 px-8 py-4 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Browse Journals →
          </Link>
        </div>

        <p className="mt-12 text-sm italic text-gray-400">
          &quot;And say: My Lord, increase me in knowledge.&quot;
          <span className="mt-1 block text-xs not-italic">— Al-Quran, Surah Ta-Ha (20:114)</span>
        </p>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 transition-shadow hover:border-amber-200 hover:shadow-sm"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg">
                {f.icon}
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Journal system */}
      <section className="border-y border-amber-100 bg-amber-50">
        <div className="mx-auto max-w-5xl px-5 py-12 text-center sm:px-8 sm:py-16">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Constitutional Journal System</h2>
          <p className="mx-auto mb-10 max-w-2xl leading-relaxed text-gray-600">
            Submit your research. Masa Bayu will publish a dual analysis — conventional academic review
            and Alamtologi constitutional rating using 7 Quranic principles.
          </p>

          <ol className="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {JOURNAL_STEPS.map((item) => (
              <li key={item.step} className="flex flex-col items-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                  {item.step}
                </span>
                <span className="mt-2 text-center text-xs text-gray-600">{item.label}</span>
              </li>
            ))}
          </ol>

          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/journals/submit"
              className="rounded-xl bg-amber-500 px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-amber-600"
            >
              Submit Your Journal
            </Link>
            <Link
              href="/leaderboard"
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* SDK */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">Open SDK</h2>
          <p className="text-sm text-gray-500">
            Integrate constitutional governance into any application. Available on all platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <a
            href="https://www.npmjs.com/package/@qxk24/sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl bg-gray-900 p-5 text-white transition-colors hover:bg-gray-800"
          >
            <div className="mb-3 font-mono text-xs text-gray-400">JavaScript / TypeScript</div>
            <code className="font-mono text-sm text-amber-400">npm install @qxk24/sdk</code>
            <div className="mt-3 text-xs text-gray-400">npmjs.com/package/@qxk24/sdk →</div>
          </a>

          <a
            href="https://github.com/qxk24/qxk24-ios"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl bg-gray-900 p-5 text-white transition-colors hover:bg-gray-800"
          >
            <div className="mb-3 font-mono text-xs text-gray-400">iOS / Swift (SPM)</div>
            <code className="break-all font-mono text-sm text-amber-400">github.com/qxk24/qxk24-ios</code>
            <div className="mt-3 text-xs text-gray-400">Version 1.0.0 →</div>
          </a>

          <a
            href="https://github.com/qxk24/qxk24-android"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl bg-gray-900 p-5 text-white transition-colors hover:bg-gray-800"
          >
            <div className="mb-3 font-mono text-xs text-gray-400">Android / Kotlin</div>
            <code className="break-all font-mono text-sm text-amber-400">github.com/qxk24/qxk24-android</code>
            <div className="mt-3 text-xs text-gray-400">Version 1.0.0 →</div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg font-bold text-gray-900">QXK24</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-400">Constitutional Digital Kernel</span>
            </div>
            <p className="text-xs text-gray-400">© 2026 Masa Bayu · Apache 2.0</p>
          </div>

          <div className="mb-6 h-px bg-gray-100" />

          <nav className="grid grid-cols-2 gap-3 text-center text-xs text-gray-400 sm:grid-cols-5 sm:text-sm">
            <Link href="/journals" className="transition-colors hover:text-gray-700">
              Journals
            </Link>
            <Link href="/journals/submit" className="transition-colors hover:text-gray-700">
              Submit
            </Link>
            <Link href="/leaderboard" className="transition-colors hover:text-gray-700">
              Leaderboard
            </Link>
            <a
              href="https://github.com/qxk24"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gray-700"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/@qxk24/sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gray-700"
            >
              npm
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
