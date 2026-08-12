import { describe, expect, it } from 'vitest';

import { validationMessages as m } from '../messages/validationMessages';
import { buildZBusinessForm, emptyBusinessForm } from './businessForm';

const schema = buildZBusinessForm(m);

const validForm = () => ({
  legalName: 'Acme Holdings, LLC',
  entityType: 'LLC' as const,
  taxId: '12-3456789',
  incorporationDate: '2019-04-01',
  address: { street: '1 Market St', city: 'San Francisco', stateProvince: 'CA', postalCode: '94105' },
});

/** Collects the messages zod reported for a given dotted field path. */
const messagesFor = (result: ReturnType<typeof schema.safeParse>, path: string) =>
  result.success ? [] : result.error.issues.filter((i) => i.path.join('.') === path).map((i) => i.message);

describe('buildZBusinessForm', () => {
  it('accepts a complete, valid US business', () => {
    const result = schema.safeParse(validForm());
    expect(result.success).toBe(true);
  });

  it('reports every required field on an empty form', () => {
    const result = schema.safeParse(emptyBusinessForm());
    expect(result.success).toBe(false);

    expect(messagesFor(result, 'legalName')).toContain(m.legalNameRequired);
    expect(messagesFor(result, 'entityType')).toContain(m.entityTypeRequired);
    expect(messagesFor(result, 'taxId')).toContain(m.taxIdRequired);
    expect(messagesFor(result, 'incorporationDate')).toContain(m.incorporationDateRequired);
    expect(messagesFor(result, 'address.street')).toContain(m.addressStreetRequired);
    expect(messagesFor(result, 'address.city')).toContain(m.addressCityRequired);
    expect(messagesFor(result, 'address.stateProvince')).toContain(m.addressStateRequired);
    expect(messagesFor(result, 'address.postalCode')).toContain(m.addressPostalCodeRequired);
  });

  it.each([
    ['123456789', 'no hyphen'],
    ['1-23456789', 'wrong grouping'],
    ['12-345678', 'too short'],
    ['ab-cdefghi', 'not digits'],
  ])('rejects EIN %s (%s)', (taxId) => {
    const result = schema.safeParse({ ...validForm(), taxId });
    expect(messagesFor(result, 'taxId')).toContain(m.einFormat);
  });

  it('rejects a ZIP code that is not five digits', () => {
    const result = schema.safeParse({
      ...validForm(),
      address: { ...validForm().address, postalCode: '9410' },
    });
    expect(messagesFor(result, 'address.postalCode')).toContain(m.addressPostalCodeInvalid);
  });

  it('accepts a ZIP+4', () => {
    const result = schema.safeParse({
      ...validForm(),
      address: { ...validForm().address, postalCode: '94105-1234' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects an incorporation date in the future', () => {
    const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const result = schema.safeParse({ ...validForm(), incorporationDate: nextYear });
    expect(messagesFor(result, 'incorporationDate')).toContain(m.incorporationDateFuture);
  });

  it('trims whitespace off the legal name', () => {
    const result = schema.safeParse({ ...validForm(), legalName: '  Acme Holdings, LLC  ' });
    expect(result.success && result.data.legalName).toBe('Acme Holdings, LLC');
  });

  it('narrows the entity type from the unselected empty string on output', () => {
    const result = schema.safeParse(validForm());
    expect(result.success && result.data.entityType).toBe('LLC');
  });
});

describe('one message per field', () => {
  it('reports exactly one message per field on an empty form', () => {
    const result = schema.safeParse(emptyBusinessForm());
    expect(result.success).toBe(false);
    if (result.success) return;

    const countsByPath = new Map<string, number>();
    for (const issue of result.error.issues) {
      const path = issue.path.join('.');
      countsByPath.set(path, (countsByPath.get(path) ?? 0) + 1);
    }

    // Zod runs every check in a chain, so `.min(1).regex(...)` would report two messages for an
    // empty value. `requiredWithFormat` sequences them so only the first applicable one fires.
    const duplicated = [...countsByPath.entries()].filter(([, count]) => count > 1);
    expect(duplicated).toEqual([]);
  });
});
