import Icons from 'unplugin-icons/vite';

import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { copyDist } from './vite-plugins/copy-dist/index';
import fs from 'fs';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import tailwindcss from '@tailwindcss/vite';

// 从环境变量获取插件名称
const pluginName = process.env.PLUGIN_NAME || null;

// 获取src/plugins目录下的所有有效插件目录（包含plugin.info文件的目录）
const getPluginDirs = () => {
  const pluginsDir = path.resolve(__dirname, 'src/plugins');
  if (!fs.existsSync(pluginsDir)) {
    return [];
  }

  return fs.readdirSync(pluginsDir).filter((dir) => {
    const dirPath = path.join(pluginsDir, dir);
    // 检查是否是目录
    if (!fs.statSync(dirPath).isDirectory()) {
      return false;
    }

    // 检查src/plugins/[dir]目录下是否有plugin.info文件
    const pluginInfoPath = path.join(dirPath, 'plugin.info');
    // 如果没有plugin.info文件，检查wiki/plugins/[dir]目录下是否有plugin.info文件
    const wikiPluginInfoPath = path.resolve(
      __dirname,
      `wiki/plugins/${dir}/plugin.info`
    );

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
  const pluginDir = path.resolve(__dirname, `src/plugins/${plugin}`);
  let entries: string[] = [];
  if (fs.existsSync(pluginDir)) {
    entries = fs.readdirSync(pluginDir)
      .filter((file) => {
        // 匹配 main.ts 或 main-*.ts
        return (
          file === 'main.ts' ||
          (file.startsWith('main-') && file.endsWith('.ts'))
        );
      })
      .map((file) => path.join(pluginDir, file));
  }

  // 构造 input 对象，key 为文件名（不含扩展名），value 为路径
  const input = {};
  entries.forEach((entryPath) => {
    const baseName = path.basename(entryPath, '.ts'); // 如 main 或 main-xxx
    input[baseName] = entryPath;
  });

  return defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~': path.resolve(__dirname, 'src/plugins'),
        '@tw': path.resolve(__dirname, './tailwind.css'),
      },
    },
    build: {
      minify: true,
      lib: {
        entry: input,
        formats: ['cjs'],
        fileName: (format, entryName) => {
          if (entryName === 'main') {
            return 'app.cjs';
          }
          return `${entryName.replace(/^main-/, 'app-')}.cjs`;
        },
      },
      outDir: 'dist-' + plugin,
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: { vue: 'Vue' },
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name.startsWith('main-')) {
              return `app-${chunkInfo.name.slice(5)}.cjs`; // 去掉 main-，换成 app-
            }
            return `app.cjs`;
          },
        },
        input,
      },
      cssCodeSplit: false,
      emptyOutDir: true,
      assetsDir: './assets',
    },
    plugins: [
      vue(),
      tailwindcss(),
      Icons({
        customCollections: {
          'tw-icons': FileSystemIconLoader('./src/assets/icons', (svg) => {
            return svg.replace(/^<svg /, '<svg fill="currentColor" ');
          }),
        },
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      copyDist(plugin), // 传递插件名称给copyDist
    ],
    define: {
      // 替换 process.env 为具体值
      'process.env': JSON.stringify(process.env),
      // 或者只替换特定环境变量
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'production'
      ),
    },
  });
};

// 如果指定了单个插件，则只构建该插件
// 否则，构建第一个插件（后续可以通过npm脚本构建所有插件）
export default createPluginConfig(pluginsToProcess[0]);
