// ============================================================
// QXK24 — Public Landing Page
// File: app/page.tsx
// ============================================================

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-8">

      {/* Center Content */}
      <div className="text-center max-w-lg">

        {/* Symbol */}
        <div className="text-6xl mb-8">☪</div>

        {/* Bismillah */}
        <p className="text-zinc-400 text-2xl font-light mb-10" dir="rtl">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>

        {/* Title */}
        <h1 className="text-white text-4xl font-extralight tracking-[0.3em] mb-3">
          QXK24
        </h1>
        <p className="text-zinc-600 text-sm tracking-[0.2em] uppercase mb-2">
          Constitutional Kernel
        </p>
        <p className="text-zinc-700 text-xs tracking-widest mb-16">
          ERA_1 · The Teaching Era · v1.7.0
        </p>

        {/* Alamtologi Principles */}
        <div className="grid grid-cols-7 gap-2 mb-16">
          {[
            { id: 'MASA',   en: 'Time'   },
            { id: 'TENAGA', en: 'Energy' },
            { id: 'AIR',    en: 'Water'  },
            { id: 'API',    en: 'Fire'   },
            { id: 'BUMI',   en: 'Earth'  },
            { id: 'CAHAYA', en: 'Light'  },
            { id: 'RUANG',  en: 'Space'  },
          ].map((p) => (
            <div key={p.id} className="text-center">
              <p className="text-white text-xs font-medium mb-1">{p.id}</p>
              <p className="text-zinc-700 text-xs">{p.en}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="text-zinc-500 text-sm leading-relaxed mb-16 max-w-sm mx-auto">
          The Alamtologi Constitutional Framework — a living system of knowledge
          governed by seven natural principles.
        </p>

        {/* Links */}
        <div className="flex flex-col gap-3 items-center">
          <Link
            href="/journals"
            className="text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-colors"
          >
            Journals →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-zinc-800 text-xs tracking-widest">
          Founded by Masa Bayu · 2026
        </p>
      </div>
    </main>
  );
}
