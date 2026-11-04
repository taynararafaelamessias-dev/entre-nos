import { healthResponseSchema, type HealthResponse } from '@entre-nos/contracts';
import { useQuery } from '@tanstack/react-query';

export function useHealth() {
  return useQuery<HealthResponse>({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await fetch('/health');
      return healthResponseSchema.parse(await res.json());
    },
  });
}
