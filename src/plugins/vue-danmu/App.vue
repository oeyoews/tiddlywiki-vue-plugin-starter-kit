<script setup lang="ts">
import Danmaku from './components/Danmaku.vue';

// 定义组件可接收的属性
const props = defineProps<{
  // 添加你需要的属性，并提供默认值
  title?: string;
  theme?: string;
  showLogos?: boolean;
}>();
</script>

<template>
  <Danmaku />
</template>
