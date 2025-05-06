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
  <div class="demo-plugin">
    <h2>这是Demo插件</h2>
    <HelloWorld :msg="title || 'Demo Plugin'" />
  </div>
</template>

<style scoped>
.demo-plugin {
  padding: 20px;
  border: 2px solid #42b883;
  border-radius: 8px;
  background-color: #f8f8f8;
}
</style>
