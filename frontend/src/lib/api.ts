import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30-second timeout for all requests
});

// ─── Leads ──────────────────────────────────────────
export const leadsApi = {
  create: (data: {
    fullName: string;
    mobileNumber: string;
    vehicleNumber: string;
    consentAccepted: boolean;
    source?: 'homepage' | 'city_page';
    city?: string;
  }) => api.post('/leads', data),
};

export default api;
