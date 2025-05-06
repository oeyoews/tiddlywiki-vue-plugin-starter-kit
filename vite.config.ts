import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { copyDist } from './vite-plugins/copy-dist/index';

// https://vite.dev/config/
export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      external: ['vue'], // 将 Vue 标记为外部依赖
      output: {
        entryFileNames: 'app.js',
        chunkFileNames: 'app-chunk.js',
        assetFileNames: 'app.[ext]',
        // manualChunks: {}, // 禁用代码分割
        format: 'iife',
        // 定义外部依赖的全局变量名
        globals: {
          vue: 'Vue',
        },
      },
    },
    cssCodeSplit: false, // 禁用 CSS 代码分割，所有 CSS 将被提取到一个文件中
    // 构建完成后执行的钩子
    emptyOutDir: true,
    outDir: 'dist',
    assetsDir: '',
  },
  // 添加构建后钩子
  plugins: [vue(), copyDist()],
});
