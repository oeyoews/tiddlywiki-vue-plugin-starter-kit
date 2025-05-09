<script setup lang="ts">
import Table from '~/vue-table/components/Table.vue';
import './global.css';

withDefaults(
  defineProps<{
    tiddlers?: string[];
  }>(),
  {
    tiddlers: () => ['a'],
  }
);
</script>

<template>
  <div class="vue-table-plugin">
    <Table :tiddlers />
  </div>
</template>

<style scoped></style>
