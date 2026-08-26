import { existsSync, readFileSync } from 'node:fs';

const quote = String.fromCharCode(34);
const apostrophe = String.fromCharCode(39);

const readValue = (value) => {
  const trimmed = value.trim();
  const isQuoted = (trimmed.startsWith(quote) && trimmed.endsWith(quote))
    || (trimmed.startsWith(apostrophe) && trimmed.endsWith(apostrophe));
  return isQuoted ? trimmed.slice(1, -1) : trimmed;
};

const loadEnvFile = (envFile) => {
  if (!existsSync(envFile)) return;

  const lines = readFileSync(envFile, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key] === undefined) process.env[key] = readValue(rawValue);
  }
};

// Server settings take precedence over root Vite settings and shell variables.
loadEnvFile(new URL('../.env', import.meta.url));
loadEnvFile(new URL('../../.env', import.meta.url));
