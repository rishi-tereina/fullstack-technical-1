import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import styles from './formPrimitives';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps<TFormValues extends FieldValues> {
  name: FieldPath<TFormValues>;
  control: Control<TFormValues>;
  label: string;
  options: readonly SelectOption[];
  required?: boolean;
  placeholder?: string;
}

/** Select counterpart to {@link Field}. `''` is the unselected state. */
export const SelectField = <TFormValues extends FieldValues>({
  name,
  control,
  label,
  options,
  required,
  placeholder = 'Select…',
}: SelectFieldProps<TFormValues>) => {
  const { field, fieldState } = useController({ name, control });
  const errorMessage = fieldState.error?.message;
  const id = `field-${name}`;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <select
        id={id}
        className={errorMessage ? styles.inputInvalid : styles.input}
        value={field.value ?? ''}
        onChange={(event) => field.onChange(event.target.value)}
        onBlur={field.onBlur}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? `${id}-error` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorMessage && (
        <span className={styles.error} id={`${id}-error`} role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
