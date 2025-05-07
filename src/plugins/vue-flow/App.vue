<script setup lang="ts">
import Flow from './components/Flow.vue';

interface Props {
  title?: string;
  theme?: string;
  showLogos?: boolean;
}
const props = defineProps<Props>();
</script>

<template>
  <div class="vue-flow-plugin">
    <h2>{{ title || 'Vue Flow 拖拽放置节点' }}</h2>
    <Flow
      :title="title"
      :theme="theme"
      :showLogos="showLogos" />
  </div>
</template>

<style scoped>
.vue-flow-plugin {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

h2 {
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}
</style>
