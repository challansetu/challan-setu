'use client';

import { useEffect, useState } from 'react';

const WA_NUMBER = '918796323876'; // 91 = India country code
const WA_MESSAGE = encodeURIComponent('Hi Challan Setu, I want to check discount eligibility for my vehicle challan. Please help me.');
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 lg:bottom-6 right-5 z-50 flex flex-col items-center gap-2">
      {/* Tooltip */}
      <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
        Chat with us
      </div>

      {/* Button */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative w-14 h-14 bg-[#25D366] hover:bg-[#20bc5a] text-white rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
      >
        {/* WhatsApp icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="currentColor"
          className="w-7 h-7 relative z-10"
        >
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.742 5.49 2.041 7.8L0 32l8.419-2.203A15.934 15.934 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.771-1.853l-.485-.287-5.03 1.315 1.34-4.894-.317-.502A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333z" />
          <path d="M23.18 19.385c-.388-.194-2.301-1.134-2.656-1.264-.356-.13-.615-.194-.874.194-.26.388-1.003 1.264-1.23 1.523-.226.26-.452.292-.84.097-.388-.194-1.638-.603-3.12-1.92-1.153-1.026-1.933-2.292-2.16-2.68-.226-.388-.024-.598.17-.791.174-.174.388-.453.582-.68.194-.226.26-.388.388-.647.13-.26.065-.485-.033-.68-.097-.194-.874-2.107-1.197-2.884-.315-.756-.636-.653-.874-.665-.226-.01-.485-.013-.743-.013-.26 0-.68.097-1.036.485-.355.388-1.357 1.328-1.357 3.238s1.39 3.756 1.584 4.015c.194.26 2.737 4.18 6.63 5.862.927.4 1.65.639 2.213.817.93.296 1.778.255 2.447.155.747-.11 2.301-.94 2.627-1.848.325-.907.325-1.684.227-1.848-.097-.163-.355-.26-.743-.453z" />
        </svg>
      </a>
    </div>
  );
}
