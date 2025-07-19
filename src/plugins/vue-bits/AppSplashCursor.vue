<script setup lang="ts">
  import SplashCursor from '@/plugins/vue-bits/components/Splash.vue';

  // 定义组件可接收的属性
  const props = defineProps<{
    // 添加你需要的属性，并提供默认值
    title?: string
    theme?: string
    showLogos?: boolean
  }>()
  const images = [
    { id: 1, img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format" },
    { id: 2, img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format" },
    { id: 3, img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format" },
    { id: 4, img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format" }
  ];
</script>

<template>
  <div class="vue-bits-plugin">
      <SplashCursor
    :SIM_RESOLUTION="128"
    :DYE_RESOLUTION="1440"
    :CAPTURE_RESOLUTION="512"
    :DENSITY_DISSIPATION="3.5"
    :VELOCITY_DISSIPATION="2"
    :PRESSURE="0.1"
    :PRESSURE_ITERATIONS="20"
    :CURL="3"
    :SPLAT_RADIUS="0.2"
    :SPLAT_FORCE="6000"
    :SHADING="true"
    :COLOR_UPDATE_SPEED="10"
    :BACK_COLOR="{ r: 0.5, g: 0, b: 0 }"
    :TRANSPARENT="true"
  />
  </div>
</template>

<style scoped></style>
