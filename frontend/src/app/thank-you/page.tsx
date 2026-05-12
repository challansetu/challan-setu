import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { EparivahanChallanSection, PublicChallanSection } from '@/components/EparivahanChallanSection';
import { ConfettiEffect } from '@/components/ConfettiEffect';

const WA_NUMBER = '918796323876';

const nextSteps = [
  {
    title: 'Request submitted',
    description: 'Your details have been received successfully.',
  },
  {
    title: 'Verification in progress',
    description: "We're checking your challan request and eligibility.",
  },
  {
    title: 'Next update shared',
    description: "You'll receive the next step shortly.",
  },
];

function formatRequestId(leadId?: string) {
  if (!leadId) return 'CS-PENDING';
  const compact = leadId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return `CS-${compact.slice(-8)}`;
}

function formatLeadStatus(status?: string) {
  if (!status) return 'Verification Pending';
  const normalized = status.trim().toLowerCase();
  if (normalized === 'new') return 'Verification Pending';
  return normalized
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.742 5.49 2.041 7.8L0 32l8.419-2.203A15.934 15.934 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.771-1.853l-.485-.287-5.03 1.315 1.34-4.894-.317-.502A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333z" />
      <path d="M23.18 19.385c-.388-.194-2.301-1.134-2.656-1.264-.356-.13-.615-.194-.874.194-.26.388-1.003 1.264-1.23 1.523-.226.26-.452.292-.84.097-.388-.194-1.638-.603-3.12-1.92-1.153-1.026-1.933-2.292-2.16-2.68-.226-.388-.024-.598.17-.791.174-.174.388-.453.582-.68.194-.226.26-.388.388-.647.13-.26.065-.485-.033-.68-.097-.194-.874-2.107-1.197-2.884-.315-.756-.636-.653-.874-.665-.226-.01-.485-.013-.743-.013-.26 0-.68.097-1.036.485-.355.388-1.357 1.328-1.357 3.238s1.39 3.756 1.584 4.015c.194.26 2.737 4.18 6.63 5.862.927.4 1.65.639 2.213.817.93.296 1.778.255 2.447.155.747-.11 2.301-.94 2.627-1.848.325-.907.325-1.684.227-1.848-.097-.163-.355-.26-.743-.453z" />
    </svg>
  );
}

