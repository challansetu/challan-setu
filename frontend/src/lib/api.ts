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
    source?: 'homepage' | 'city_page';
    city?: string;
  }) => api.post('/leads', data, { timeout: 10000 }),
};

export default api;
