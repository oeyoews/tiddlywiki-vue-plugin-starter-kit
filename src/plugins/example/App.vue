<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'

// 定义组件可接收的属性
const props = defineProps<{
  // 添加你需要的属性，并提供默认值
  title?: string
  theme?: string
  showLogos?: boolean
}>()
</script>

<template>
  <div v-if="showLogos !== false">
    <!-- <a href="https://vite.dev" target="_blank"> -->
      <!-- <img src="/vite.svg" class="logo" alt="Vite logo" /> -->
    <!-- </a> -->
    <!-- <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a> -->
  </div>
  <!-- 使用传入的 title 属性，如果没有则使用默认值 -->
  <HelloWorld :msg="title || 'Vite + Vue'" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

