import { CheckCircle2, XCircle } from 'lucide-react';
import { COVERAGE_ROWS, BRAND_DARK, BRAND_YELLOW } from '../data';
import { SectionHeading } from './SectionHeading';

export function InsuranceCoverageTable() {
  return (
    <section className="pt-8 pb-8 bg-white" aria-labelledby="compare-heading">
      <div className="container-app max-w-5xl">
        <SectionHeading id="compare-heading" title="Types of Motor Insurance" mb="mb-6" />

        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-premium-lg">
          {/* Header */}
          <div className="grid grid-cols-3 text-white text-xs font-bold" style={{ background: BRAND_DARK }}>
            <div className="p-4 text-white/50">Coverage</div>
            <div className="p-4 text-center border-x border-white/10">
              <div style={{ color: BRAND_YELLOW }}>Comprehensive</div>
              <span
                className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ background: 'rgba(245,200,66,0.15)', color: BRAND_YELLOW }}
              >
                Recommended
              </span>
            </div>
            <div className="p-4 text-center">
              <div className="text-white/80">Third Party</div>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-[10px] font-semibold">
                Mandatory
              </span>
            </div>
          </div>

          {/* Rows */}
          {COVERAGE_ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-3 text-sm border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-surface-50'}`}
            >
              <div className="px-4 py-3 text-gray-700 text-xs font-medium">{row.label}</div>
              <div className="px-4 py-3 flex justify-center border-x border-gray-100">
                {row.comp ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
              </div>
              <div className="px-4 py-3 flex justify-center">
                {row.tp ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
