import Link from 'next/link';
import { CheckCircle2, CarFront, ShieldCheck, ArrowRight, Clock3 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { ChallanSection } from '@/components/ChallanSection';

const WA_NUMBER = '918796323876';

const nextSteps = [
  {
    title: 'Request submitted',
    description: 'Your details have been received successfully.',
  },
  {
    title: 'Verification in progress',
    description: 'We’re checking your challan request and eligibility.',
  },
  {
    title: 'Next update shared',
    description: 'You’ll receive the next step shortly.',
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

function formatTimeLabel(value?: string) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
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
  const submittedTime = formatTimeLabel(searchParams?.createdAt);
  const whatsappMessage = buildWhatsAppUrl(
    `Hi ChallanSetu, I submitted a request for vehicle ${vehicleNumber || 'my vehicle'}. My request ID is ${requestId}.`,
  );
  const screenshotMessage = buildWhatsAppUrl(
    `Hi ChallanSetu, I want to share a challan screenshot for vehicle ${vehicleNumber || 'my vehicle'}. My request ID is ${requestId}.`,
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-primary-50 via-white to-surface-50">
        <section className="container-app py-8">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-[2rem] border border-primary-100/80 bg-white shadow-[0_30px_80px_rgba(79,70,229,0.12)] overflow-hidden">
              <div className="relative overflow-hidden bg-gradient-hero px-8 py-10 text-white">
                <div className="absolute inset-0 pattern-dots opacity-30" />
                <div className="absolute -top-10 -right-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-3">

                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                      Request received
                    </h1>
                    <CheckCircle2 className="w-8 h-8 text-accent-200 flex-shrink-0" />
                  </div>
                  <div>
                    <p className="mt-3 max-w-lg text-sm sm:text-base leading-relaxed text-primary-100/90">
                      Your challan request has been submitted successfully.
                    </p>
                    <p className="mt-2 text-sm font-medium text-primary-100/80">
                      No payment is required at this stage.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-8 sm:px-10 sm:py-10">
                {vehicleNumber && <ChallanSection vehicleNumber={vehicleNumber} />}
                <div className="rounded-[1.6rem] border border-primary-100 bg-gradient-to-br from-surface-50 to-white px-5 py-5">
                  <div className="flex items-center gap-2.5 text-primary-600">
                    <CarFront className="w-4.5 h-4.5 flex-shrink-0" />
                    <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary-500">
                      Vehicle Number
                    </p>
                  </div>
                  <p className="mt-2 text-[2.1rem] leading-none font-black tracking-tight text-gray-900 break-all">
                    {vehicleNumber || 'Submitted'}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                        Request ID
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">{requestId}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                        Status
                      </p>
                      <div className="mt-1 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        {statusLabel}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                        Expected update
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-700">Within 15–30 mins</p>
                    </div>
                    {submittedTime && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                          Last updated
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                          <Clock3 className="h-4 w-4 text-primary-500" />
                          {submittedTime}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-gray-500">
                    Your request is currently under verification.
                  </p>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <a
                    href={whatsappMessage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto sm:flex-1"
                  >
                    <Button variant="success" size="lg" className="w-full rounded-2xl">
                      WhatsApp Us
                      <WhatsAppIcon className="w-5 h-5" />
                    </Button>
                  </a>
                  <a
                    href={screenshotMessage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button variant="outline" size="lg" className="w-full rounded-2xl">
                      Share Your Challan
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>

                <div className="mt-8 border-t border-primary-100 pt-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary-500" />
                    <h2 className="text-base font-bold text-gray-900">What happens next</h2>
                  </div>

                  <div className="mt-5 space-y-4">
                    {nextSteps.map((step, index) => (
                      <div
                        key={step.title}
                        className={`flex gap-3 ${index < nextSteps.length - 1 ? 'pb-4 border-b border-gray-100' : ''}`}
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold bg-primary-50 text-primary-600">
                          {index + 1}
                        </div>
                        <div className="pt-0.5">
                          <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-gray-500">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-2 text-sm text-gray-500">
                  <ShieldCheck className="h-4 w-4 text-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">No payment required at this stage.</p>
                    <p className="mt-1">We never ask for OTP, UPI PIN, or bank details.</p>
                  </div>
                </div>

                <div className="mt-5">
                  <Link href="/" className="inline-flex text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                    Back to homepage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
