// @ts-nocheck
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 获取src/plugins目录下的所有有效插件目录（包含plugin.info文件的目录）
const getPluginDirs = () => {
  const pluginsDir = path.resolve(rootDir, 'src/plugins');
  if (!fs.existsSync(pluginsDir)) {
    return [];
  }

  return fs.readdirSync(pluginsDir)
    .filter(dir => {
      const dirPath = path.join(pluginsDir, dir);
      // 检查是否是目录
      if (!fs.statSync(dirPath).isDirectory()) {
        return false;
      }

      // 检查src/plugins/[dir]目录下是否有plugin.info文件
      const pluginInfoPath = path.join(dirPath, 'plugin.info');
      // 如果没有plugin.info文件，检查wiki/plugins/[dir]目录下是否有plugin.info文件
      const wikiPluginInfoPath = path.resolve(rootDir, `wiki/plugins/${dir}/plugin.info`);

      const hasPluginInfo = fs.existsSync(pluginInfoPath) || fs.existsSync(wikiPluginInfoPath);
      if (!hasPluginInfo) {
        console.log(`跳过目录 ${dir}，因为没有找到 plugin.info 文件`);
      }
      return hasPluginInfo;
    });
};

// 构建单个插件
const buildPlugin = (pluginName) => {
  return new Promise((resolve, reject) => {
    console.log(`\n开始构建插件: ${pluginName}`);

    // 使用环境变量传递插件名称
    const env = { ...process.env, PLUGIN_NAME: pluginName };

    exec(`vite build`, { cwd: rootDir, env }, (error, stdout, stderr) => {
      if (error) {
        console.error(`构建插件 ${pluginName} 失败:`, error);
        reject(error);
        return;
      }

      console.log(stdout);
      if (stderr) {
        console.error(stderr);
      }

      console.log(`插件 ${pluginName} 构建完成`);
      resolve();
    });
  });
};

// 主函数
const main = async () => {
  try {
    const plugins = getPluginDirs();

    if (plugins.length === 0) {
      console.log('没有找到任何插件目录');
      return;
    }

    console.log(`找到以下插件: ${plugins.join(', ')}`);

    // 依次构建每个插件
    for (const plugin of plugins) {
      await buildPlugin(plugin);
    }

    console.log('\n所有插件构建完成!');
  } catch (error) {
    console.error('构建过程中发生错误:', error);
    process.exit(1);
  }
};

// 执行主函数
main();
