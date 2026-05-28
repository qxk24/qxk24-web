import { MasaBayuAnalysis, ALAMTOLOGI_PRINCIPLES } from '@/lib/types';
import { StarRating } from './StarRating';

interface AnalysisSectionProps {
  analysis: MasaBayuAnalysis;
}

const principleKeys = Object.keys(ALAMTOLOGI_PRINCIPLES) as (keyof typeof ALAMTOLOGI_PRINCIPLES)[];

export function AnalysisSection({ analysis }: AnalysisSectionProps) {
  return (
    <div className="space-y-12 mt-12">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400 font-medium tracking-widest uppercase">
          Analysis by Masa Bayu
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <section id="conventional-analysis">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Conventional Academic Analysis</h2>
            <p className="text-sm text-gray-500 mt-1">Based on standard academic criteria</p>
          </div>
          <StarRating value={analysis.conventionalRating.overall} size="lg" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {(Object.entries(analysis.conventionalRating) as [string, number][])
            .filter(([k]) => k !== 'overall')
            .map(([key, val]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500 capitalize mb-1">{key}</div>
                <StarRating value={val} size="sm" />
              </div>
            ))}
        </div>
        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
          {analysis.conventional.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <section id="alamtologi-analysis">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Alamtologi Analysis</h2>
            <p className="text-sm text-gray-500 mt-1">7 Principles of Alamtologi — Quranic Science</p>
          </div>
          <StarRating value={analysis.alamtologiRating.overall} size="lg" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {principleKeys.map((key) => (
            <div key={key} className="bg-amber-50 rounded-xl p-3">
              <div className="text-xs font-bold text-amber-700 mb-1">
                {key} — {ALAMTOLOGI_PRINCIPLES[key]}
              </div>
              <StarRating value={analysis.alamtologiRating[key]} size="sm" />
            </div>
          ))}
        </div>
        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
          {analysis.alamtologi.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {analysis.quranVerses.length > 0 && (
          <div className="mt-6 p-5 bg-green-50 rounded-2xl border border-green-100">
            <h3 className="text-sm font-semibold text-green-800 mb-3">Referenced Quranic Verses</h3>
            <ul className="space-y-2">
              {analysis.quranVerses.map((v, i) => (
                <li key={i} className="text-sm text-green-700">{v}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
