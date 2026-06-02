'use client';

import React, { useState, useEffect, useRef } from 'react';

const steps = [
  {
    title: 'Enter your vehicle number',
    description: 'So we know which challan to review.',
  },
  {
    title: 'Share your contact details',
    description: 'Your name and mobile number.',
  },
  {
    title: 'We verify your challan details',
    description: 'Our team checks and finds the best discount path.',
  },
  {
    title: 'You get the best available option',
    description: 'We call you with the discount option — up to 50% off.',
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
    <section className="bg-surface-50 py-10">
      <div className="px-6 sm:px-8 max-w-xl mx-auto md:mx-0 md:max-w-none">
        <div className="flex flex-col">
          <div className="mb-6 text-left w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">
              How it works
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mt-3">
              What happens after you submit your vehicle number.
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
