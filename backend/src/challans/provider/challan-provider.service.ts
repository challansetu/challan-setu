import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

export interface ProviderChallanResponse {
  code: number;
  message: string;
  result: ProviderChallan[] | null;
}

export interface ProviderChallan {
  challanNo: string | number;
  dlRcNumber: string;
  rcNo: string;
  State: string;
  dateChallan: string;
  detailsViolation: { offence: string; penalty: string | number | null }[];
  locationChallan: string;
  amountChallan: number;
  status: string;
  noReceipt: string | null;
  challan_search_source: string;
  court_status_desc: string;
  nameCourt: string;
  [key: string]: unknown;
}

const SCRAPER_TIMEOUT_MS = 30_000; // direct HTTP scraper, no browser

export class ScraperUnavailableError extends Error {
  constructor(
    message: string,
    readonly statusCode = 503,
  ) {
    super(message);
    this.name = 'ScraperUnavailableError';
  }
}

@Injectable()
export class ChallanProviderService {
  private readonly logger = new Logger(ChallanProviderService.name);
  private readonly scraperApiUrl: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.scraperApiUrl = this.configService.get<string>('SCRAPER_API_URL');

    if (this.scraperApiUrl) {
      this.logger.log(`Challan scraper API: ${this.scraperApiUrl}`);
    } else {
      this.logger.warn('SCRAPER_API_URL not set — challan data will be unavailable');
    }
  }

  async initiateEparivahan(
    vehicleNumber: string,
  ): Promise<{ otpRequired: false; challans: ProviderChallan[]; confirmed: boolean } | { otpRequired: true; sessionId: string; otpMessage: string }> {
    if (!this.scraperApiUrl) throw new Error('Scraper not configured');
    try {
      const resp = await axios.post<{
        success: boolean;
        otpRequired: boolean;
        sessionId?: string;
        otpMessage?: string;
        challans?: ProviderChallan[];
        confirmed?: boolean;
        error?: string;
      }>(`${this.scraperApiUrl}/eparivahan/initiate`, { vehicleNumber }, { timeout: 60_000 });
      if (!resp.data.success) throw new Error(resp.data.error || 'Initiation failed');
      if (resp.data.otpRequired) {
        return {
          otpRequired: true,
          sessionId: resp.data.sessionId!,
          otpMessage: resp.data.otpMessage ?? 'OTP sent to your registered mobile number.',
        };
      }
      return { otpRequired: false, challans: resp.data.challans ?? [], confirmed: resp.data.confirmed ?? false };
    } catch (e) {
      throw this._scraperError(e);
    }
  }

  async verifyEparivahanOtp(sessionId: string, otp: string): Promise<ProviderChallan[]> {
    if (!this.scraperApiUrl) throw new Error('Scraper not configured');
    try {
      const resp = await axios.post<{ success: boolean; challans: ProviderChallan[]; error?: string }>(
        `${this.scraperApiUrl}/eparivahan/verify`,
        { sessionId, otp },
        { timeout: 30_000 },
      );
      if (!resp.data.success) throw new Error(resp.data.error || 'OTP verification failed');
      return resp.data.challans ?? [];
    } catch (e) {
      throw this._scraperError(e);
    }
  }

  private _scraperError(e: unknown): Error {
    if (e instanceof AxiosError) {
      const status = e.response?.status;
      const detail = e.response?.data?.detail || e.response?.data?.message || e.message;
      this.logger.error(`Scraper error — status=${status} data=${JSON.stringify(e.response?.data)} msg=${e.message}`);
      if (!status || status >= 500) {
        return new ScraperUnavailableError(detail || `Scraper error (HTTP ${status ?? 'no response'})`);
      }
      return new Error(detail || `Scraper error (HTTP ${status})`);
    }
    const msg = e instanceof Error ? e.message : String(e);
    this.logger.error(`Scraper non-HTTP error: ${msg}`);
    return e instanceof Error ? e : new Error(msg);
  }

  async fetchChallans(vehicleNumber: string): Promise<ProviderChallanResponse> {
    if (!this.scraperApiUrl) {
      return { code: 200, message: 'No scraper configured', result: null };
    }

    try {
      this.logger.log(`Scraping challans for: ${vehicleNumber}`);

      const response = await axios.post<{
        success: boolean;
        challans: ProviderChallan[];
        error?: string;
      }>(
        `${this.scraperApiUrl}/search`,
        { vehicleNumber },
        { timeout: SCRAPER_TIMEOUT_MS },
      );

      const { challans } = response.data;
      this.logger.log(`Scraper returned ${challans?.length ?? 0} challan(s) for ${vehicleNumber}`);

      return {
        code: 200,
        message: challans?.length ? 'Data Found Successfully.' : 'No challans found.',
        result: challans?.length ? challans : null,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.warn(`Scraper API error: ${error.message}`);
      } else {
        this.logger.warn(`Scraper unexpected error: ${error}`);
      }
      return { code: 200, message: 'Scraper unavailable', result: null };
    }
  }
}
