'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowRight, Pencil, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { leadsApi } from '@/lib/api';
import { VEHICLE_NUMBER_REGEX, VEHICLE_NUMBER_MIN_LENGTH, VEHICLE_NUMBER_MAX_LENGTH } from '@/lib/constants';
import { LeadCaptureModal } from '@/components/LeadCaptureModal';
import { Logo } from '@/components/Logo';

const USER_INFO_KEY = 'challan_user_info';

function formatVehicleNumber(val: string) {
  let cleaned = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let formatted = '';
  const stateMatch = cleaned.match(/^[A-Z]{1,2}/);
  if (!stateMatch) return cleaned;
  formatted += stateMatch[0];
  cleaned = cleaned.substring(stateMatch[0].length);
  if (stateMatch[0].length === 2 && cleaned.length > 0) formatted += ' ';
  const rtoMatch = cleaned.match(/^[0-9A-Z]{1,2}/);
  if (!rtoMatch) return formatted;
  formatted += rtoMatch[0];
  cleaned = cleaned.substring(rtoMatch[0].length);
  if (rtoMatch[0].length === 2 && cleaned.length > 0) formatted += ' ';
  const seriesMatch = cleaned.match(/^[A-Z]+/);
  if (seriesMatch) {
    formatted += seriesMatch[0];
    cleaned = cleaned.substring(seriesMatch[0].length);
    if (cleaned.length > 0) formatted += ' ';
  }
  if (cleaned.length > 0) formatted += cleaned;
  return formatted;
}

interface VehicleInfoCardProps {
  vehicleNumber: string;
}

export function VehicleInfoCard({ vehicleNumber }: VehicleInfoCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayVehicle, setOverlayVehicle] = useState('');
  const [overlayError, setOverlayError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedVehicle, setSubmittedVehicle] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingVehicle, setPendingVehicle] = useState('');

  useEffect(() => {
    if (!showOverlay) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !loading) setShowOverlay(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [showOverlay, loading]);

  useEffect(() => {
    if (showOverlay) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showOverlay]);

  const openOverlay = useCallback(() => {
    setOverlayVehicle('');
    setOverlayError('');
    setShowOverlay(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    const cleaned = overlayVehicle.toUpperCase().replace(/[\s\-./]/g, '');
    if (cleaned.length < VEHICLE_NUMBER_MIN_LENGTH || cleaned.length > VEHICLE_NUMBER_MAX_LENGTH) {
      setOverlayError('Please enter a valid vehicle number');
      return;
    }
    if (!VEHICLE_NUMBER_REGEX.test(cleaned)) {
      setOverlayError('Invalid format. Example: DL 7S BY 1234');
      return;
    }

    setOverlayError('');

    let userInfo: { fullName: string; mobileNumber: string } | null = null;
    try {
      const stored = localStorage.getItem(USER_INFO_KEY);
      if (stored) userInfo = JSON.parse(stored);
    } catch {}

    if (userInfo?.fullName && userInfo?.mobileNumber) {
      setLoading(true);
      let response;
      try {
        response = await leadsApi.create({
          fullName: userInfo.fullName,
          mobileNumber: userInfo.mobileNumber,
          vehicleNumber: cleaned,
          consentAccepted: true,
          source: 'homepage',
        });
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        try {
          response = await leadsApi.create({
            fullName: userInfo.fullName,
            mobileNumber: userInfo.mobileNumber,
            vehicleNumber: cleaned,
            consentAccepted: true,
            source: 'homepage',
          });
        } catch {
          setLoading(false);
          setOverlayError('Something went wrong. Please try again.');
          return;
        }
      }
      const leadId = response?.data?.leadId;
      const leadStatus = response?.data?.leadStatus;
      const createdAt = response?.data?.createdAt;
      const params = new URLSearchParams({
        vehicle: cleaned,
        ...(leadId ? { lead: leadId } : {}),
        ...(leadStatus ? { status: leadStatus } : {}),
        ...(createdAt ? { createdAt } : {}),
      });
      setSubmittedVehicle(cleaned);
      setSubmitted(true);
      setShowOverlay(false);
      window.location.href = `/thank-you?${params.toString()}`;
    } else {
      setShowOverlay(false);
      setPendingVehicle(cleaned);
      setModalOpen(true);
    }
  }, [overlayVehicle]);

  if (submitted) {
    return createPortal(
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white">
        <Logo scheme="dark" height={44} />
        <div className="mt-10 relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin" />
          <div className="absolute w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <p className="mt-8 text-xl font-bold text-gray-900">Checking your eligibility…</p>
        <p className="mt-2 text-sm font-medium text-gray-400">Vehicle: {submittedVehicle}</p>
      </div>,
      document.body,
    );
  }

  return (
    <>
      {/* Vehicle info card */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex">
          <div className="w-1 flex-shrink-0 bg-blue-500" />
          <div className="flex-1 px-5 py-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] text-blue-600 uppercase mb-2">
                Vehicle Information
              </p>
              <p className="text-2xl font-black leading-none tracking-widest text-gray-900 break-all">
                {vehicleNumber || '—'}
              </p>
            </div>
            <button
              type="button"
              onClick={openOverlay}
              aria-label="Search another vehicle"
              title="Search another vehicle"
              className="flex-shrink-0 text-gray-400 hover:text-blue-600 transition-colors p-1"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {showOverlay && createPortal(
        <div className="fixed inset-0 z-[150] flex flex-col sm:items-center sm:justify-center sm:bg-gray-900/50 sm:backdrop-blur-sm sm:p-4">
          <div className="flex flex-col bg-white w-full h-full sm:h-auto sm:max-w-lg sm:rounded-3xl sm:shadow-2xl sm:max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 sm:border-b sm:border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Enter vehicle number</h2>
              <button
                type="button"
                onClick={() => !loading && setShowOverlay(false)}
                disabled={loading}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Input */}
            <div className="px-5 pt-1 sm:pt-5">
              <div className={`flex items-center rounded-2xl border-2 overflow-hidden ${overlayError ? 'border-red-400' : 'border-primary-500'}`}>
                <div className="flex items-center gap-1.5 bg-primary-600 px-3 self-stretch">
                  <span className="text-base leading-none">🇮🇳</span>
                  <span className="text-xs font-bold text-white tracking-wider">IND</span>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={overlayVehicle}
                  onChange={(e) => {
                    setOverlayVehicle(formatVehicleNumber(e.target.value));
                    if (overlayError) setOverlayError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handleSubmit()}
                  placeholder="e.g. DL 7S BY 5194"
                  maxLength={VEHICLE_NUMBER_MAX_LENGTH + 3}
                  autoComplete="off"
                  autoCapitalize="characters"
                  disabled={loading}
                  className="flex-1 py-4 px-4 text-base font-semibold text-gray-900 placeholder-gray-400 outline-none bg-transparent disabled:opacity-50"
                />
              </div>
              {overlayError ? (
                <p className="mt-2 text-sm text-red-500 px-1">{overlayError}</p>
              ) : (
                <p className="mt-2 text-sm text-gray-400 px-1">Same as your vehicle registration number</p>
              )}
            </div>

            <div className="flex-1 sm:hidden" />

            {/* CTA */}
            <div className="p-5 border-t border-gray-100 sm:mt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!overlayVehicle.trim() || loading}
                className="w-full h-14 rounded-2xl bg-primary-600 text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Check Challans
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      <LeadCaptureModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        vehicleNumber={pendingVehicle}
        source="homepage"
      />
    </>
  );
}
