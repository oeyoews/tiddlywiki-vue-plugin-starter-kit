<template>
  <div
    class="w-full px-1 flex items-center py-2 text-sm text-gray-700 rounded border-none cursor-pointer hover:bg-gray-100 transition-colors group"
    :class="selected ? 'bg-blue-100 font-bold' : ''"
    @click="$emit('load')">
    <img
      :src="feed.favicon"
      class="size-3 rounded-full mr-1" />
    <span class="flex-1 text-eft">
      {{ feed.name }}
      <span
        class="text-xs text-gray-500 group-hover:text-gray-700 italic"
        v-show="feed.count > 0">
        ({{ feed.count }})
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  feed: Object,
  selected: Boolean,
});
defineEmits(['load']);
</script>
