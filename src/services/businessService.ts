import type { TBusinessFormOutput } from '../schemas/businessForm';

export interface SubmitBusinessResponse {
  id: string;
  submittedAt: string;
}

/** Stand-in for the BFF call. Resolves after a short delay so submitting feels real. */
export const submitBusinessDetails = async (
  payload: TBusinessFormOutput,
): Promise<SubmitBusinessResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  // eslint-disable-next-line no-console
  console.info('[mock BFF] POST /api/v1/ux/onboarding/business-details', payload);
  return { id: 'bus_01HZY', submittedAt: new Date().toISOString() };
};
