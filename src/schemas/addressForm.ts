import { z } from 'zod';

import { FIELD_MAX_LENGTH, US_POSTAL_CODE_PATTERN } from '../constants/business';
import type { ValidationMessages } from '../messages/validationMessages';
import { requiredWithFormat } from './fieldRules';

/**
 * Shared address schema.
 *
 * Extracted from `businessForm.ts` so any other form that needs an address reuses the exact
 * same required-field and postal-code rules instead of re-deriving them — keeping the two
 * code paths from silently drifting.
 */
export const buildZAddressForm = (m: ValidationMessages) =>
  z.object({
    street: z.string().trim().min(1, m.addressStreetRequired).max(FIELD_MAX_LENGTH.STREET),
    city: z.string().trim().min(1, m.addressCityRequired).max(FIELD_MAX_LENGTH.CITY),
    stateProvince: z.string().trim().min(1, m.addressStateRequired),
    postalCode: requiredWithFormat(
      US_POSTAL_CODE_PATTERN,
      m.addressPostalCodeRequired,
      m.addressPostalCodeInvalid,
    ),
  });

export type TAddressFormInput = z.input<ReturnType<typeof buildZAddressForm>>;
export type TAddressFormOutput = z.output<ReturnType<typeof buildZAddressForm>>;
