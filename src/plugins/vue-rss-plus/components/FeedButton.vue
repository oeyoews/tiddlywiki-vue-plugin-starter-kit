<template>
  <button
    class="bg-transparent w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded border-none cursor-pointer hover:bg-gray-100 transition-colors group"
    :class="selected ? 'bg-blue-100 font-bold' : ''"
    @click="$emit('load')">
    <img
      :src="feed.favicon"
      class="size-4 rounded-full mr-1" />
    <span class="flex-1 text-left">{{ feed.name }}</span>
    <span class="text-xs text-gray-500 group-hover:text-gray-700">
      {{ feed.count }}
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  feed: Object,
  selected: Boolean,
});
defineEmits(['load']);
</script>
