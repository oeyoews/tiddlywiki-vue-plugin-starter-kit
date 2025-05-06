// @ts-nocheck
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { copyDist } from './vite-plugins/copy-dist/index';
import path from 'path';
import replace from '@rollup/plugin-replace'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    minify: true, // test
    lib: {
      entry: path.resolve(__dirname, 'src/plugins/example/main.ts'),
      fileName: 'app',
      formats: ['cjs'],
    },
    outDir: 'example',
    // assetsInlineLimit: 102400, // 10KB
    rollupOptions: {
      external: ['vue'], // 将 Vue 标记为外部依赖
      // plugins: [ ],
      output: {
        globals: { vue: 'Vue' },
        // inlineDynamicImports: true,
      },
    },
    cssCodeSplit: false, // 禁用 CSS 代码分割，所有 CSS 将被提取到一个文件中
    emptyOutDir: true,
    assetsDir: '',
  },
  define: {
    'require("vue")': 'require("$:/plugins/oeyoews/neotw-vue3")',
    "require('vue')": 'require("$:/plugins/oeyoews/neotw-vue3")',
  },
  plugins: [
    vue(),
    copyDist()
  ],
});
