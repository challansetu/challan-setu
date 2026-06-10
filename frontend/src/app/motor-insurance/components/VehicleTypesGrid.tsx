import Image from 'next/image';
import { VEHICLE_TYPES } from '../data';
import { SectionHeading } from './SectionHeading';

const DARK_ICON_FILTER =
  'brightness(0) saturate(100%) invert(14%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(20%) contrast(100%)';

export function VehicleTypesGrid() {
  return (
    <section className="pt-8 bg-white" aria-labelledby="vehicles-heading">
      <div className="container-app max-w-5xl">
        <SectionHeading
          id="vehicles-heading"
          title="All Vehicle Types Covered"
          subtitle="Our insurance check works for every vehicle registered in the VAHAN database"
          mb="mb-6"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {VEHICLE_TYPES.map((v) => (
            <div
              key={v.label}
              className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col items-center gap-3 shadow-premium card-hover"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(245,200,66,0.15)' }}
              >
                <Image src={v.src} alt={v.label} width={36} height={36} style={{ filter: DARK_ICON_FILTER }} />
              </div>
              <div className="text-center">
                <div className="font-bold text-sm text-gray-900">{v.label}</div>
                <div className="text-xs text-gray-400">{v.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
