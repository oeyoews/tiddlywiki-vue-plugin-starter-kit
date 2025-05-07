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
}
</style>
