<template>
  <button
    class="w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors group"
    :class="selected ? 'bg-blue-100 font-bold' : ''"
    @click="$emit('click')">
    <div
      class="w-2 h-2 rounded-full"
      :style="{ backgroundColor: feed.color }"></div>
    <span class="flex-1 text-left">{{ feed.name }}</span>
    <span class="text-xs text-gray-500 group-hover:text-gray-700">
      {{ feed.count }}
    </span>
  </button>
</template>

<script setup>
defineProps({
  feed: Object,
  selected: Boolean,
});
</script>
