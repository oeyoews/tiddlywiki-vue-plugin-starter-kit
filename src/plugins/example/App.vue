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
  <div class="i-[simple-icons--tiddlywiki]"></div> Hello
  <HelloWorld :msg="title" />

</template>

<style scoped>
</style>

