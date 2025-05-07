<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
import './demo.css'

// 定义组件可接收的属性
const props = defineProps<{
  // 添加你需要的属性，并提供默认值
  title?: string
  theme?: string
  showLogos?: boolean
}>()
</script>

<template>
  <div class="hello-plugin">
    <h2>{{ title || 'hello' }}</h2>
    <HelloWorld :msg="title || 'hello'" />
  </div>
</template>

<style scoped>
</style>
