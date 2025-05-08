<script setup lang="ts">
import Flow from './components/Flow.vue';

import { FlowProps } from '@/plugins/vue-flow/vue-flow-types';
withDefaults(defineProps<FlowProps>(), {
  data: () => ({
    nodes: [],
    edges: [],
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
