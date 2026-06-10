const steps = [
  { step: '01', title: 'Enter your vehicle number', description: 'So we know which challan to review.' },
  { step: '02', title: 'Share your contact details', description: 'Your name and mobile number.' },
  { step: '03', title: 'We verify your challan details', description: 'Our team checks and finds the best discount path.' },
  { step: '04', title: 'You get the best available option', description: 'We call you with the discount option — up to 50% off.' },
];

const BRAND_YELLOW = '#f5c842';

export function DiscountStepper() {
  return (
    <section className="py-10 md:flex md:justify-end">
      <div className="w-full md:max-w-sm">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">How it works</h2>
          <p className="text-gray-500 text-sm leading-relaxed mt-3">What happens after you submit your vehicle number.</p>
        </div>

        <div className="grid grid-cols-1 gap-y-7">
          {steps.map((step) => (
            <div key={step.step} className="flex items-start gap-4">
              <span className="text-4xl font-black leading-none shrink-0" style={{ color: BRAND_YELLOW }}>
                {step.step}
              </span>
              <div className="pt-1">
                <h3 className="font-bold text-gray-900 text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
