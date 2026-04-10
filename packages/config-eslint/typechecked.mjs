import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * @param {string} tsconfigRootDir Absolute path to the package root (where tsconfig.json lives).
 * @param {{ ignores?: string[] }} [options]
 */
export function createTypecheckedEslintConfig(tsconfigRootDir, options = {}) {
  const ignores = options.ignores ?? ['**/dist/**', '**/node_modules/**', '**/eslint.config.mjs'];

  return tseslint.config(
    { ignores },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
    },
  );
}
