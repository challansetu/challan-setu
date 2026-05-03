// ─── Locale & Currency ──────────────────────────────
export const LOCALE = 'en-IN';

// ─── Timing (ms unless noted) ───────────────────────
export const SOCIAL_PROOF_CYCLE_MS = 4500;
export const SOCIAL_PROOF_TRANSITION_MS = 400;

// ─── Validation ─────────────────────────────────────
export const VEHICLE_NUMBER_REGEX = /^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{1,4}$/;
export const VEHICLE_NUMBER_MIN_LENGTH = 4;
export const VEHICLE_NUMBER_MAX_LENGTH = 15;
export const VEHICLE_NUMBER_EXAMPLES = 'DL7SBY5194, UP16DZ3281';
export const PHONE_REGEX = /^[6-9]\d{9}$/;
export const PHONE_MAX_DIGITS = 10;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;

// ─── Social Proof Ticker ────────────────────────────
export const SOCIAL_PROOF_MIN_MINUTES = 2;
export const SOCIAL_PROOF_MAX_MINUTES_RANGE = 28;
