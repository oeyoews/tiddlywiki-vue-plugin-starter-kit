// @ts-nocheck
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { copyDist } from './vite-plugins/copy-dist/index';
import path from 'path';
import fs from 'fs';

// 从环境变量获取插件名称
const pluginName = process.env.PLUGIN_NAME || null;

// 获取src/plugins目录下的所有有效插件目录（包含plugin.info文件的目录）
const getPluginDirs = () => {
  const pluginsDir = path.resolve(__dirname, 'src/plugins');
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
      const wikiPluginInfoPath = path.resolve(__dirname, `wiki/plugins/${dir}/plugin.info`);

      return fs.existsSync(pluginInfoPath) || fs.existsSync(wikiPluginInfoPath);
    });
};

// 获取要构建的插件列表
const pluginsToProcess = pluginName ? [pluginName] : getPluginDirs();

// 如果没有找到插件，使用默认的example插件
if (pluginsToProcess.length === 0) {
  pluginsToProcess.push('example');
}

// 创建单个插件的构建配置
const createPluginConfig = (plugin) => {
  console.log(`Creating build config for plugin: ${plugin}`);

  return defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      minify: true,
      lib: {
        entry: path.resolve(__dirname, `src/plugins/${plugin}/main.ts`),
        fileName: 'app',
        formats: ['cjs'],
      },
      outDir: "dist-" + plugin,
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: { vue: 'Vue' },
        },
      },
      cssCodeSplit: false,
      emptyOutDir: true,
      assetsDir: './assets',
    },
    plugins: [
      vue(),
      copyDist(plugin) // 传递插件名称给copyDist
    ],
  });
};

// 如果指定了单个插件，则只构建该插件
// 否则，构建第一个插件（后续可以通过npm脚本构建所有插件）
export default createPluginConfig(pluginsToProcess[0]);
