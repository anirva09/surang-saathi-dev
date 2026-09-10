import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// .mts so Vite loads this as real ESM. As vitest.config.ts it was parsed as
// CommonJS, which emitted a deprecation warning and would break under Vite's
// future native config loader.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
