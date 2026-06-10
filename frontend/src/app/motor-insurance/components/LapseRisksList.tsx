import { LAPSE_RISKS } from '../data';
import { SectionHeading } from './SectionHeading';

export function LapseRisksList() {
  return (
    <section className="pt-8 pb-8 bg-surface-50" aria-labelledby="risks-heading">
      <div className="container-app max-w-5xl">
        <SectionHeading
          id="risks-heading"
          title="Risks of Letting Insurance Lapse"
          subtitle="The consequences go beyond just a fine — here is what is at stake"
          mb="mb-6"
        />

        <div className="space-y-3">
          {LAPSE_RISKS.map((risk) => (
            <div key={risk.title} className="rounded-2xl bg-white border border-red-100 p-5 flex gap-4 shadow-premium">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <risk.icon className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">{risk.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{risk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
