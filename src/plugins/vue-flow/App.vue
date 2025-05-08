<script setup lang="ts">
import Flow from './components/Flow.vue';
import { initialNodes, initialEdges } from './constant';

import { FlowProps } from '@/plugins/vue-flow/vue-flow-types';
withDefaults(defineProps<FlowProps>(), {
  data: () => ({
    nodes: initialNodes as any,
    edges: initialEdges as any,
  }),
});
</script>

<template>
  <div class="vue-flow-plugin">
    <Flow :data="data" />
  </div>
</template>

<style scoped>
.vue-flow-plugin {
  width: 100%;
  height: 100%;
}
</style>
