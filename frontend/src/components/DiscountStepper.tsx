'use client';

import React, { useState, useEffect, useRef } from 'react';

const steps = [
  {
    title: 'Enter your vehicle number',
    description:
      'Start on the homepage with your vehicle number so we know which challan request needs to be reviewed.',
  },
  {
    title: 'Share your contact details',
    description:
      'Add your full name, mobile number and submit it.',
  },
  {
    title: 'We verify your challan details',
    description:
      'Our team checks the challan details and evaluates the best available discount path for your case.',
  },
  {
    title: 'You get the best available option',
    description:
      'We contact you shortly with the next step and the best discount option available, which can go up to 50% depending on the challan.',
  },
];

const STEP_DURATION = 4000;

export function DiscountStepper() {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goToNext = () => {
    setActive((curr) => (curr + 1) % steps.length);
    setAnimKey((k) => k + 1);
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      goToNext();
    }, STEP_DURATION);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="bg-white py-12 sm:py-20 lg:py-24">
      <div className="container-app">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
          <div className="mb-12 text-left w-full">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1.5 text-primary-500">
              Step by step
            </p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 leading-none">
              How it works
            </h2>
            <p className="text-gray-500 text-[15px] sm:text-lg leading-relaxed mt-6">
              From request to follow-up, here&apos;s what happens after you share your vehicle details.
            </p>
          </div>

          <div className="relative w-full">
            {steps.map((step, index) => {
              const isActive = index === active;
              const isPast = index < active;
              const isFuture = index > active;

              return (
                <div
                  key={index}
                  className={`relative flex gap-5 sm:gap-6 pb-10 sm:pb-14 last:pb-0 transition-opacity duration-300 ${isFuture ? 'opacity-40' : 'opacity-100'
                    }`}
                  onClick={() => {
                    setActive(index);
                    setAnimKey((k) => k + 1);
                    startTimer();
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Vertical connecting line */}
                  {index !== steps.length - 1 && (
                    <div className="absolute left-[19px] sm:left-[23px] top-[40px] sm:top-[48px] bottom-[-4px] sm:bottom-[-8px] w-[3px] bg-gray-100 rounded-full overflow-hidden">
                      {isPast && (
                        <div className="w-full h-full bg-primary-500 rounded-full" />
                      )}
                      {isActive && (
                        <div
                          key={animKey}
                          className="w-full bg-primary-500 rounded-full"
                          style={{
                            height: 0,
                            animation: `progressFillVertical ${STEP_DURATION}ms linear forwards`
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* Step Circle */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-full border-[2px] flex items-center justify-center font-bold text-[15px] sm:text-base z-10 relative shadow-sm transition-colors duration-300 ${isActive || isPast
                      ? 'border-primary-500 bg-primary-50 text-primary-600'
                      : 'border-gray-200 bg-white text-gray-400'
                      }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="pt-2 sm:pt-2.5">
                    <h3 className={`text-[17px] sm:text-xl font-bold mb-2 leading-tight transition-colors duration-300 ${isActive ? 'text-primary-600' : 'text-gray-900'
                      }`}>
                      {step.title}
                    </h3>
                    <p className={`text-[14px] sm:text-[15px] leading-relaxed pr-2 transition-colors duration-300 ${isActive || isPast ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
