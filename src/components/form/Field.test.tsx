import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Field } from './Field';

const ZTestForm = z.object({ name: z.string().min(1, 'Name is required') });
type TTestForm = z.infer<typeof ZTestForm>;

const Harness = ({ onSubmit = vi.fn() }: { onSubmit?: (values: TTestForm) => void }) => {
  const { control, handleSubmit } = useForm<TTestForm>({
    resolver: zodResolver(ZTestForm),
    defaultValues: { name: '' },
    mode: 'onSubmit',
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field<TTestForm> control={control} name="name" label="Name" required />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('Field', () => {
  it('binds typed input back to the form value', async () => {
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/Name/), 'Acme');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Acme' }), expect.anything());
  });

  it('renders the validation message and marks the input invalid', async () => {
    render(<Harness />);

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Name is required');
    expect(screen.getByLabelText(/Name/)).toHaveAttribute('aria-invalid', 'true');
  });
});
