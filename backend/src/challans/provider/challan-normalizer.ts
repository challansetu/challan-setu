import { Injectable } from '@nestjs/common';
import { ChallanStatus } from '@prisma/client';
import { ProviderChallan } from './challan-provider.service';

export interface NormalizedChallan {
  challanNo: string;
  vehicleNumber: string;
  rcNo: string | null;
  state: string | null;
  challanDate: Date | null;
  location: string | null;
  amount: number;
  status: ChallanStatus;
  receiptNo: string | null;
  challanSource: string | null;
  courtStatusDesc: string | null;
  courtName: string | null;
  offences: { offence: string; penalty: number | null }[];
  rawData: Record<string, unknown>;
}

@Injectable()
export class ChallanNormalizer {
  /**
   * Convert empty strings to null
   */
  private emptyToNull(value: string | null | undefined): string | null {
    if (value === null || value === undefined || value.trim() === '') {
      return null;
    }
    return value;
  }

  /**
   * Parse date string from provider into Date object
   */
  private parseDate(dateStr: string | null | undefined): Date | null {
    if (!dateStr || dateStr.trim() === '') return null;
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  /**
   * Normalize challan status string to internal enum
   */
  private normalizeStatus(status: string | null | undefined): ChallanStatus {
    if (!status) return ChallanStatus.UNKNOWN;

    const upper = status.toUpperCase().trim();
    switch (upper) {
      case 'PAID':
      case 'DISPOSED':
        return ChallanStatus.PAID;
      case 'UNPAID':
      case 'PENDING':
      case 'UNDISPOSED':
        return ChallanStatus.UNPAID;
      case 'PARTIAL':
      case 'PARTIALLY PAID':
        return ChallanStatus.PARTIAL;
      default:
        return ChallanStatus.UNKNOWN;
    }
  }

  /**
   * Parse penalty string/number to a float or null
   */
  private parsePenalty(penalty: string | number | null | undefined): number | null {
    if (penalty === null || penalty === undefined || penalty === '') return null;
    const num = typeof penalty === 'number' ? penalty : parseFloat(penalty);
    return isNaN(num) ? null : num;
  }

  /**
   * Parse amount from API response - ensure it's always a valid number
   */
  private parseAmount(amount: string | number | null | undefined): number {
    if (amount === null || amount === undefined || amount === '') return 0;
    const num = typeof amount === 'number' ? amount : parseFloat(String(amount));
    return isNaN(num) || num < 0 ? 0 : num;
  }

  /**
   * Normalize a single provider challan into internal schema
   */
  normalize(raw: ProviderChallan): NormalizedChallan {
    // Ensure amountChallan is properly parsed as a number
    const amount = this.parseAmount(raw.amountChallan);
    
    // Log for debugging if amount seems incorrect
    if (raw.amountChallan && amount !== Number(raw.amountChallan)) {
      console.warn(`Amount conversion issue: ${raw.amountChallan} -> ${amount} for challan ${raw.challanNo}`);
    }
    
    return {
      challanNo: String(raw.challanNo),
      vehicleNumber: raw.dlRcNumber || raw.rcNo || '',
      rcNo: this.emptyToNull(raw.rcNo),
      state: this.emptyToNull(raw.State),
      challanDate: this.parseDate(raw.dateChallan),
      location: this.emptyToNull(raw.locationChallan),
      amount: amount,
      status: this.normalizeStatus(raw.status),
      receiptNo: this.emptyToNull(raw.noReceipt),
      challanSource: this.emptyToNull(raw.challan_search_source),
      courtStatusDesc: this.emptyToNull(raw.court_status_desc),
      courtName: this.emptyToNull(raw.nameCourt),
      offences: (raw.detailsViolation || []).map((v) => ({
        offence: v.offence || 'Unknown violation',
        penalty: this.parsePenalty(v.penalty),
      })),
      rawData: raw as unknown as Record<string, unknown>,
    };
  }

  /**
   * Normalize an array of provider challans, skipping any with missing challanNo
   */
  normalizeAll(rawList: ProviderChallan[]): NormalizedChallan[] {
    return rawList
      .filter((r) => r.challanNo != null && String(r.challanNo).trim() !== '')
      .map((r) => this.normalize(r));
  }
}
