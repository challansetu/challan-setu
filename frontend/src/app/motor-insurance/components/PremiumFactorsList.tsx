import { PREMIUM_FACTORS } from '../data';
import { SectionHeading } from './SectionHeading';

export function PremiumFactorsList() {
  return (
    <section className="pt-8 bg-white" aria-labelledby="factors-heading">
      <div className="container-app max-w-5xl">
        <SectionHeading
          id="factors-heading"
          title="Factors That Affect Your Premium"
          subtitle="Understanding these helps you make smarter choices at renewal"
          mb="mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-12">
          {PREMIUM_FACTORS.map((f) => (
            <div key={f.title} className="flex items-start gap-4 py-4 border-b border-gray-100">
              <f.icon className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
              <div>
                <h3 className="font-semibold text-sm text-gray-900 mb-0.5">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
