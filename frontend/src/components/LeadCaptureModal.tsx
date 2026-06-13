'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { ArrowRight, RotateCw, X } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api, { leadsApi } from '@/lib/api';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH, PHONE_MAX_DIGITS, PHONE_REGEX } from '@/lib/constants';
import messages from '@/data/messages.json';

interface LeadCaptureModalProps {
  open: boolean;
  onClose: () => void;
  vehicleNumber: string;
  source?: 'homepage' | 'city_page';
  city?: string;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';
type TouchedState = {
  fullName: boolean;
  mobileNumber: boolean;
};

/**
 * Reduce any input (typed, pasted, or browser-autofilled) to a bare 10-digit
 * Indian mobile number. The field already shows a "+91" prefix, so an autofill
 * like "+91 82876 50767" must have its country code stripped BEFORE we cap to
 * 10 digits — otherwise the "91" is kept and the real digits get truncated.
 */
function toNationalMobile(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.length > PHONE_MAX_DIGITS) {
    if (digits.startsWith('91')) digits = digits.slice(2);
    else if (digits.startsWith('0')) digits = digits.slice(1);
  }
  return digits.slice(0, PHONE_MAX_DIGITS);
}

export function LeadCaptureModal({
  open,
  onClose,
  vehicleNumber,
  source = 'homepage',
  city,
}: LeadCaptureModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState<TouchedState>({
    fullName: false,
    mobileNumber: false,
  });

  useEffect(() => {
    if (!open) return;

    setFullName('');
    setMobileNumber('');
    setSubmitState('idle');
    setErrorMessage('');
    setTouched({
      fullName: false,
      mobileNumber: false,
    });

    // Warm up the backend while the user fills in the form so cold starts
    // don't hit during the actual submission.
    api.get('/health', { timeout: 30000 }).catch(() => {});
  }, [open, vehicleNumber]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && submitState !== 'loading') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose, submitState]);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  const normalizedName = fullName.trim().replace(/\s+/g, ' ');
  const isNameValid = normalizedName.length >= NAME_MIN_LENGTH;
  const isPhoneValid = PHONE_REGEX.test(mobileNumber);
  const isVehicleValid = vehicleNumber.length > 0;
  const isFormValid = isVehicleValid && isNameValid && isPhoneValid;

  const fullNameError =
    touched.fullName && !normalizedName
      ? messages.validation.nameRequired
      : touched.fullName && !isNameValid
        ? messages.validation.nameMinLength.replace('{min}', String(NAME_MIN_LENGTH))
        : '';
  const mobileError =
    touched.mobileNumber && !mobileNumber
      ? messages.validation.phoneInvalid
      : touched.mobileNumber && !isPhoneValid
        ? messages.validation.phoneInvalid
        : '';

  const fieldError = useMemo(() => {
    if (submitState !== 'error') return '';
    return errorMessage;
  }, [errorMessage, submitState]);

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === overlayRef.current && submitState !== 'loading') {
        onClose();
      }
    },
    [onClose, submitState],
  );

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid) {
      setTouched({
        fullName: true,
        mobileNumber: true,
      });
      return;
    }

    setSubmitState('loading');
    setErrorMessage('');

    const payload = {
      fullName: normalizedName,
      mobileNumber,
      vehicleNumber,
      consentAccepted: true as const,
      source,
      city,
    };

    let response;
    try {
      response = await leadsApi.create(payload);
    } catch {
      // retry once after a delay — gives Railway's cold-starting backend time to wake up
      await new Promise((resolve) => setTimeout(resolve, 5000));
      try {
        response = await leadsApi.create(payload);
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          'We could not submit your request right now. Please try again.';
        setErrorMessage(Array.isArray(message) ? message[0] : message);
        setSubmitState('error');
        return;
      }
    }

    setSubmitState('success');
    try {
      localStorage.setItem('challan_user_info', JSON.stringify({ fullName: normalizedName, mobileNumber }));
    } catch {}
    const leadId = response?.data?.leadId;
    const leadStatus = response?.data?.leadStatus;
    const createdAt = response?.data?.createdAt;
    redirectTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams({
        vehicle: vehicleNumber,
        ...(leadId ? { lead: leadId } : {}),
        ...(leadStatus ? { status: leadStatus } : {}),
        ...(createdAt ? { createdAt } : {}),
        ...(city ? { city } : {}),
      });
      router.push(`/thank-you?${params.toString()}`);
    }, 700);
  }, [city, isFormValid, mobileNumber, normalizedName, onClose, router, source, vehicleNumber]);

  if (!open) return null;

  if (submitState === 'success') {
    return createPortal(
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white">
        <Logo scheme="dark" height={44} />
        <div className="mt-10 relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-amber-100 border-t-amber-500 animate-spin" />
          <div className="absolute w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <p className="mt-8 text-xl font-bold text-gray-900">Checking your eligibility…</p>
        <p className="mt-2 text-sm font-medium text-gray-400">Vehicle: {vehicleNumber}</p>
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-gray-900/60 backdrop-blur-md p-0 sm:p-4 animate-fade-in"
    >
      <div className="w-full sm:max-w-[480px] bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-premium-2xl overflow-hidden animate-sheet-up sm:animate-scale-in flex flex-col relative">
        <div className="sm:hidden flex justify-center pt-4 pb-0">
          <div className="w-12 h-1.5 bg-gray-100 rounded-full" />
        </div>

        <div className="relative px-8 pt-6 pb-4 text-center">
          <button
            onClick={onClose}
            disabled={submitState === 'loading'}
            className="absolute top-4 right-6 p-2 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-6">
            <Logo scheme="dark" height={42} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Continue with your request
          </h2>
          <p className="text-gray-500 mt-1.5 text-base font-medium leading-relaxed">
            Share your details and we&apos;ll verify the best challan discount option for you.
          </p>
        </div>

        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-left">
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-gray-500">
                Vehicle Number
              </p>
              <p className="mt-1 text-base font-semibold text-gray-900">{vehicleNumber}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                {messages.labels.fullName}
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  if (submitState === 'error') {
                    setSubmitState('idle');
                    setErrorMessage('');
                  }
                }}
                onBlur={() => setTouched((current) => ({ ...current, fullName: true }))}
                maxLength={NAME_MAX_LENGTH}
                error={fullNameError}
                className="h-14 text-base font-medium rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all pl-5"
                autoComplete="name"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                {messages.labels.mobileNumber}
              </label>
              <div className="w-full">
                <div className={`flex items-center rounded-2xl border shadow-sm transition-all duration-200 ${
                  mobileError
                    ? 'border-red-400 bg-red-50/50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <div className="px-4 text-sm font-semibold text-gray-500">+91</div>
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={mobileNumber}
                    onChange={(event) => {
                      setMobileNumber(toNationalMobile(event.target.value));
                      if (submitState === 'error') {
                        setSubmitState('idle');
                        setErrorMessage('');
                      }
                    }}
                    onBlur={() => setTouched((current) => ({ ...current, mobileNumber: true }))}
                    inputMode="numeric"
                    autoComplete="tel-national"
                    className="w-full h-14 rounded-r-2xl bg-transparent pr-5 text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                {mobileError ? (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {mobileError}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-gray-400">10-digit Indian mobile number</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
              We never ask for OTP, UPI PIN, or bank details.
            </div>

            {submitState === 'error' && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {fieldError}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              loading={submitState === 'loading'}
              disabled={!isFormValid}
              className="w-full rounded-2xl h-14"
            >
              {submitState === 'loading' ? 'Submitting...' : 'Submit Request'}
              {submitState !== 'loading' && <ArrowRight className="w-5 h-5" />}
            </Button>

            {submitState === 'error' && (
              <button
                type="button"
                onClick={() => {
                  setSubmitState('idle');
                  setErrorMessage('');
                }}
                className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                <RotateCw className="w-4 h-4" />
                Reset and try again
              </button>
            )}

            <p className="text-center text-xs font-medium text-gray-400">
              Your information is safe and secure.
            </p>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}
