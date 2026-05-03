import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { PROVIDER_API_TIMEOUT_MS } from '../../common/constants';

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
  // Additional fields from real API
  forChallan?: string | null;
  typeAccused?: string | null;
  nameViolator?: string | null;
  violatorFatherName?: string | null;
  violatorContactNo?: string | null;
  investigateUnder?: string | null;
  longLat?: string | null;
  remarkChallan?: string | null;
  typeBook?: string | null;
  bookNo?: string | null;
  formNo?: string | null;
  imagesChallan?: string | null;
  imageVehicle?: string | null;
  imageCCTV1?: string | null;
  imageCCTV2?: string | null;
  numberDL?: string | null;
  detailsDL?: string | null;
  sourcePayment?: string | null;
  datePayment?: string | null;
  IDTransaction?: string | null;
  noReceiptOffline?: string | null;
  nameRTO?: string | null;
  impoundDocument?: string | null;
  impoundVehicle?: string | null;
  classVehicle?: string | null;
  typeVehicle?: string | null;
  nameOwner?: string | null;
  addressOwner?: string | null;
  statusCourt?: string | null;
  chargesUser?: string | number | null;
  [key: string]: unknown; // allow any additional fields
}

@Injectable()
export class ChallanProviderService {
  private readonly logger = new Logger(ChallanProviderService.name);
  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly secretKey: string;
  private readonly useMock: boolean;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.getOrThrow<string>('CHALLAN_PROVIDER_BASE_URL');
    this.clientId = this.configService.getOrThrow<string>('CHALLAN_PROVIDER_CLIENT_ID');
    this.secretKey = this.configService.getOrThrow<string>('CHALLAN_PROVIDER_SECRET_KEY');

    // Use mock data if credentials are placeholders or in dev mode
    this.useMock =
      process.env.NODE_ENV !== 'production' &&
      (this.clientId === 'your_client_id' || this.secretKey === 'your_secret_key');

    if (this.useMock) {
      this.logger.warn(
        'Challan provider running in MOCK mode - configure real credentials in .env for production',
      );
    } else {
      this.logger.log('Challan provider configured with LIVE credentials');
    }
  }

  /** Vehicle numbers that always return mock data regardless of credentials. */
  static readonly MOCK_VEHICLES = new Set(['DL01CA1234']);

  async fetchChallans(vehicleNumber: string): Promise<ProviderChallanResponse> {
    if (this.useMock || ChallanProviderService.MOCK_VEHICLES.has(vehicleNumber.toUpperCase())) {
      return this.getMockResponse(vehicleNumber);
    }

    try {
      this.logger.log(`Fetching challans for vehicle: ${vehicleNumber}`);

      const response = await axios.post<ProviderChallanResponse>(
        `${this.baseUrl}/invincible/vehicle-challan-detailed`,
        { vehicleNumber },
        {
          headers: {
            'Content-Type': 'application/json',
            clientId: this.clientId,
            secretKey: this.secretKey,
          },
          timeout: PROVIDER_API_TIMEOUT_MS,
        },
      );

      this.logger.log(
        `Provider response: code=${response.data.code}, results=${response.data.result?.length ?? 0}`,
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(
          `Provider API error: ${error.response?.status} - ${error.message}`,
          error.response?.data,
        );
        throw new HttpException(
          'Challan provider service unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw error;
    }
  }

  /**
   * Generate realistic mock challan data for development/testing
   */
  private getMockResponse(vehicleNumber: string): ProviderChallanResponse {
    this.logger.log(`[MOCK] Returning sample challans for ${vehicleNumber}`);

    const vn = vehicleNumber.toUpperCase();
    const stateCode = vn.substring(0, 2);

    if (vn === 'TL1STE1234') {
      return {
        code: 200,
        message: 'Data Found Successfully.',
        result: [
          {
            challanNo: `DL999004250126100000`,
            dlRcNumber: vn,
            rcNo: vn,
            State: 'DL',
            dateChallan: '2024-11-10 00:00:00',
            detailsViolation: [
              {
                offence: 'Test dummy order',
                penalty: '10',
              },
            ],
            locationChallan: 'Delhi Dummy Bypass',
            amountChallan: 10,
            status: 'Unpaid',
            noReceipt: '',
            challan_search_source: 'ECHALLAN',
            court_status_desc: 'VIRTUAL COURT',
            nameCourt: '',
          },
        ],
      };
    }

    return {
      code: 200,
      message: 'Data Found Successfully.',
      result: [
        {
          challanNo: `${stateCode}466004250126103835`,
          dlRcNumber: vn,
          rcNo: vn,
          State: stateCode,
          dateChallan: '2024-11-10 00:00:00',
          detailsViolation: [
            {
              offence:
                'Driving a motor vehicle without wearing a seat belt - S/177 MVA',
              penalty: '1000',
            },
          ],
          locationChallan: 'KM 232-700(RHS)',
          amountChallan: 2000,
          status: 'Unpaid',
          noReceipt: '',
          challan_search_source: 'ECHALLAN',
          court_status_desc: 'VIRTUAL COURT',
          nameCourt: '',
        },
        {
          challanNo: `${stateCode}466004250226204912`,
          dlRcNumber: vn,
          rcNo: vn,
          State: stateCode,
          dateChallan: '2024-08-22 00:00:00',
          detailsViolation: [
            {
              offence: 'Using mobile phone while driving - S/184 MVA',
              penalty: '5000',
            },
            {
              offence: 'Driving without valid insurance - S/196 MVA',
              penalty: null,
            },
          ],
          locationChallan: 'NH-48, Sector 15',
          amountChallan: 5000,
          status: 'Unpaid',
          noReceipt: '',
          challan_search_source: 'ECHALLAN',
          court_status_desc: 'TRAFFIC POLICE',
          nameCourt: 'District Court',
        },
        {
          challanNo: `${stateCode}466004250426406234`,
          dlRcNumber: vn,
          rcNo: vn,
          State: stateCode,
          dateChallan: '2024-03-15 00:00:00',
          detailsViolation: [
            {
              offence: 'Jumping red traffic signal - S/119/177 MVA',
              penalty: '1000',
            },
          ],
          locationChallan: 'Rajiv Chowk, CP',
          amountChallan: 1000,
          status: 'Paid',
          noReceipt: `${stateCode}RTE25040000426`,
          challan_search_source: 'ECHALLAN',
          court_status_desc: 'VIRTUAL COURT',
          nameCourt: '',
        },
      ],
    };
  }
}
