<script setup lang="ts">
import RSS from './components/RSS.vue';
import './tailwind.css';
// 定义组件可接收的属性
const props = defineProps<{
  // 添加你需要的属性，并提供默认值
  title?: string;
  theme?: string;
  showLogos?: boolean;
}>();
</script>

<template>
  <div class="vue-rss-plus-plugin">
    <RSS />
  </div>
</template>
