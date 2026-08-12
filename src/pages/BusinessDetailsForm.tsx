import { Field, SelectField, type SelectOption } from '../components/form';
import { US_ENTITY_TYPES, US_ENTITY_TYPE_LABELS, FIELD_MAX_LENGTH } from '../constants/business';
import { COUNTRY_NAMES } from '../constants/countries';
import { US_STATES } from '../constants/usStates';
import { useBusinessForm } from '../hooks/useBusinessForm';
import type { TBusinessFormInput } from '../schemas/businessForm';

const ENTITY_TYPE_OPTIONS: readonly SelectOption[] = US_ENTITY_TYPES.map((value) => ({
  value,
  label: US_ENTITY_TYPE_LABELS[value],
}));

const STATE_OPTIONS: readonly SelectOption[] = US_STATES.map(({ code, name }) => ({
  value: code,
  label: name,
}));

export const BusinessDetailsForm = () => {
  const { form, handleSave, isSubmitting, submittedId } = useBusinessForm();
  const control = form.control;

  return (
    <form className="form" onSubmit={handleSave} noValidate>
      <header className="form-header">
        <h1>Business details</h1>
        <p className="form-subtitle">Country of registration: {COUNTRY_NAMES.US}</p>
      </header>

      <section className="form-section">
        <h2>Business</h2>
        <Field<TBusinessFormInput>
          control={control}
          name="legalName"
          label="Legal business name"
          required
          maxLength={FIELD_MAX_LENGTH.LEGAL_NAME}
          placeholder="Acme Holdings, LLC"
        />
        <SelectField<TBusinessFormInput>
          control={control}
          name="entityType"
          label="Entity type"
          required
          options={ENTITY_TYPE_OPTIONS}
        />
        <Field<TBusinessFormInput>
          control={control}
          name="taxId"
          label="EIN"
          required
          placeholder="12-3456789"
        />
        <Field<TBusinessFormInput>
          control={control}
          name="incorporationDate"
          label="Date of incorporation"
          required
          type="date"
        />
      </section>

      <section className="form-section">
        <h2>Registered address</h2>
        <Field<TBusinessFormInput>
          control={control}
          name="address.street"
          label="Street address"
          required
          maxLength={FIELD_MAX_LENGTH.STREET}
        />
        <Field<TBusinessFormInput>
          control={control}
          name="address.city"
          label="City"
          required
          maxLength={FIELD_MAX_LENGTH.CITY}
        />
        <SelectField<TBusinessFormInput>
          control={control}
          name="address.stateProvince"
          label="State"
          required
          options={STATE_OPTIONS}
        />
        <Field<TBusinessFormInput>
          control={control}
          name="address.postalCode"
          label="ZIP code"
          required
          placeholder="94105"
        />
      </section>

      <footer className="form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </button>
        {submittedId && (
          <span className="form-success" role="status">
            Submitted — reference {submittedId}
          </span>
        )}
      </footer>
    </form>
  );
};
