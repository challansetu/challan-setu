'use client';

import { trackWhatsAppClick } from '@/lib/analytics';

const WHATSAPP_NUMBER = '918796323876';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.742 5.49 2.041 7.8L0 32l8.419-2.203A15.934 15.934 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.771-1.853l-.485-.287-5.03 1.315 1.34-4.894-.317-.502A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333z" />
      <path d="M23.18 19.385c-.388-.194-2.301-1.134-2.656-1.264-.356-.13-.615-.194-.874.194-.26.388-1.003 1.264-1.23 1.523-.226.26-.452.292-.84.097-.388-.194-1.638-.603-3.12-1.92-1.153-1.026-1.933-2.292-2.16-2.68-.226-.388-.024-.598.17-.791.174-.174.388-.453.582-.68.194-.226.26-.388.388-.647.13-.26.065-.485-.033-.68-.097-.194-.874-2.107-1.197-2.884-.315-.756-.636-.653-.874-.665-.226-.01-.485-.013-.743-.013-.26 0-.68.097-1.036.485-.355.388-1.357 1.328-1.357 3.238s1.39 3.756 1.584 4.015c.194.26 2.737 4.18 6.63 5.862.927.4 1.65.639 2.213.817.93.296 1.778.255 2.447.155.747-.11 2.301-.94 2.627-1.848.325-.907.325-1.684.227-1.848-.097-.163-.355-.26-.743-.453z" />
    </svg>
  );
}

/**
 * Shared WhatsApp CTA button that fires a GA4 `whatsapp_click` event.
 * `location` identifies where it was clicked (e.g. "drink_and_drive_hero").
 */
export function WhatsAppCtaButton({
  label,
  subtitle,
  message,
  location,
  size = 'md',
  fullWidth = false,
}: {
  label: string;
  subtitle?: string;
  message: string;
  location: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  const iconSizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick(location)}
      className={`inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-gray-900 font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl group ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`}
    >
      <WhatsAppIcon className={`${iconSizes[size]} text-green-600 group-hover:scale-110 transition-transform`} />
      <div className="text-left">
        <div>{label}</div>
        {subtitle && <div className="text-xs opacity-75">{subtitle}</div>}
      </div>
    </a>
  );
}
