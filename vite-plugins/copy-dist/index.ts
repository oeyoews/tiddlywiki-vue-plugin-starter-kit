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
      // 确保目标目录存在
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 复制 app.js 到目标目录
      const sourcePath = path.resolve(__dirname, 'dist/app.js');
      const targetPath = path.resolve(__dirname, targetDir, 'app.js');

      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Successfully copied app.js to ${targetDir}`);

      // 如果有 CSS 文件也需要复制
      if (fs.existsSync(path.resolve(__dirname, 'dist/app.css'))) {
        fs.copyFileSync(
          path.resolve(__dirname, 'dist/app.css'),
          path.resolve(__dirname, targetDir, 'app.css')
        );
        console.log(`Successfully copied app.css to ${targetDir}`);
      }
    } catch (error) {
      console.error('Error copying files:', error);
    }
  },
});
