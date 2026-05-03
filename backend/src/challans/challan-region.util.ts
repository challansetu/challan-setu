import { Logger } from '@nestjs/common';
import {
  SUPPORTED_REGION_CONFIG,
  SupportedRegionName,
} from '../common/constants';

const logger = new Logger('ChallanRegion');

export interface RegionResult {
  isSupported: boolean;
  supportedRegion: SupportedRegionName | null;
  unsupportedReason: string | null;
  /** Which field + value triggered the decision (for debugging/logging) */
  matchedBy: string | null;
}

interface ChallanFields {
  state?: string | null;
  location?: string | null;
  courtName?: string | null;
  rawData?: Record<string, unknown> | null;
  /** challanNo used only for logging */
  challanNo?: string;
}

function includesKeyword(value: string | null | undefined, keywords: string[]): boolean {
  if (!value || keywords.length === 0) return false;
  const lower = value.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

/**
 * Classify a single challan into a supported/unsupported region.
 *
 * Priority order:
 *   1. state
 *   2. nameRTO (from rawData)
 *   3. location
 *   4. courtName
 *
 * Within each region config, block keywords are checked first across all fields,
 * then support keywords are checked in priority order.
 */
export function classifyRegion(challan: ChallanFields): RegionResult {
  const state = (challan.state ?? '').toUpperCase().trim();
  const nameRTO =
    typeof challan.rawData?.nameRTO === 'string' ? challan.rawData.nameRTO : null;
  const location = challan.location ?? null;
  const courtName = challan.courtName ?? null;

  // Fields to check in priority order (name, value)
  const orderedFields: [string, string | null][] = [
    ['nameRTO', nameRTO],
    ['location', location],
    ['courtName', courtName],
  ];

  // Saved result from a state-matched-but-no-subregion case; used as fallback
  // after all region configs are tried (supports multiple regions per state, e.g. UP → Noida & Ghaziabad).
  let noSubRegionResult: RegionResult | null = null;

  for (const region of SUPPORTED_REGION_CONFIG) {
    if (!region.states.includes(state)) continue;

    // State matched this region's states list.

    if (!region.requireSubRegionMatch) {
      // All challans from this state are supported (e.g. Delhi = all DL)
      const result: RegionResult = {
        isSupported: true,
        supportedRegion: region.name,
        unsupportedReason: null,
        matchedBy: `state:${state}`,
      };
      logger.debug(
        `[REGION] ${challan.challanNo ?? 'unknown'} → ${region.name} (${result.matchedBy})`,
      );
      return result;
    }

    // Determine which block keyword list applies to each field.
    // location uses the narrower locationBlockKeywords (if defined) to avoid false positives
    // from road names like "Noida-Greater Noida Expy" matching "greater noida".
    const fieldBlockKeywords = (fieldName: string): string[] => {
      if (fieldName === 'location') return region.locationBlockKeywords ?? region.blockKeywords;
      return region.blockKeywords;
    };

    // Check block keywords across ALL fields before checking support.
    // A block here means "not this region" — continue to try the next region config
    // (e.g. a Ghaziabad challan is blocked by Noida's config, then matched by Ghaziabad's config).
    let blockedByField: string | null = null;
    for (const [fieldName, fieldValue] of orderedFields) {
      if (includesKeyword(fieldValue, fieldBlockKeywords(fieldName))) {
        blockedByField = fieldName;
        logger.debug(
          `[REGION] ${challan.challanNo ?? 'unknown'} → blocked by ${region.name} via ${fieldName}="${fieldValue}" (trying next region)`,
        );
        break;
      }
    }
    if (blockedByField !== null) continue;

    // Check support keywords in priority order
    const supportChecks: [string, string | null, string[]][] = [
      ['nameRTO', nameRTO, region.rtoKeywords],
      ['location', location, region.locationKeywords],
      ['courtName', courtName, region.courtKeywords],
    ];

    for (const [fieldName, fieldValue, keywords] of supportChecks) {
      if (keywords.length > 0 && includesKeyword(fieldValue, keywords)) {
        const result: RegionResult = {
          isSupported: true,
          supportedRegion: region.name,
          unsupportedReason: null,
          matchedBy: `${fieldName}:${fieldValue}`,
        };
        logger.debug(
          `[REGION] ${challan.challanNo ?? 'unknown'} → ${region.name} via ${fieldName}="${fieldValue}"`,
        );
        return result;
      }
    }

    // State matched but no sub-region keyword matched — save and continue trying other regions.
    noSubRegionResult = {
      isSupported: false,
      supportedRegion: null,
      unsupportedReason: `Not serviceable: ${state} area "${nameRTO ?? location ?? 'unknown'}" is not in our service area (Delhi, Gurgaon, Noida, Ghaziabad only)`,
      matchedBy: `state:${state}:no-subregion-match`,
    };
    logger.debug(
      `[REGION] ${challan.challanNo ?? 'unknown'} → no subregion match for ${region.name} (state=${state}, nameRTO=${nameRTO}, location=${location}), trying next region`,
    );
  }

  // Return saved "state matched but no subregion" result if we got one,
  // otherwise the state itself is not in any config.
  if (noSubRegionResult) {
    return noSubRegionResult;
  }

  const result: RegionResult = {
    isSupported: false,
    supportedRegion: null,
    unsupportedReason: `Not serviceable: state "${state || 'unknown'}" is not in our service area`,
    matchedBy: state ? `state:${state}:unsupported` : 'state:missing',
  };
  logger.debug(
    `[REGION] ${challan.challanNo ?? 'unknown'} → UNSUPPORTED (state="${state}" not in any config)`,
  );
  return result;
}

/**
 * Enrich a challan object with region classification fields.
 */
export function enrichWithRegion<T extends ChallanFields>(challan: T): T & RegionResult {
  return { ...challan, ...classifyRegion(challan) };
}

/**
 * Filter to only challans that are in a supported service area.
 */
export function getSupportedChallans<T extends ChallanFields>(challans: T[]): T[] {
  return challans.filter((c) => classifyRegion(c).isSupported);
}

/**
 * Filter to only challans outside the service area.
 */
export function getUnsupportedChallans<T extends ChallanFields>(challans: T[]): T[] {
  return challans.filter((c) => !classifyRegion(c).isSupported);
}
