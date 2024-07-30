// @ts-check
import { defineConfig, GLOB_TS_SRC } from 'eslint-config-hyoban'

export default defineConfig(
  {
    ignores: ['api/hono.ts', 'drizzle'],
    typeChecked: 'essential',
    project: true,
  },
  {
    files: GLOB_TS_SRC,
    rules: {
      '@typescript-eslint/return-await': ['warn', 'always'],
    },
  },
)
