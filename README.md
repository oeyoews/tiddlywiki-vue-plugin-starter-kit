## TiddlyWiki Vue 插件启动套件

> 这是一个用于创建 TiddlyWiki Vue 插件的启动套件，它允许你使用 Vue 3 和 TypeScript 开发 TiddlyWiki 插件。

## 特性

* 基于 Vue 3 和 TypeScript
* 使用 Vite 进行快速开发和构建
* 自动将构建产物复制到 TiddlyWiki 插件目录
* 支持向 Vue 组件传递参数
* 与 TiddlyWiki 无缝集成

## 使用方法


```ts
// entry.ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

```bash
pnpm dev ## debug component
pnpm build ## build tiddlywiki app.js（please update cross-env plugin-name var)
pnpm start ## preview tiddlywiki plugin
```

## TODO

<!-- vue-flow -->
* 自动存储edges, 支持拖拽
* 支持上下布局， 自动改变handle

