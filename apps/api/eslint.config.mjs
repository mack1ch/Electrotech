import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createNestEslintConfig } from '@electrotech/config-eslint/nestjs';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default createNestEslintConfig(rootDir);
