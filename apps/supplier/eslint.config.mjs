import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createNextEslintConfig } from '@electrotech/config-eslint/next';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default createNextEslintConfig(rootDir);
