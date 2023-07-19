import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    // Options can be added here if needed : https://vitest.dev/config/
    globals: true,
  },
})
