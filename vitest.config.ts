import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['wf/src/**/*.ts'],
      exclude: ['wf/src/**/*.test.ts', 'tests/**'],
    },
    testTimeout: 30000, // 30秒（git/gh操作を想定）
  },
  resolve: {
    alias: {
      '@wf': resolve(__dirname, './wf/src'),
      '@tests': resolve(__dirname, './tests'),
    },
  },
});
