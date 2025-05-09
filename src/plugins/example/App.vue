<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
import './global.css'

defineProps<{
  title?: string
  theme?: string
  showLogos?: boolean
}>()
</script>

<template>
  <HelloWorld :msg="title" />
</template>

<style scoped>
</style>

