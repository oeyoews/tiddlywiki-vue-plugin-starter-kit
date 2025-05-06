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

      let code = fs.readFileSync(sourcePath, 'utf-8');
      // 查找目标语句
      const target = 'const vue = require("vue");';
      const replacement =
        'const vue = require("$:/plugins/oeyoews/neotw-vue3");';

      if (code.includes(target)) {
        console.log(`✅ 找到${target} ,开始兼容tiddlywiki...`);
        code = code.replace(target, '');
        fs.writeFileSync(sourcePath, code, 'utf-8');
        console.log('✅ 兼容完成');
      } else {
        console.log('❌ 没有找到 require("vue")，无需替换');
      }

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Successfully copied app.cjs to ${targetDir}`);
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
