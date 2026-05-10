import Image from 'next/image';
import { RESPONSIBLE_DRIVERS } from '@/data/responsible-drivers';

const CARD_WIDTH = 300;   // px — card width on desktop
const GAP        = 20;    // px — gap between cards
const SPEED      = 50;    // px/s — scroll speed

export function WallOfDrivers() {
  const drivers = RESPONSIBLE_DRIVERS;
  if (drivers.length === 0) return null;

  // Duplicate so the loop is seamless (translateX(-50%) snaps back perfectly)
  const items = [...drivers, ...drivers];

  // One "lap" = original set width; duration = that distance / speed
  const lapWidth  = drivers.length * (CARD_WIDTH + GAP);
  const duration  = lapWidth / SPEED;

  return (
    <section
      aria-label="Wall of Responsible Drivers"
      className="py-16 sm:py-24 bg-[#06080f] overflow-hidden"
    >
      {/* Header */}
      <div className="container-app text-center mb-10 sm:mb-14">
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3 text-primary-400">
          Community
        </p>
        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none mb-4">
          Wall of Responsible Drivers
        </h2>
        <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto">
          Real drivers. Real savings. Safer roads.
        </p>
      </div>

      {/* Left + right fade masks */}
      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #06080f 0%, transparent 100%)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #06080f 0%, transparent 100%)' }}
        />

        {/* Auto-scroll track — reuses the same marquee-scroll keyframe */}
        <div
          className="flex w-max feature-marquee-track"
          style={{
            '--marquee-duration': `${duration}s`,
            gap: `${GAP}px`,
            paddingLeft: `${GAP}px`,
          } as React.CSSProperties}
        >
          {items.map((driver, i) => (
            <div
              key={`${driver.id}-${i}`}
              className="flex-none rounded-[18px] overflow-hidden shadow-lg shadow-black/50 transition-transform duration-300 hover:scale-[1.02]"
              style={{ width: `${CARD_WIDTH}px` }}
            >
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={driver.image}
                  alt={driver.alt}
                  fill
                  className="object-cover"
                  sizes={`${CARD_WIDTH}px`}
                  loading="lazy"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
