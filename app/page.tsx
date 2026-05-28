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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-3xl mx-auto px-6 pt-8 md:pt-24 pb-10 md:pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full mb-8">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-amber-700 tracking-wide">
            ERA_1 — Teaching Era · Kernel v1.7.0
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Knowledge flows
          <br />
          <span className="text-amber-500">like water.</span>
        </h1>

        <p className="text-xl text-gray-500 leading-relaxed max-w-xl mx-auto mb-10">
          QXK24 is the world's first constitutional digital kernel — grounded in Quranic science,{' '}
          <strong className="text-gray-700">Alamtologi</strong>, founded by{' '}
          <strong className="text-gray-700">Masa Bayu</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/journals/submit"
            className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-semibold hover:bg-amber-600 transition-all hover:scale-105 shadow-sm shadow-amber-200 text-sm"
          >
            Submit a Journal
          </Link>
          <Link
            href="/journals"
            className="px-8 py-4 bg-gray-50 text-gray-700 rounded-2xl font-semibold hover:bg-gray-100 transition-all text-sm border border-gray-200"
          >
            Browse Journals →
          </Link>
        </div>

        <p className="mt-6 md:mt-14 text-sm text-gray-400 italic">
          "And say: My Lord, increase me in knowledge."
          <span className="block text-xs mt-1 not-italic">— Al-Quran, Surah Ta-Ha (20:114)</span>
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-10 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 font-bold text-sm mb-4">⚖️</div>
            <h3 className="font-semibold text-gray-900 mb-2">QXK24</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              The constitutional law engine. Every action is evaluated — ALLOW, REVIEW, or BLOCK — by principles from the Holy Quran.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 font-bold text-sm mb-4">🛡️</div>
            <h3 className="font-semibold text-gray-900 mb-2">QXEngine</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              The on-device constitutional enforcer. Validates every action before it reaches the backend. Logs every decision.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 font-bold text-sm mb-4">📍</div>
            <h3 className="font-semibold text-gray-900 mb-2">QXMemloc</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              The constitutional memory locator. Tracks resource health and reports real-time telemetry to the founder console.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-amber-50 border-y border-amber-100">
        <div className="max-w-3xl mx-auto px-6 py-8 md:py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Constitutional Journal System</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
            Submit your research. Masa Bayu will publish a dual analysis — conventional academic review and Alamtologi constitutional rating using 7 Quranic principles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm mb-10">
            {[
              { step: '01', label: 'You Submit' },
              { step: '02', label: 'Masa Bayu Analyses' },
              { step: '03', label: 'Published on QXK24' },
              { step: '04', label: 'Leaderboard Ranked' },
            ].map((item, i, arr) => (
              <div key={item.step} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <span className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {item.step}
                  </span>
                  <span className="text-gray-600 mt-1 text-xs">{item.label}</span>
                </div>
                {i < arr.length - 1 && <span className="text-amber-300 text-lg hidden sm:block">→</span>}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/journals/submit"
              className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors text-sm"
            >
              Submit Your Journal
            </Link>
            <Link
              href="/leaderboard"
              className="px-6 py-3 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm border border-gray-200"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-10 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Open SDK</h2>
          <p className="text-gray-500 text-sm">
            Integrate constitutional governance into any application. Available on all platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://www.npmjs.com/package/@qxk24/sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-5 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            <div className="text-xs text-gray-400 mb-3 font-mono">JavaScript / TypeScript</div>
            <code className="text-amber-400 text-sm font-mono">npm install @qxk24/sdk</code>
            <div className="mt-3 text-xs text-gray-400">npmjs.com/package/@qxk24/sdk →</div>
          </a>

          <a
            href="https://github.com/qxk24/qxk24-ios"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-5 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            <div className="text-xs text-gray-400 mb-3 font-mono">iOS / Swift (SPM)</div>
            <code className="text-amber-400 text-sm font-mono break-all">github.com/qxk24/qxk24-ios</code>
            <div className="mt-3 text-xs text-gray-400">Version 1.0.0 →</div>
          </a>

          <a
            href="https://github.com/qxk24/qxk24-android"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-5 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            <div className="text-xs text-gray-400 mb-3 font-mono">Android / Kotlin</div>
            <code className="text-amber-400 text-sm font-mono break-all">github.com/qxk24/qxk24-android</code>
            <div className="mt-3 text-xs text-gray-400">Version 1.0.0 →</div>
          </a>
        </div>
      </section>

      <footer className="border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-900 text-lg">QXK24</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-400 text-sm">Constitutional Digital Kernel</span>
            </div>
            <p className="text-xs text-gray-400">© 2026 Masa Bayu · Apache 2.0</p>
          </div>

          <div className="h-px bg-gray-100 mb-6" />

          <div className="grid grid-cols-5 items-center gap-3 text-xs sm:text-sm text-gray-400">
            <Link href="/journals" className="hover:text-gray-700 transition-colors text-center">
              Journals
            </Link>
            <Link href="/journals/submit" className="hover:text-gray-700 transition-colors text-center">
              Submit
            </Link>
            <Link href="/leaderboard" className="hover:text-gray-700 transition-colors text-center">
              Leaderboard
            </Link>
            <a
              href="https://github.com/qxk24"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 transition-colors text-center"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/@qxk24/sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 transition-colors text-center"
            >
              npm
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
