import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['src/vitest.setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    globals: true,
    coverage: {
      provider: 'v8',
      all: true,
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      exclude: [
        '**/*.module.css',
        'src/styles.css',
        'src/vite-env.d.ts',
        'src/vitest.setup.ts',
        'src/types/**',
        'src/main.tsx',
        '**/*.d.ts'
      ],
      lines: 100,
      functions: 100,
    },
    fakeTimers: {
      toFake: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'],
    },
    restoreMocks: true,
    clearMocks: true,
  },
});

