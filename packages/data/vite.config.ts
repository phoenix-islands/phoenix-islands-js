/// <reference types="vitest" />
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [dts({ include: ['src'] })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@phoenix-islands/react',
      formats: ['es', 'cjs', 'umd'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['@phoenix-islands/core'],
      output: {
        globals: {
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
