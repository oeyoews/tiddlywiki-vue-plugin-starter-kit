      // @ts-nocheck
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { copyDist } from './vite-plugins/copy-dist/index';
import path from 'path';

export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      fileName: 'app',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['vue'], // 将 Vue 标记为外部依赖
      output: {
        globals: { vue: 'Vue', },
      //   entryFileNames: 'app.js',
      //   chunkFileNames: 'app-chunk.js',
      //   assetFileNames: 'app.[ext]',
      //   // manualChunks: {}, // 禁用代码分割
      //   format: 'iife',
      //   // 定义外部依赖的全局变量名
      },
    },
    cssCodeSplit: false, // 禁用 CSS 代码分割，所有 CSS 将被提取到一个文件中
    // 构建完成后执行的钩子
    emptyOutDir: true,
    outDir: 'dist',
    assetsDir: '',
  },
  define: {
    'require("vue")': 'require("$:/plugins/oeyoews/neotw-vue3")',
    "require('vue')": 'require("$:/plugins/oeyoews/neotw-vue3")',
  },
  // 添加构建后钩子
  plugins: [vue(), copyDist()],
});
