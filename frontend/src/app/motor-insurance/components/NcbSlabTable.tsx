import { NCB_SLABS, BRAND_DARK, BRAND_YELLOW } from '../data';
import { SectionHeading } from './SectionHeading';

export function NcbSlabTable() {
  return (
    <section className="pt-8 pb-8 bg-surface-50" aria-labelledby="ncb-heading">
      <div className="container-app max-w-5xl">
        <SectionHeading
          id="ncb-heading"
          title="No Claim Bonus Slab"
          subtitle="Every claim-free year earns you a bigger discount on renewal premium"
          mb="mb-6"
        />

        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-premium bg-white">
          <div className="grid grid-cols-2 text-white text-xs font-bold" style={{ background: BRAND_DARK }}>
            <div className="p-4">Claim-Free Years</div>
            <div className="p-4 text-right" style={{ color: BRAND_YELLOW }}>NCB Discount</div>
          </div>
          {NCB_SLABS.map((row, i) => (
            <div
              key={row.years}
              className={`grid grid-cols-2 border-t border-gray-100 items-center ${i % 2 === 0 ? 'bg-white' : 'bg-surface-50'}`}
            >
              <div className="px-4 py-3 text-sm text-gray-700 font-medium">{row.years}</div>
              <div className="px-4 py-3 text-right">
                <span className="text-sm font-bold text-emerald-600">{row.discount}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-gray-400 text-center">
          NCB is forfeited if you do not renew within 90 days of policy expiry.
        </p>
      </div>
    </section>
  );
}
