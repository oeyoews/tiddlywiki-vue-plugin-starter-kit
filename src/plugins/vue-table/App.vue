<script setup lang="ts">
import Table from '~/vue-table/components/Table.vue';

defineProps<{
  title?: string;
  theme?: string;
  showLogos?: boolean;
}>();
</script>

<template>
  <div class="vue-table-plugin">
    <h2>{{ title || 'vue-table' }}</h2>
    <Table />
  </div>
</template>

<style scoped></style>
