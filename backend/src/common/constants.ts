// ─── Server Defaults ────────────────────────────────
export const DEFAULT_PORT = 4000;

// ─── Auth ───────────────────────────────────────────
export const DEFAULT_OTP_LENGTH = 6;
export const DEFAULT_OTP_EXPIRY_SECONDS = 300;
export const DEV_OTP = '123456';

// ─── Throttling ─────────────────────────────────────
export const DEFAULT_THROTTLE_TTL_SECONDS = 60;
export const DEFAULT_THROTTLE_LIMIT = 10;

// ─── Redis ──────────────────────────────────────────
export const DEFAULT_REDIS_HOST = 'localhost';
export const DEFAULT_REDIS_PORT = 6379;

// ─── Cache ──────────────────────────────────────────
// 3 days: challans rarely change; safe to serve data up to 3 days old
export const CHALLAN_CACHE_TTL_FOUND_SECONDS = 3 * 24 * 60 * 60;
// 6 hours: "no challan" may change sooner (new challan issued), recheck more often
export const CHALLAN_CACHE_TTL_NOT_FOUND_SECONDS = 6 * 60 * 60;
// Legacy — kept for reference, not used for challan search anymore
export const CHALLAN_CACHE_TTL_SECONDS = 300;

// ─── API ────────────────────────────────────────────
export const PROVIDER_API_TIMEOUT_MS = 30000;

// ─── CORS ───────────────────────────────────────────
export const DEV_CORS_ORIGINS = ['http://localhost:3000', 'http://localhost:3001'];
export const PROD_CORS_ORIGINS = ['https://challansetu.com', 'https://www.challansetu.com'];

// ─── Business Rules ─────────────────────────────────
export const DISCOUNT_PERCENTAGE = 40;
export const DISCOUNT_RULE_NAME = 'Launch Offer';
export const DISCOUNT_RULE_DESCRIPTION = 'Platform-funded 40% discount on all challan payments';
export const DISCOUNT_VALIDITY_MS = 365 * 24 * 60 * 60 * 1000; // 1 year

// ─── Seed Data ──────────────────────────────────────
export const SEED_ADMIN_PHONE = '9999999999';
export const SEED_ADMIN_NAME = 'Admin User';
export const SEED_ADMIN_EMAIL = 'admin@challan.app';
export const SEED_TEST_USER_PHONE = '8287650767';
export const SEED_TEST_USER_NAME = 'Test User';
export const SEED_TEST_USER_EMAIL = 'test@example.com';
export const SEED_TEST_VEHICLE = 'DL01CA1234';
export const SEED_TEST_VEHICLE_NICKNAME = 'Test Car (Delhi)';

// ─── Service Area ────────────────────────────────────
export type SupportedRegionName = 'Delhi' | 'Gurgaon' | 'Noida' | 'Ghaziabad';

export interface RegionConfig {
  name: SupportedRegionName;
  /** ISO state codes that apply to this region */
  states: string[];
  /** Keywords matched against nameRTO field in rawData */
  rtoKeywords: string[];
  /** Keywords matched against location field */
  locationKeywords: string[];
  /** Keywords matched against courtName field */
  courtKeywords: string[];
  /**
   * Keywords applied to nameRTO and courtName for blocking.
   * Evaluated before support keywords — block wins.
   */
  blockKeywords: string[];
  /**
   * Keywords applied ONLY to the location field for blocking.
   * Defaults to blockKeywords when not specified.
   * Use a narrower set here to avoid false positives from road names
   * (e.g. "Noida-Greater Noida Expy" is a road name, not the city Greater Noida).
   */
  locationBlockKeywords?: string[];
  /**
   * If true, state match alone is not enough — rto/location/court must also match.
   * If false, any challan from these states is supported (e.g. Delhi).
   */
  requireSubRegionMatch: boolean;
}

export const SUPPORTED_REGION_CONFIG: RegionConfig[] = [
  {
    name: 'Delhi',
    states: ['DL'],
    rtoKeywords: [],
    locationKeywords: [],
    courtKeywords: [],
    blockKeywords: [],
    requireSubRegionMatch: false, // All DL challans are supported
  },
  {
    name: 'Gurgaon',
    states: ['HR'],
    rtoKeywords: ['gurgaon', 'gurugram'],
    locationKeywords: ['gurgaon', 'gurugram'],
    courtKeywords: ['ggn'],
    // All other Haryana RTOs are blocked
    blockKeywords: ['faridabad', 'fbr', 'rewari', 'bhiwani', 'rohtak', 'sonipat', 'panipat', 'karnal', 'ambala', 'hisar', 'jhajjar', 'nuh', 'palwal', 'mahendragarh'],
    requireSubRegionMatch: true,
  },
  {
    name: 'Noida',
    states: ['UP'],
    rtoKeywords: ['noida'],
    locationKeywords: ['noida'],
    courtKeywords: [],
    // GBN = Gautam Buddha Nagar court (Greater Noida) = not supported
    // Ghaziabad keywords here ensure a Ghaziabad challan is NOT classified as Noida;
    // the algorithm will then continue and match the Ghaziabad config below.
    blockKeywords: ['ghaziabad', 'gzb', 'gbn', 'greater noida'],
    // Location can contain "Noida-Greater Noida Expy" (a road name) — only block on city names
    locationBlockKeywords: ['ghaziabad', 'gzb'],
    requireSubRegionMatch: true,
  },
  {
    name: 'Ghaziabad',
    states: ['UP'],
    // nameRTO values seen: "GZB", "Ghaziabad"
    rtoKeywords: ['ghaziabad', 'gzb'],
    // location values seen: "Ghaziabad"
    locationKeywords: ['ghaziabad'],
    // court names seen: "Ghaziabad"
    courtKeywords: ['ghaziabad'],
    blockKeywords: [],
    requireSubRegionMatch: true,
  },
];

// ─── Swagger ────────────────────────────────────────
export const SWAGGER_TITLE = 'Challan API';
export const SWAGGER_DESCRIPTION = 'Vehicle Challan Discovery & Payment API';
export const SWAGGER_VERSION = '1.0';
