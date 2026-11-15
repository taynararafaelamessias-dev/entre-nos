import { contract } from '@entre-nos/contracts';
import { implement } from '@orpc/server';
import { checkHealth, type PingDatabase } from '../modules/health/check-health.ts';

const os = implement(contract);

export function createRouter(deps: { pingDatabase: PingDatabase }) {
  return os.router({
    health: { check: os.health.check.handler(() => checkHealth(deps.pingDatabase)) },
  });
}
