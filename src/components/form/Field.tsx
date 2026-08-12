import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import styles from './formPrimitives';

interface FieldProps<TFormValues extends FieldValues> {
  name: FieldPath<TFormValues>;
  control: Control<TFormValues>;
  label: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  type?: 'text' | 'date';
}

/**
 * Binds a text input to react-hook-form.
 *
 * The consumer passes `name` + `control` and nothing else — the wrapper owns the
 * `useController` binding, the error rendering, and the accessibility wiring, so no call site
 * ever reaches for `useController`, `<Controller>`, `register`, or `setValue` directly.
 *
 * (In tereina-portal the equivalent wrappers are the `Rhf*` components, which additionally
 * translate SAP UI5 custom events. This exercise uses native inputs to keep UI5 out of scope.)
 */
export const Field = <TFormValues extends FieldValues>({
  name,
  control,
  label,
  required,
  placeholder,
  maxLength,
  type = 'text',
}: FieldProps<TFormValues>) => {
  const { field, fieldState } = useController({ name, control });
  const errorMessage = fieldState.error?.message;
  const id = `field-${name}`;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        className={errorMessage ? styles.inputInvalid : styles.input}
        placeholder={placeholder}
        maxLength={maxLength}
        value={field.value ?? ''}
        onChange={(event) => field.onChange(event.target.value)}
        onBlur={field.onBlur}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? `${id}-error` : undefined}
      />
      {errorMessage && (
        <span className={styles.error} id={`${id}-error`} role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
