import { HOW_IT_WORKS, BRAND_YELLOW } from '../data';

export function HowItWorks() {
  return (
    <section className="pt-8 pb-8 bg-white" aria-labelledby="how-it-works-heading">
      <div className="container-app max-w-5xl">
        <h2 id="how-it-works-heading" className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="flex sm:flex-col items-start gap-4">
              <span className="text-4xl font-black leading-none shrink-0" style={{ color: BRAND_YELLOW }}>
                {step.step}
              </span>
              <div className="pt-1">
                <h3 className="font-bold text-gray-900 text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
