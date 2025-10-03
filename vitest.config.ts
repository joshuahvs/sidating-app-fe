import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    coverage: {
      // Only measure relevant application source; exclude tooling, type decls & demo components
      exclude: [
        'env.d.ts',
        'eslint.config.*',
        'vite.config.*',
        'vitest.config.*',
        'tsconfig*.json',
        'src/test/**',
        'src/**/*.d.ts',
        'src/components/HelloWorld.vue',
        'src/components/WelcomeItem.vue',
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  define: {
    global: 'globalThis',
  },
})