/** Entity types a US business can register as. */
export const US_ENTITY_TYPES = ['LLC', 'C_CORP', 'S_CORP', 'PARTNERSHIP'] as const;
export type TUsEntityType = (typeof US_ENTITY_TYPES)[number];

export const US_ENTITY_TYPE_LABELS: Record<TUsEntityType, string> = {
  LLC: 'LLC',
  C_CORP: 'C-Corporation',
  S_CORP: 'S-Corporation',
  PARTNERSHIP: 'Partnership',
};

/** EIN — two digits, hyphen, seven digits. Mirrors organization-service. */
export const EIN_PATTERN = /^\d{2}-\d{7}$/;

/** US ZIP — five digits, optional +4. */
export const US_POSTAL_CODE_PATTERN = /^\d{5}(-\d{4})?$/;

export const FIELD_MAX_LENGTH = {
  LEGAL_NAME: 120,
  STREET: 100,
  CITY: 60,
} as const;
