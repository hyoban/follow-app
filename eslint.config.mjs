// @ts-check
import { defineConfig } from 'eslint-config-hyoban'

export default defineConfig({
  ignores: ['api/hono.ts'],
  typeChecked: 'essential',
  project: true,
  tsconfigRootDir: import.meta.dirname,
})
