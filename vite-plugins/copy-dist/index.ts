// @ts-nocheck
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';
import { copyFileWithMeta } from './meta-generator';

// 默认插件名称
const DEFAULT_PLUGIN_NAME = 'example';

export const copyDist = (pluginName = DEFAULT_PLUGIN_NAME) => ({
  name: 'copy-to-tiddlywiki',
  closeBundle: async () => {
    try {
      // 获取项目根目录路径
      const rootDir = process.cwd();

      // 根据插件名称确定目标目录
      const targetDir = `wiki/plugins/${pluginName}/tiddlers/`;
      const pluginDir = `wiki/plugins/${pluginName}/`;

      console.log(`Processing plugin: ${pluginName}`);
      console.log(`Target directory: ${targetDir}`);

      // 确保插件目录存在
      const fullPluginDir = path.resolve(rootDir, pluginDir);
      if (!fs.existsSync(fullPluginDir)) {
        fs.mkdirSync(fullPluginDir, { recursive: true });
      }

      // 确保目标目录存在
      const fullTargetDir = path.resolve(rootDir, targetDir);
      if (!fs.existsSync(fullTargetDir)) {
        fs.mkdirSync(fullTargetDir, { recursive: true });
      }

      // 定义源插件目录
      const srcPluginDir = path.resolve(rootDir, `src/plugins/${pluginName}`);

      // 复制 plugin.info 文件（如果存在）
      const srcPluginInfoPath = path.resolve(srcPluginDir, 'plugin.info');
      const destPluginInfoPath = path.resolve(rootDir, `wiki/plugins/${pluginName}/plugin.info`);

      if (fs.existsSync(srcPluginInfoPath)) {
        console.log(`复制 plugin.info 文件: ${srcPluginInfoPath} -> ${destPluginInfoPath}`);
        fs.copyFileSync(srcPluginInfoPath, destPluginInfoPath);
      } else {
        console.log(`src/plugins/${pluginName}/plugin.info 文件不存在，检查是否已经在目标目录中`);
        if (!fs.existsSync(destPluginInfoPath)) {
          console.warn(`警告: 插件 ${pluginName} 没有 plugin.info 文件，可能无法被 TiddlyWiki 识别为插件`);
        }
      }

      // 复制 readme.tid 文件（如果存在）
      const srcReadmePath = path.resolve(srcPluginDir, 'readme.tid');
      const destReadmePath = path.resolve(rootDir, `wiki/plugins/${pluginName}/readme.tid`);

      if (fs.existsSync(srcReadmePath)) {
        console.log(`复制 readme.tid 文件: ${srcReadmePath} -> ${destReadmePath}`);
        fs.copyFileSync(srcReadmePath, destReadmePath);
      } else {
        console.log(`src/plugins/${pluginName}/readme.tid 文件不存在，检查是否需要创建`);
        // 如果目标目录中也没有 readme.tid 文件，则创建一个默认的
        if (!fs.existsSync(destReadmePath)) {
          console.log(`创建默认的 readme.tid 文件: ${destReadmePath}`);
          const defaultReadmeContent = `title: $:/plugins/oeyoews/${pluginName}/readme

<$${pluginName} />`;
          fs.writeFileSync(destReadmePath, defaultReadmeContent, 'utf-8');
        }
      }

      // 复制 app.js 到目标目录
      const sourcePath = path.resolve(rootDir, `${pluginName}/app.cjs`);
      const targetPath = path.resolve(rootDir, targetDir, 'app.js');

      if (fs.existsSync(sourcePath)) {
        let code = fs.readFileSync(sourcePath, 'utf-8');
        // 查找目标语句
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

        // 确保有 meta 文件
        copyFileWithMeta(sourcePath, targetPath, pluginName);
      } else {
        console.error(`Source file not found: ${sourcePath}`);
      }

      // 复制插件源目录下的所有 CSS 文件
      const srcCssFiles = fs.readdirSync(srcPluginDir)
        .filter(file => file.endsWith('.css'));

      if (srcCssFiles.length > 0) {
        console.log(`找到 ${srcCssFiles.length} 个 CSS 文件需要复制`);

        for (const file of srcCssFiles) {
          const sourceCssPath = path.resolve(srcPluginDir, file);
          const targetCssPath = path.resolve(fullTargetDir, file);

          console.log(`复制 CSS 文件: ${sourceCssPath} -> ${targetCssPath}`);
          copyFileWithMeta(sourceCssPath, targetCssPath, pluginName);
        }
      }

      // 如果有构建生成的 CSS 文件也需要复制
      const cssSourcePath = path.resolve(rootDir, `${pluginName}/app.css`);
      console.log(cssSourcePath, 'css file')
      if (fs.existsSync(cssSourcePath)) {
        const cssTargetPath = path.resolve(rootDir, targetDir, 'app.css');
        copyFileWithMeta(cssSourcePath, cssTargetPath, pluginName);
      }

      // 复制其他资源文件
      const assetsDir = path.resolve(rootDir, `${pluginName}/assets`);
      if (fs.existsSync(assetsDir)) {
        const targetAssetsDir = path.resolve(fullTargetDir, 'assets');
        if (!fs.existsSync(targetAssetsDir)) {
          fs.mkdirSync(targetAssetsDir, { recursive: true });
        }

        // 读取所有资源文件
        const assetFiles = fs.readdirSync(assetsDir);
        for (const file of assetFiles) {
          const sourceAssetPath = path.resolve(assetsDir, file);
          const targetAssetPath = path.resolve(targetAssetsDir, file);
          copyFileWithMeta(sourceAssetPath, targetAssetPath, pluginName);
        }
      }

      // 复制插件源目录下的所有 JS 文件
      if (fs.existsSync(srcPluginDir)) {
        const jsFiles = fs.readdirSync(srcPluginDir)
          .filter(file => file.endsWith('.js') && file !== 'main.js');

        if (jsFiles.length > 0) {
          console.log(`找到 ${jsFiles.length} 个 JS 文件需要复制`);

          for (const file of jsFiles) {
            const sourceJsPath = path.resolve(srcPluginDir, file);
            const targetJsPath = path.resolve(fullTargetDir, file);

            console.log(`复制 JS 文件: ${sourceJsPath} -> ${targetJsPath}`);
            fs.copyFileSync(sourceJsPath, targetJsPath);

            // 确保有 meta 文件
            copyFileWithMeta(sourceJsPath, targetJsPath, pluginName);
          }
        }
      }
    } catch (error) {
      console.error('Error copying files:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
  },
});

