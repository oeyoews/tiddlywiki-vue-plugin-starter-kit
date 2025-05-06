// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 创建命令行交互界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 默认作者名
const DEFAULT_AUTHOR = 'oeyoews';

// 询问插件名称
rl.question('请输入插件名称: ', (pluginName) => {
  if (!pluginName) {
    console.error('错误: 插件名称不能为空');
    rl.close();
    return;
  }

  // 询问插件描述
  rl.question('请输入插件描述 (可选): ', (description) => {
    // 询问作者名称
    rl.question(`请输入作者名称 (默认: ${DEFAULT_AUTHOR}): `, (author) => {
      // 如果没有提供作者名称，使用默认值
      author = author || DEFAULT_AUTHOR;

      // 创建插件
      createPlugin(pluginName, description || pluginName, author);
      rl.close();
    });
  });
});

/**
 * 创建插件目录和文件
 * @param {string} pluginName 插件名称
 * @param {string} description 插件描述
 * @param {string} author 作者名称
 */
function createPlugin(pluginName, description, author) {
  console.log(`\n开始创建插件: ${pluginName}`);

  // 创建插件目录
  const srcPluginDir = path.resolve(rootDir, `src/plugins/${pluginName}`);
  const wikiPluginDir = path.resolve(rootDir, `wiki/plugins/${pluginName}`);
  const wikiTiddlersDir = path.resolve(wikiPluginDir, 'tiddlers');

  // 检查插件目录是否已存在
  if (fs.existsSync(srcPluginDir)) {
    console.error(`错误: 插件目录 ${srcPluginDir} 已存在`);
    return;
  }

  // 创建目录
  fs.mkdirSync(srcPluginDir, { recursive: true });
  fs.mkdirSync(wikiPluginDir, { recursive: true });
  fs.mkdirSync(wikiTiddlersDir, { recursive: true });

  console.log(`✅ 创建目录: ${srcPluginDir}`);
  // console.log(`✅ 创建目录: ${wikiPluginDir}`);
  // console.log(`✅ 创建目录: ${wikiTiddlersDir}`);

  // 创建 plugin.info 文件
  const pluginInfo = {
    title: `$:/plugins/${author}/${pluginName}`,
    description: description,
    author: author,
    version: '0.1.0',
    'core-version': '>=5.3.6',
    type: 'application/json',
    'plugin-type': 'plugin',
    name: pluginName,
    list: 'readme'
  };

  fs.writeFileSync(
    path.resolve(srcPluginDir, 'plugin.info'),
    JSON.stringify(pluginInfo, null, 2),
    'utf-8'
  );
  console.log(`✅ 创建文件: ${path.resolve(srcPluginDir, 'plugin.info')}`);

  // 创建 readme.tid 文件
  const readmeContent = `title: $:/plugins/${author}/${pluginName}/readme

!! ${description}

<$${pluginName} />
`;

  fs.writeFileSync(
    path.resolve(srcPluginDir, 'readme.tid'),
    readmeContent,
    'utf-8'
  );
  console.log(`✅ 创建文件: ${path.resolve(srcPluginDir, 'readme.tid')}`);

  // 创建 main.ts 文件
  const mainTsContent = `import App from './App.vue'
import { h } from 'vue';

// 创建一个工厂函数，接收参数并返回组件实例
export default function component(props = {}) {
  // 返回一个函数，该函数可以被 TiddlyWiki 调用
  return function(containerProps = {}) {
    // 合并来自 TiddlyWiki 的属性和默认属性
    const mergedProps = { ...props, ...containerProps }

    // 创建一个渲染函数，使用 h 函数渲染 App 组件并传递属性
    return {
      render() {
        return h(App, mergedProps)
      }
    }
  }
}
`;

  fs.writeFileSync(
    path.resolve(srcPluginDir, 'main.ts'),
    mainTsContent,
    'utf-8'
  );
  console.log(`✅ 创建文件: ${path.resolve(srcPluginDir, 'main.ts')}`);

  // 创建 App.vue 文件
  const appVueContent = `<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'

// 定义组件可接收的属性
const props = defineProps<{
  // 添加你需要的属性，并提供默认值
  title?: string
  theme?: string
  showLogos?: boolean
}>()
</script>

<template>
  <div class="${pluginName}-plugin">
    <h2>{{ title || '${description}' }}</h2>
    <HelloWorld :msg="title || '${pluginName}'" />
  </div>
</template>

<style scoped>
.${pluginName}-plugin {
  padding: 20px;
  border: 2px solid #42b883;
  border-radius: 8px;
  background-color: #f8f8f8;
}
</style>`;

  fs.writeFileSync(
    path.resolve(srcPluginDir, 'App.vue'),
    appVueContent,
    'utf-8'
  );
  console.log(`✅ 创建文件: ${path.resolve(srcPluginDir, 'App.vue')}`);

  // 创建 widget.js 文件
  const widgetJsContent = `/*\\
title: $:/plugins/${author}/${pluginName}/widget.js
type: application/javascript
module-type: widget

\\*/
const { widget: Widget } = require('$:/core/modules/widgets/widget.js');

class ${capitalizeFirstLetter(pluginName)}Widget extends Widget {
  constructor(parseTreeNode, options) {
    super(parseTreeNode, options);
  }

  render(parent, nextSibling) {
    if (!$tw.browser) return;

    this.computeAttributes();
    this.execute();

    const ssr = this.document.isTiddlyWikiFakeDom;
    if (ssr) return;

    const vuelib = '$:/plugins/oeyoews/neotw-vue3/vue.global.prod.js';

    if (!window.Vue) {
      window.Vue = require(vuelib);
      window.vue = require(vuelib);
    }
    const {title} = this.attributes;

    const { createApp } = window.Vue;
    const component = require('./app');
    const domNode = this.document.createElement('div');
    const props = {
      title: title || "${description}"
    }

    try {
      const app = createApp(component(props)());

      app.config.errorHandler = (err) => {
        const text = \`[Vue3](\${app.version}): \` + err;
        console.error(text, '(${pluginName} plugin)');
        domNode.textContent = text;
        domNode.style.color = 'red';
      };

      // 挂载
      app.mount(domNode);

      parent.insertBefore(domNode, nextSibling);
      this.domNodes.push(domNode);
    } catch (e) {
      console.error(e.message, '${pluginName} plugin');
    }
  }
}

/** @description ${description} widget */
exports['${pluginName}'] = ${capitalizeFirstLetter(pluginName)}Widget;
`;

  fs.writeFileSync(
    path.resolve(wikiTiddlersDir, 'widget.js'),
    widgetJsContent,
    'utf-8'
  );
  console.log(`✅ 创建文件: ${path.resolve(wikiTiddlersDir, 'widget.js')}`);

  console.log(`\n✅ 插件 ${pluginName} 创建成功!`);
  console.log(`\n使用以下命令构建插件:`);
  console.log(`npm run build`);
}

/**
 * 首字母大写
 * @param {string} str 字符串
 * @returns {string} 首字母大写的字符串
 */
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
