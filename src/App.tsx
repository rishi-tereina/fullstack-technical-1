import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { BusinessDetailsForm } from './pages/BusinessDetailsForm';

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <main className="app">
      <BusinessDetailsForm />
    </main>
  </QueryClientProvider>
);
