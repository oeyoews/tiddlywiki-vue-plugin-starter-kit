// @ts-nocheck
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';
import { copyFileWithMeta } from './meta-generator';

export const copyDist = (pluginName = 'example') => ({
  name: 'copy-to-tiddlywiki',
  closeBundle: async () => {
    try {
      // 获取项目根目录路径
      const rootDir = process.cwd();

      // 根据插件名称确定目标目录
      const pluginDir = `wiki/plugins/${pluginName}/`;
      const targetDir = pluginDir + `tiddlers/`;
      // 定义源插件目录
      const srcPluginDir = path.resolve(rootDir, `src/plugins/${pluginName}`);
      const distPluginDir = path.resolve(rootDir, 'dist-' + pluginName);

      const fullPluginDir = path.resolve(rootDir, pluginDir);
      if (!fs.existsSync(fullPluginDir)) {
        fs.mkdirSync(fullPluginDir, { recursive: true });
      }

      const fullTargetDir = path.resolve(rootDir, targetDir);
      if (!fs.existsSync(fullTargetDir)) {
        fs.mkdirSync(fullTargetDir, { recursive: true });
      }

      // 复制 app.cjs产物 到目标目录app.js
      const sourcePath = path.resolve(distPluginDir, 'app.cjs');
      const targetPath = path.resolve(rootDir, targetDir, 'app.js');

      if (fs.existsSync(sourcePath)) {
        let code = fs.readFileSync(sourcePath, 'utf-8');
        const target = 'require("vue")';

        if (code.includes(target)) {
          console.log(`✅ 找到${target} ,开始兼容tiddlywiki...`);
          code = code.replace(target, 'window.Vue');
          fs.writeFileSync(sourcePath, code, 'utf-8');
          console.log('✅ 兼容完成');
        } else {
          console.log(`❌ 没有找到${target},无需替换`);
        }

        // 复制文件
        fs.copyFileSync(sourcePath, targetPath);

        // 确保有 meta 文件(app.js.meta)
        copyFileWithMeta(sourcePath, targetPath, pluginName);
      } else {
        console.error(`Source file not found: ${sourcePath}`);
      }

      // 插件的所有样式会放到app.css 里面
      // disable tailwindcss for v4
      // const cssSourcePath = path.resolve(distPluginDir, 'app.css');
      // if (fs.existsSync(cssSourcePath)) {
      //   const cssTargetPath = path.resolve(rootDir, targetDir, 'app.css');
      //   copyFileWithMeta(cssSourcePath, cssTargetPath, pluginName);
      // }

      // 复制 widget.js， plugin.info, readme.tid
      const exts = ['.js', '.info', '.tid'];
      if (fs.existsSync(srcPluginDir)) {
        const files = fs
          .readdirSync(srcPluginDir)
          .filter((file) => exts.includes(path.extname(file)));

        if (files.length > 0) {
          // console.log(`找到 ${jsFiles.length} 个 JS 文件需要复制`);

          // todo: 不支持递归查找
          for (const file of files) {
            const sourceFilePath = path.resolve(srcPluginDir, file);
            const targetFilePath = path.resolve(fullTargetDir, file);

            if (file === 'plugin.info' || file === 'readme.tid') {
              fs.copyFileSync(sourceFilePath, path.join(fullPluginDir, file));
            } else {
              fs.copyFileSync(sourceFilePath, targetFilePath);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error copying files(copy-dist):', error);
    }
  },
});