export default function ThankYouPage({
  searchParams,
}: {
  searchParams?: { vehicle?: string; lead?: string; status?: string; createdAt?: string };
}) {
  const vehicleNumber = searchParams?.vehicle?.toUpperCase() ?? '';
  const requestId = formatRequestId(searchParams?.lead);
  const statusLabel = formatLeadStatus(searchParams?.status);

  const whatsappMessage = buildWhatsAppUrl(
    `Hi ChallanSetu, I submitted a request for vehicle ${vehicleNumber || 'my vehicle'}. My request ID is ${requestId}.`,
  );
  const screenshotMessage = buildWhatsAppUrl(
    `Hi ChallanSetu, I want to share a challan screenshot for vehicle ${vehicleNumber || 'my vehicle'}. My request ID is ${requestId}.`,
  );

  return (
    <>
      <ConfettiEffect />
      <Navbar />

      <main className="relative min-h-screen bg-[#F2F4F8]">

        {/* ── Hero ── */}
        {/* Mobile: fixed behind cards. Desktop: normal flow, taller */}
        <div className="fixed top-16 inset-x-0 z-0 overflow-hidden bg-gradient-to-b from-[#1a237e] to-[#3D5AFE] px-6 pt-8 pb-6 text-center h-[190px] sm:relative sm:top-auto sm:inset-x-auto sm:z-auto sm:h-auto sm:py-16">
          <div className="absolute -top-16 -right-12 h-56 w-56 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/5" />
          <div className="relative">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 backdrop-blur-sm sm:h-14 sm:w-14">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white sm:h-7 sm:w-7">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight sm:text-4xl">Request Received</h1>
            <p className="mt-1 text-xs text-blue-300 sm:text-sm sm:mt-2">No payment is required at this stage</p>
          </div>
        </div>

        {/* Mobile-only spacer */}
        <div className="h-[190px] sm:hidden" />

        {/* ── Content area ── */}
        {/* Mobile: cards slide over fixed hero. Desktop: normal flow on gray bg */}
        <div className="relative z-10 rounded-t-3xl bg-[#F2F4F8] -mt-6 sm:mt-0 sm:rounded-none sm:shadow-none">
          <div className="px-4 pt-5 pb-28 max-w-lg mx-auto sm:max-w-6xl sm:px-10 sm:pt-10 sm:pb-20">

            {/* Status banner — desktop only, above grid */}
            <div className="hidden sm:block rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden mb-6">
              <div className="flex items-center gap-2 bg-green-50 border-b border-green-100 px-5 py-2.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                <span className="text-xs font-semibold text-green-700">Agent assigned · Response within 30 min</span>
              </div>
              <div className="px-5 py-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-amber-900">Our team will contact you shortly</p>
                  <p className="mt-1 text-xs text-amber-600/90 leading-relaxed">You'll receive a call or WhatsApp message within 30 minutes</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-[10px] font-black tracking-widest uppercase text-amber-400">Request ID</p>
                  <p className="mt-0.5 font-mono text-sm font-bold text-amber-800">{requestId}</p>
                </div>
              </div>
            </div>

            {/* ── Desktop two-column grid ── */}
            <div className="sm:grid sm:grid-cols-[3fr_2fr] sm:gap-8 sm:items-start space-y-4 sm:space-y-0">

              {/* Left column */}
              <div className="space-y-4">

                {/* Vehicle info card */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                  <div className="flex">
                    <div className="w-1 flex-shrink-0 bg-blue-500" />
                    <div className="flex-1 px-5 py-5">
                      <p className="text-[10px] font-black tracking-[0.22em] text-blue-600 uppercase mb-2">
                        Vehicle Information
                      </p>
                      <p className="text-2xl font-black leading-none tracking-widest text-gray-900 break-all">
                        {vehicleNumber || '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status banner — mobile only (desktop version is above the grid) */}
                <div className="sm:hidden rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 bg-green-50 border-b border-green-100 px-5 py-2.5">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                    <span className="text-xs font-semibold text-green-700">Agent assigned · Response within 30 min</span>
                  </div>
                  <div className="px-5 py-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Our team will contact you shortly</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-[10px] font-black tracking-widest uppercase text-gray-400">Request ID</p>
                      <p className="mt-0.5 font-mono text-sm font-bold text-gray-800">{requestId}</p>
                    </div>
                  </div>
                </div>

                {/* Challan sections */}
                {vehicleNumber && (
                  <>
                    {/* Heading for scraped public data */}
                    <div>
                      <p className="text-sm font-bold text-gray-700">Reported Challans</p>
                      <p className="text-xs text-gray-400 mt-0.5">From publicly available traffic records. May not reflect the latest status.</p>
                    </div>
                    <PublicChallanSection vehicleNumber={vehicleNumber} />
                    <EparivahanChallanSection vehicleNumber={vehicleNumber} />
                  </>
                )}


              </div>

              {/* Right column — sticky on desktop */}
              <div className="space-y-4 sm:sticky sm:top-24 sm:self-start">

                {/* What happens next */}
                <div className="rounded-2xl bg-white shadow-sm px-5 py-5">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                    <h2 className="text-xs font-black tracking-[0.2em] text-gray-500 uppercase">What happens next</h2>
                  </div>
                  <div className="space-y-4">
                    {nextSteps.map((step, index) => (
                      <div
                        key={step.title}
                        className={`flex gap-3 ${index < nextSteps.length - 1 ? 'pb-4 border-b border-gray-50' : ''}`}
                      >
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-blue-600">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                          <p className="mt-0.5 text-xs text-gray-500">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons — desktop only, in right col */}
                <div className="hidden sm:flex flex-col gap-3">
                  <a href={whatsappMessage} target="_blank" rel="noopener noreferrer">
                    <Button variant="success" size="md" className="w-full rounded-xl whitespace-nowrap text-sm font-bold py-3">
                      WhatsApp Us
                      <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
                    </Button>
                  </a>
                  <a href={screenshotMessage} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="md" className="w-full rounded-xl whitespace-nowrap text-sm font-bold py-3">
                      Share Challan Screenshot
                      <ArrowRight className="w-4 h-4 flex-shrink-0" />
                    </Button>
                  </a>
                </div>

                {/* Trust note — desktop only */}
                <div className="hidden sm:flex items-center gap-2 px-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <p className="text-xs text-gray-400">We never ask for OTP, UPI PIN, or bank details.</p>
                </div>
                <div className="hidden sm:block px-1">
                  <Link href="/" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    ← Back to homepage
                  </Link>
                </div>

              </div>
            </div>

            {/* Trust + back link — mobile only */}
            <div className="sm:hidden mt-4 space-y-2">
              <div className="flex items-center gap-2 px-1">
                <ShieldCheck className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-400">We never ask for OTP, UPI PIN, or bank details.</p>
              </div>
              <div className="px-1">
                <Link href="/" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  ← Back to homepage
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Fixed bottom action bar — mobile only */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 py-3">
        <div className="flex gap-3">
          <a href={whatsappMessage} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="success" size="md" className="w-full rounded-xl whitespace-nowrap text-sm font-bold py-3">
              WhatsApp Us
              <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
            </Button>
          </a>
          <a href={screenshotMessage} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" size="md" className="w-full rounded-xl whitespace-nowrap text-sm font-bold py-3">
              Share Challan
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </Button>
          </a>
        </div>
      </div>
    </>
  );
}
