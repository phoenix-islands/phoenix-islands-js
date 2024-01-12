/// <reference types="vitest" />
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({ include: ['src'] })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'myLib',
      formats: ['es', 'cjs', 'umd'],
      fileName: 'index'
    }
    // rollupOptions: {
    //   external: [],
    //   output: { globals: { } }
    // }
  },
  test: {
    globals: true,
    include: ['test/*.test.ts']
  }
})
