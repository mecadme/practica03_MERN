import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultApiBaseUrl = 'http://localhost:3000/api/v1';
const rawApiBaseUrl = (
  process.env.API_BASE_URL ??
  process.env.API_URL ??
  process.env.NG_APP_API_BASE_URL ??
  defaultApiBaseUrl
).replace(/\/+$/, '');
const apiBaseUrl = rawApiBaseUrl.replace(/\/employees$/i, '');

const currentDir = dirname(fileURLToPath(import.meta.url));
const environmentPath = join(currentDir, '..', 'src', 'environments', 'environment.ts');

mkdirSync(dirname(environmentPath), { recursive: true });
writeFileSync(
  environmentPath,
  `export const environment = {
  apiBaseUrl: ${JSON.stringify(apiBaseUrl)}
} as const;
`
);
