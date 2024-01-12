/// <reference types="vitest" />
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), dts({ include: ['src'] })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@phoenix-islands/react',
      formats: ['es', 'cjs', 'umd'],
      fileName: 'index'
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@phoenix-islands/core'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
          '@phoenix-islands/core': '@phoenix-islands/core'
        }
      }
    }
  }
  // test: {
  //   globals: true,
  //   include: ['test/*.test.ts']
  // }
})
