<template>
  <div
    class="bg-white p-2 mb-2 rounded shadow cursor-pointer hover:bg-blue-50"
    @click="$emit('click')">
    <h3 class="font-semibold mb-0">
      {{ article.title }}
    </h3>
    <p class="text-sm my-1 text-gray-600">{{ article.summary }}</p>
  </div>
</template>

<script setup>
defineProps({
  article: Object,
});
</script>
