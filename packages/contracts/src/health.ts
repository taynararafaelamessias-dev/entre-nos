import { z } from 'zod';

export const healthResponseSchema = z.object({
  status: z.enum(['ok', 'error']),
  postgres: z.object({
    status: z.enum(['up', 'down']),
    latencyMs: z.number().nonnegative().optional(),
  }),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
