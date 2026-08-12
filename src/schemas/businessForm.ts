import { z } from 'zod';

import { EIN_PATTERN, FIELD_MAX_LENGTH, US_ENTITY_TYPES } from '../constants/business';
import type { ValidationMessages } from '../messages/validationMessages';
import { buildZAddressForm } from './addressForm';
import { requiredWithFormat } from './fieldRules';

const isNotInFuture = (isoDate: string) => {
  const parsed = Date.parse(isoDate);
  return Number.isNaN(parsed) || parsed <= Date.now();
};

/**
 * Validation source of truth for the business-details step.
 *
 * Built by a factory that takes the translated messages, so the schema itself stays free of
 * user-facing copy. Consumers pass the result to `zodResolver`.
 */
export const buildZBusinessForm = (m: ValidationMessages) =>
  z.object({
    legalName: z
      .string()
      .trim()
      .min(1, m.legalNameRequired)
      .max(FIELD_MAX_LENGTH.LEGAL_NAME, m.legalNameTooLong),

    // '' models the unselected state in the *input* type, so the form needs no cast to
    // represent an empty dropdown. The transform narrows it to the enum at submit time.
    entityType: z
      .union([z.literal(''), z.enum(US_ENTITY_TYPES)])
      .transform((value, ctx) => {
        if (value === '') {
          ctx.addIssue({ code: 'custom', message: m.entityTypeRequired });
          return z.NEVER;
        }
        return value;
      }),

    taxId: requiredWithFormat(EIN_PATTERN, m.taxIdRequired, m.einFormat),

    incorporationDate: z
      .string()
      .min(1, m.incorporationDateRequired)
      .refine(isNotInFuture, m.incorporationDateFuture),

    address: buildZAddressForm(m),
  });

export type TBusinessFormInput = z.input<ReturnType<typeof buildZBusinessForm>>;
export type TBusinessFormOutput = z.output<ReturnType<typeof buildZBusinessForm>>;

export const emptyBusinessForm = (): TBusinessFormInput => ({
  legalName: '',
  entityType: '',
  taxId: '',
  incorporationDate: '',
  address: { street: '', city: '', stateProvince: '', postalCode: '' },
});
