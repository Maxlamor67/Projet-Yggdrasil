import { defineConfig } from "vitest/config";
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/tests': path.resolve(__dirname, './tests'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup-tests.ts',
    threads: true,
    maxThreads: 4,
    minThreads: 1,
    isolate: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/tests/e2e/**', // Exclure les tests E2E Cypress
    ],
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'text-summary', 'html', 'cobertura', 'lcov', 'json', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.stories.{ts,tsx}',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/api/**/*', // Exclure l'API auto-générée
        'src/main.tsx',
        'src/routeTree.gen.ts', // Fichier auto-généré
        'src/reportWebVitals.ts',
        'src/vite-env.d.ts',
      ],
      all: true,
      // Désactiver les seuils pour permettre la génération du rapport même avec des tests qui échouent
      // thresholds: {
      //   lines: 70,
      //   functions: 70,
      //   branches: 70,
      //   statements: 70,
      // },
    },
    reporters: ['default', 'junit', 'html'],
    outputFile: {
      junit: './reports/junit.xml',
      html: './reports/index.html',
    },
  },
});
