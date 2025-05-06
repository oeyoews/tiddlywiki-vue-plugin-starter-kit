import App from './App.vue'
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

// 为了向后兼容，保留一个无参数的导出
// export const createDefaultApp = () => createAppWithProps()()
