declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  export const component: DefineComponent<{}, {}, any>;
  export default component;
}
