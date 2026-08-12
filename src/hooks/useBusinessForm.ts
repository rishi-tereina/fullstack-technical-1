import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { validationMessages } from '../messages/validationMessages';
import {
  buildZBusinessForm,
  emptyBusinessForm,
  type TBusinessFormInput,
  type TBusinessFormOutput,
} from '../schemas/businessForm';
import { submitBusinessDetails } from '../services/businessService';

/**
 * Owns the business-details form.
 *
 * The three layers stay separate: react-hook-form owns form state, zod owns the shape and the
 * rules, React Query owns the network call. `handleSubmit` wraps the mutation, so the mutation
 * only ever fires with validated values.
 */
export const useBusinessForm = () => {
  const schema = useMemo(() => buildZBusinessForm(validationMessages), []);

  const form = useForm<TBusinessFormInput, undefined, TBusinessFormOutput>({
    resolver: zodResolver(schema),
    defaultValues: emptyBusinessForm(),
    mode: 'onSubmit',
  });

  const submitMutation = useMutation({ mutationFn: submitBusinessDetails });

  const handleSave = form.handleSubmit((values) => {
    submitMutation.mutate(values);
  });

  return {
    form,
    errors: form.formState.errors,
    handleSave,
    isSubmitting: submitMutation.isPending,
    submittedId: submitMutation.data?.id,
    submitError: submitMutation.error,
  };
};
