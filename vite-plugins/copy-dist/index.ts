// @ts-nocheck
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

// 目标目录
const targetDir = 'tiddlywiki/plugins/example/tiddlers/';

export const copyDist = () => ({
  name: 'copy-to-tiddlywiki',
  closeBundle: async () => {
    try {
      // 获取项目根目录路径
      const rootDir = process.cwd();

      // 确保目标目录存在
      const fullTargetDir = path.resolve(rootDir, targetDir);
      if (!fs.existsSync(fullTargetDir)) {
        fs.mkdirSync(fullTargetDir, { recursive: true });
      }

      // 复制 app.js 到目标目录
      const sourcePath = path.resolve(rootDir, 'dist/app.cjs');
      const targetPath = path.resolve(rootDir, targetDir, 'app.js');

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Successfully copied app.js to ${targetDir}`);
      } else {
        console.error(`Source file not found: ${sourcePath}`);
      }

      // 如果有 CSS 文件也需要复制
      const cssSourcePath = path.resolve(rootDir, 'dist/app.css');
      if (fs.existsSync(cssSourcePath)) {
        const cssTargetPath = path.resolve(rootDir, targetDir, 'app.css');
        fs.copyFileSync(cssSourcePath, cssTargetPath);
        console.log(`Successfully copied app.css to ${targetDir}`);
      }
    } catch (error) {
      console.error('Error copying files:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
  },
});

