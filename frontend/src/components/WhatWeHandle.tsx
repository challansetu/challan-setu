import Image from 'next/image';

const ITEMS = [
  { img: '/images/handle-fir-followup.png',   title: 'FIR follow-up' },
  { img: '/images/handle-superdari.png',       title: 'Superdari application' },
  { img: '/images/handle-court-order.png',     title: 'Court order process' },
  { img: '/images/handle-vehicle-release.png', title: 'Vehicle release support' },
];

export function WhatWeHandle() {
  return (
    <section className="py-8 bg-white">
      <div className="container-app">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-10 h-0.5 rounded-full bg-amber-300" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">What We Handle For You</h2>
          <span className="w-10 h-0.5 rounded-full bg-amber-300" />
        </div>

        <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto">
          {ITEMS.map((item) => (
            <div key={item.title} className="flex flex-col gap-2">
              <div className="w-full aspect-square rounded-xl relative overflow-hidden" style={{ background: 'rgba(245,200,66,0.15)' }}>
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 33vw, 200px"
                  className="object-cover scale-[1.15]"
                />
              </div>
              <p className="text-center font-semibold text-gray-900 text-xs leading-snug">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
