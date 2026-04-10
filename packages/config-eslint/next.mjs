import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';

/**
 * @param {string} baseDirectory Absolute path to the Next.js app root (where next.config lives).
 */
export function createNextEslintConfig(baseDirectory) {
  const compat = new FlatCompat({ baseDirectory });

  return [
    { ignores: ['**/.next/**', '**/node_modules/**'] },
    eslint.configs.recommended,
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ];
}
