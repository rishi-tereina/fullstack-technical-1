/**
 * User-facing validation strings.
 *
 * In tereina-portal these come from `useI18n(namespace)`; here they're a flat map so the
 * exercise stays dependency-free. The important property is the same either way: the schema
 * is a *factory* that takes already-translated strings, so validation copy never gets
 * hardcoded inside the schema.
 */
export interface ValidationMessages {
  legalNameRequired: string;
  legalNameTooLong: string;
  entityTypeRequired: string;
  taxIdRequired: string;
  einFormat: string;
  incorporationDateRequired: string;
  incorporationDateFuture: string;

  addressStreetRequired: string;
  addressCityRequired: string;
  addressStateRequired: string;
  addressPostalCodeRequired: string;
  addressPostalCodeInvalid: string;
}

export const validationMessages: ValidationMessages = {
  legalNameRequired: 'Legal business name is required',
  legalNameTooLong: 'Legal business name is too long',
  entityTypeRequired: 'Select an entity type',
  taxIdRequired: 'EIN is required',
  einFormat: 'Enter an EIN as 9 digits, e.g. 12-3456789',
  incorporationDateRequired: 'Date of incorporation is required',
  incorporationDateFuture: 'Date of incorporation cannot be in the future',

  addressStreetRequired: 'Street address is required',
  addressCityRequired: 'City is required',
  addressStateRequired: 'State is required',
  addressPostalCodeRequired: 'ZIP code is required',
  addressPostalCodeInvalid: 'Enter a valid 5-digit ZIP code',
};
