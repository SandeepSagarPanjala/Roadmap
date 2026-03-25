import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/vitest.setup.ts'],
    include: ['src/**/*.spec.ts'],
    css: false,
  },
});

