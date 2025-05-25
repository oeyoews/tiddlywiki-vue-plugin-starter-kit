declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  export const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '~icons/tw-icons/*' {
  const content: string;
  export default content;
}

interface Window {
  electronAPI?: {
    startFetchRSSData: (params: { url: string }) => Promise<string>;
  };
}
