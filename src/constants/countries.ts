/**
 * The jurisdictions this form supports today.
 *
 * `as const` keeps the literal strings in the type, so `TCountry` is derived from
 * this list rather than written out separately — the two cannot drift apart.
 */
export const COUNTRIES = ['US'] as const;
export type TCountry = (typeof COUNTRIES)[number];

export const COUNTRY_NAMES: Record<TCountry, string> = {
  US: 'United States',
};
