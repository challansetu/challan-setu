import axios from 'axios';
import { trackEvent } from './analytics';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30-second timeout for all requests
});

// ─── Analytics helpers (GA4) ─────────────────────────
function trackChallanResults(challans: ChallanEntry[] | undefined, extra: Record<string, unknown>) {
  const list = challans ?? [];
  trackEvent('challan_results_viewed', {
    challan_count: list.length,
    total_amount: list.reduce((sum, c) => sum + (c.amountChallan || 0), 0),
    ...extra,
  });
}

// ─── Challans (public) ───────────────────────────────
export const challansApi = {
  getPublic: (vehicleNumber: string) => {
    trackEvent('challan_search_started', { method: 'public' });
    const req = api.get<{ challans: ChallanEntry[] }>('/challans/public', {
      params: { vehicle: vehicleNumber },
      timeout: 35000,
    });
    req
      .then((res) => trackChallanResults(res.data?.challans, { method: 'public' }))
      .catch(() => trackEvent('challan_search_failed', { method: 'public' }));
    return req;
  },

  eparivahanInitiate: (vehicleNumber: string) => {
    trackEvent('challan_search_started', { method: 'eparivahan' });
    const req = api.post<
      | { otpRequired: false; challans: ChallanEntry[]; confirmed: boolean }
      | { otpRequired: true; sessionId: string; otpMessage: string }
    >('/challans/eparivahan/initiate', { vehicleNumber }, { timeout: 60000 });
    req
      .then((res) => {
        if (res.data && res.data.otpRequired === false) {
          trackChallanResults(res.data.challans, { method: 'eparivahan', step: 'initiate' });
        } else {
          trackEvent('challan_otp_required', { method: 'eparivahan' });
        }
      })
      .catch(() => trackEvent('challan_search_failed', { method: 'eparivahan', step: 'initiate' }));
    return req;
  },

  eparivahanVerify: (sessionId: string, otp: string) => {
    const req = api.post<{ challans: ChallanEntry[] }>('/challans/eparivahan/verify', { sessionId, otp }, { timeout: 30000 });
    req
      .then((res) => trackChallanResults(res.data?.challans, { method: 'eparivahan', step: 'verify' }))
      .catch(() => trackEvent('challan_search_failed', { method: 'eparivahan', step: 'verify' }));
    return req;
  },
};

export interface ChallanEntry {
  challanNo: string;
  dateChallan: string;
  amountChallan: number;
  status: string;
  locationChallan: string;
  detailsViolation: { offence: string; penalty: string | number | null }[];
  challan_search_source: string;
}

// ─── Leads ──────────────────────────────────────────
export const leadsApi = {
  create: (data: {
    fullName: string;
    mobileNumber: string;
    vehicleNumber: string;
    consentAccepted: boolean;
    source?: 'homepage' | 'city_page' | 'insurance';
    city?: string;
  }) => {
    const req = api.post('/leads', data, { timeout: 25000 });
    req
      .then(() => trackEvent('lead_submitted', { source: data.source ?? 'homepage', city: data.city ?? null }))
      .catch(() => {});
    return req;
  },
};

// ─── Recovery Leads ─────────────────────────────────
export const recoveryLeadsApi = {
  create: (data: {
    fullName: string;
    mobileNumber: string;
    vehicleNumber: string;
    consentAccepted: boolean;
  }) => {
    const req = api.post('/leads', {
      ...data,
      source: 'vehicle_recovery',
      notes: '[VEHICLE RECOVERY]',
    }, { timeout: 25000 });
    req
      .then(() => trackEvent('lead_submitted', { source: 'vehicle_recovery' }))
      .catch(() => {});
    return req;
  },
};

// ─── Payments (Razorpay) ────────────────────────────
export interface CreateOrderResponse {
  keyId: string;
  orderId: string;
  amount: number; // paise
  currency: string;
  name: string;
  phone: string;
  email: string | null;
}

export const paymentsApi = {
  createOrder: (data: {
    amount: number; // rupees
    name: string;
    phone: string;
    email?: string;
    note?: string;
  }) => api.post<CreateOrderResponse>('/payments/order', data, { timeout: 25000 }),

  verify: (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => api.post<{ success: boolean; status: PaymentStatusValue; orderId: string }>('/payments/verify', data, { timeout: 25000 }),

  getStatus: (orderId: string) =>
    api.get<{ orderId: string; status: PaymentStatusValue; amount: number }>(`/payments/status/${orderId}`, { timeout: 20000 }),
};

export type PaymentStatusValue =
  | 'CREATED'
  | 'AUTHORIZED'
  | 'PAID'
  | 'FAILED'
  | 'VERIFICATION_FAILED'
  | 'FLAGGED'
  | 'PENDING';

export default api;
