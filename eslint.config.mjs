// @ts-check
import { defineConfig, GLOB_TS_SRC } from 'eslint-config-hyoban'

export default defineConfig(
  {
    ignores: ['api/hono.ts', 'drizzle'],
    typeChecked: 'essential',
    project: true,
  },
  {
    rules: {
      '@stylistic/jsx-one-expression-per-line': ['error', { allow: 'single-line' }],
    },
  },
  {
    files: GLOB_TS_SRC,
    rules: {
      '@typescript-eslint/return-await': ['warn', 'always'],
    },
  },
)
