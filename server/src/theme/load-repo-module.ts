import { existsSync } from 'fs';
import { createRequire } from 'module';
import { join } from 'path';

export const REPO_ROOT = join(__dirname, '../../..');
const requireFromRepo = createRequire(join(REPO_ROOT, 'package.json'));

/** Load repo-root modules (theme/, verticals/) from server without rootDir imports. */
export function loadRepoModule<T>(basePath: string): T {
  const tsPath = join(REPO_ROOT, `${basePath}.ts`);
  const specifier = existsSync(tsPath) ? `./${basePath}.ts` : `./${basePath}`;
  return requireFromRepo(specifier) as T;
}
