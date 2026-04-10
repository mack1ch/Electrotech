import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTypecheckedEslintConfig } from '@electrotech/config-eslint/typechecked';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default createTypecheckedEslintConfig(rootDir);
