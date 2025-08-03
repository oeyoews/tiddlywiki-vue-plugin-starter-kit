<template>
  <BlurText
    text="Isn't this so cool?!"
    :delay="200"
    class-name="text-2xl font-semibold text-center"
    animate-by="words"
    direction="top"
    :threshold="0.1"
    root-margin="0px"
    :step-duration="0.35"
    @animation-complete="handleAnimationComplete"
  />
</template>

<script setup lang="ts">
  import BlurText from "@/plugins/vue-bits/components/Blur.vue";

  const handleAnimationComplete = () => {
    console.log('All animations complete!');
};
</script>