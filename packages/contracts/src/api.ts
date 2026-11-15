import { oc, type ContractRouterClient } from '@orpc/contract';
import { z } from 'zod';
import { healthResponseSchema } from './health.ts';

export const API_PREFIX = '/api/v1';

export const contract = {
  health: { check: oc.input(z.void()).output(healthResponseSchema) },
};

export type ApiClient = ContractRouterClient<typeof contract>;
