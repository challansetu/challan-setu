'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { trackBannerClick } from '@/lib/analytics';

/**
 * Slim announcement bar shown above the navbar that nudges visitors toward
 * the motor-insurance page. Click is tracked as `banner_click` in GA4.
 * Hidden during offline hours (outside 11 AM - 10 PM IST).
 */
export function InsuranceTopBar() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkOnlineStatus = () => {
      const now = new Date();
      // Convert to IST (UTC+5:30)
      const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const hour = istTime.getHours();
      // Online if between 11 AM and 10 PM (before 22:00)
      setIsOnline(hour >= 11 && hour < 22);
    };

    checkOnlineStatus();
    // Check every minute
    const interval = setInterval(checkOnlineStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Hide banner during offline hours
  if (!isOnline) return null;

  return (
    <Link
      href="/motor-insurance"
      onClick={() => trackBannerClick('insurance_topbar', { placement: 'home_topbar' })}
      className="group block w-full fixed top-0 left-0 right-0 z-50"
      style={{ background: 'linear-gradient(90deg, #f5c842 0%, #e8a800 100%)' }}
    >
      <div className="container-app flex items-center justify-center gap-2 py-2 text-[12.5px] sm:text-sm font-bold text-[#1a1a1a]">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span className="sm:hidden">Insurance expiring? Check &amp; renew</span>
        <span className="hidden sm:inline">Vehicle insurance expiring? Check status &amp; renew — save up to 91%</span>
        <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
