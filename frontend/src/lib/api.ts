import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30-second timeout for all requests
});

// ─── Challans (public) ───────────────────────────────
export const challansApi = {
  getPublic: (vehicleNumber: string) =>
    api.get<{ challans: ChallanEntry[] }>('/challans/public', {
      params: { vehicle: vehicleNumber },
      timeout: 35000,
    }),

  eparivahanInitiate: (vehicleNumber: string) =>
    api.post<
      | { otpRequired: false; challans: ChallanEntry[]; confirmed: boolean }
      | { otpRequired: true; sessionId: string; otpMessage: string }
    >('/challans/eparivahan/initiate', { vehicleNumber }, { timeout: 60000 }),

  eparivahanVerify: (sessionId: string, otp: string) =>
    api.post<{ challans: ChallanEntry[] }>('/challans/eparivahan/verify', { sessionId, otp }, { timeout: 30000 }),
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
  }) => api.post('/leads', data, { timeout: 25000 }),
};

// ─── Recovery Leads ─────────────────────────────────
export const recoveryLeadsApi = {
  create: (data: {
    fullName: string;
    mobileNumber: string;
    vehicleNumber: string;
    consentAccepted: boolean;
  }) => api.post('/leads', {
    ...data,
    source: 'vehicle_recovery',
    notes: '[VEHICLE RECOVERY]',
  }, { timeout: 25000 }),
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
