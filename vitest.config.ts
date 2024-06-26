import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: false,
  plugins: [
    {
      name: 'a-vitest-plugin-that-changes-config',
      config: () => ({
        test: {
          setupFiles: ['./vitestSetup.ts'],
        },
      }),
    },
  ],
  test: {
    threads: false,
    watch: false,
    testTimeout: 30000,
    hookTimeout: 30000,
    reporters: ['verbose'],
    include: ['**/__tests__/**/*.+(test.ts)'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.pnpm-store/**', '**/ops/**'],
    globals: false,
  },
});
