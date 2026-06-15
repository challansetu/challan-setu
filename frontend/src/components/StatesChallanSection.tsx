'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const STATES = [
  { name: 'Delhi', slug: 'delhi', image: '/images/states/e_challan_delhi.webp' },
  { name: 'Maharashtra', slug: 'maharashtra', image: '/images/states/e_challan_maharashtra.webp' },
  { name: 'Uttar Pradesh', slug: 'uttar-pradesh', image: '/images/states/e_challan_uttar_pradesh.webp' },
  { name: 'Karnataka', slug: 'karnataka', image: '/images/states/e_challan_karnataka.webp' },
  { name: 'Tamil Nadu', slug: 'tamil-nadu', image: '/images/states/e_challan_tamil_nadu.webp' },
  { name: 'Telangana', slug: 'telangana', image: '/images/states/e_challan_telangana.webp' },
  { name: 'Kerala', slug: 'kerala', image: '/images/states/e_challan_kerala.webp' },
  { name: 'Haryana', slug: 'haryana', image: '/images/states/e_challan_haryana.webp' },
  { name: 'Odisha', slug: 'odisha', image: '/images/states/e_challan_odisha.webp' },
  { name: 'Andhra Pradesh', slug: 'andhra-pradesh', image: '/images/states/e_challan_andhra_pradesh.webp' },
  { name: 'Punjab', slug: 'punjab', image: '/images/states/e_challan_punjab.webp' },
  { name: 'Bihar', slug: 'bihar', image: '/images/states/e_challan_bihar.webp' },
  { name: 'Rajasthan', slug: 'rajasthan', image: '/images/states/e_challan_rajasthan.webp' },
  { name: 'Gujarat', slug: 'gujarat', image: '/images/states/e_challan_gujarat.webp' },
  { name: 'Madhya Pradesh', slug: 'madhya-pradesh', image: '/images/states/e_challan_madhya_pradesh.webp' },
  { name: 'West Bengal', slug: 'west-bengal', image: '/images/states/e_challan_west_bengal.webp' },
  { name: 'Assam', slug: 'assam', image: '/images/states/e_challan_assam.webp' },
  { name: 'Himachal Pradesh', slug: 'himachal-pradesh', image: '/images/states/e_challan_himachal_pradesh.webp' },
  { name: 'Uttarakhand', slug: 'uttarakhand', image: '/images/states/e_challan_uttarakhand.webp' },
  { name: 'Jharkhand', slug: 'jharkhand', image: '/images/states/e_challan_jharkhand.webp' },
  { name: 'Chhattisgarh', slug: 'chhattisgarh', image: '/images/states/e_challan_chhattisgarh.webp' },
  { name: 'Goa', slug: 'goa', image: '/images/states/e_challan_goa.webp' },
  { name: 'Jammu & Kashmir', slug: 'jammu-kashmir', image: '/images/states/e_challan_jammu_kashmir.webp' },
  { name: 'Ladakh', slug: 'ladakh', image: '/images/states/e_challan_ladakh.webp' },
  { name: 'Manipur', slug: 'manipur', image: '/images/states/e_challan_manipur.webp' },
  { name: 'Meghalaya', slug: 'meghalaya', image: '/images/states/e_challan_meghalaya.webp' },
  { name: 'Nagaland', slug: 'nagaland', image: '/images/states/e_challan_nagaland.webp' },
  { name: 'Tripura', slug: 'tripura', image: '/images/states/e_challan_tripura.webp' },
  { name: 'Mizoram', slug: 'mizoram', image: '/images/states/e_challan_mizoram.webp' },
  { name: 'Sikkim', slug: 'sikkim', image: '/images/states/e_challan_sikkim.webp' },
  { name: 'Arunachal Pradesh', slug: 'arunachal-pradesh', image: '/images/states/e_challan_arunachal_pradesh.webp' },
  { name: 'Andaman & Nicobar', slug: 'andaman-nicobar', image: '/images/states/e_challan_andaman_nicobar.webp' },
  { name: 'Lakshadweep', slug: 'lakshadweep', image: '/images/states/e_challan_lakshadweep.webp' },
  { name: 'Daman & Diu', slug: 'daman-diu', image: '/images/states/e_challan_daman_diu.webp' },
  { name: 'Dadra Nagar Haveli', slug: 'dadra-nagar-haveli', image: '/images/states/e_challan_dadra_nagar_haveli.webp' },
];

const ROWS = 3;
const COLS_MOBILE = 3;
const COLS_DESKTOP = 5;

export function StatesChallanSection() {
  const [expanded, setExpanded] = useState(false);

  // Show 3 rows worth — use desktop col count as the baseline
  const visibleCount = 9;
  const visible = expanded ? STATES : STATES.slice(0, visibleCount);

  return (
    <section className="py-10 bg-surface-50">
      <div className="container-app mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">
          Check E-Challan by State
        </h2>
        <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-lg">
          Select your state to check pending traffic challans and get expert assistance.
        </p>
      </div>

      <div className="container-app">
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
          {visible.map((state) => (
            <Link
              key={state.slug}
              href={`/e-challan/${state.slug}`}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl aspect-square sm:aspect-[2/3] block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Image
                src={state.image}
                alt={`Pay e-challan in ${state.name}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              {/* state name */}
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                <span className="text-white font-bold text-xs sm:text-sm leading-tight drop-shadow-md block">
                  Check challan in
                </span>
                <span className="text-white font-bold text-xs sm:text-sm leading-tight drop-shadow-md">
                  {state.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {STATES.length > visibleCount && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setExpanded((p) => !p)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              {expanded ? 'Show less ↑' : `Show all ${STATES.length} states ↓`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
