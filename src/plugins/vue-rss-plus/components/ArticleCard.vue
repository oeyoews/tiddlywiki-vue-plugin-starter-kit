<template>
  <div
    class="bg-white p-3 mb-3 rounded shadow cursor-pointer hover:bg-blue-50"
    @click="$emit('click')">
    <h3 class="font-semibold">
      {{ article.title }}
    </h3>
    <p class="text-sm text-gray-600">{{ article.summary }}</p>
  </div>
</template>

<script setup>
defineProps({
  article: Object,
});
</script>
