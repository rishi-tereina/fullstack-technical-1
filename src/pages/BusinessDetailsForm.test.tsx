import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { validationMessages as m } from '../messages/validationMessages';
import { BusinessDetailsForm } from './BusinessDetailsForm';

const renderForm = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <BusinessDetailsForm />
    </QueryClientProvider>,
  );
};

describe('BusinessDetailsForm', () => {
  it('renders the US field set', () => {
    renderForm();

    expect(screen.getByLabelText(/Legal business name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Entity type/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^EIN/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^State/)).toBeInTheDocument();
    expect(screen.getByLabelText(/ZIP code/)).toBeInTheDocument();
  });

  it('blocks submission and surfaces messages when the form is empty', async () => {
    renderForm();

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText(m.legalNameRequired)).toBeInTheDocument();
    expect(screen.getByText(m.taxIdRequired)).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('submits a completed form', async () => {
    renderForm();

    await userEvent.type(screen.getByLabelText(/Legal business name/), 'Acme Holdings, LLC');
    await userEvent.selectOptions(screen.getByLabelText(/Entity type/), 'LLC');
    await userEvent.type(screen.getByLabelText(/^EIN/), '12-3456789');
    await userEvent.type(screen.getByLabelText(/Date of incorporation/), '2019-04-01');
    await userEvent.type(screen.getByLabelText(/Street address/), '1 Market St');
    await userEvent.type(screen.getByLabelText(/^City/), 'San Francisco');
    await userEvent.selectOptions(screen.getByLabelText(/^State/), 'CA');
    await userEvent.type(screen.getByLabelText(/ZIP code/), '94105');

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByRole('status')).toHaveTextContent(/Submitted/);
  });
});
