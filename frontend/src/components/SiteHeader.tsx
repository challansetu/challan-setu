import { InsuranceTopBar } from '@/components/InsuranceTopBar';
import { Navbar } from '@/components/Navbar';

/**
 * Sticky site header — InsuranceTopBar + Navbar together as one unit.
 * Both bars scroll with the page until they hit the top, then stick.
 * Combined height: ~40px (topbar) + 64px (navbar) = ~104px
 */
export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50">
      <InsuranceTopBar />
      <Navbar />
    </div>
  );
}
