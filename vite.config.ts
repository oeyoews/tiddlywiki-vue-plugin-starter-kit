// @ts-nocheck
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { copyDist } from './vite-plugins/copy-dist/index';
import path from 'path';
import replace from '@rollup/plugin-replace'

export default defineConfig({
  build: {
    minify: false, // test
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      fileName: 'app',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['vue'], // 将 Vue 标记为外部依赖
      // plugins: [ ],
      output: {
        globals: { vue: 'Vue' },
      },
    },
    cssCodeSplit: false, // 禁用 CSS 代码分割，所有 CSS 将被提取到一个文件中
    emptyOutDir: true,
    outDir: 'dist',
    assetsDir: '',
  },
  define: {
    'require("vue")': 'require("$:/plugins/oeyoews/neotw-vue3")',
    "require('vue')": 'require("$:/plugins/oeyoews/neotw-vue3")',
  },
  plugins: [vue(), copyDist()],
});
