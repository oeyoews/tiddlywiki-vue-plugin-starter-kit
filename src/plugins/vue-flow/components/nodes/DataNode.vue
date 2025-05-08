<script setup lang="ts">
import { Position, NodeProps, Handle } from '@vue-flow/core';
// import { ref } from 'vue';

// const supportedFields = ['title', 'creator', 'description', 'url'];

// 获取节点属性
const props = defineProps<NodeProps>();

const filterFields = (fields: any) =>
  Object.keys(fields)
    .filter((key) => key !== 'tags')
    .map((key) => ({ key, value: fields[key] }));

const fields = filterFields(props.data.fields);
const tagsList = props.data.fields?.tags || [];
// TODO: color support

const title = props.data.fields.title;
const handleNodeClick = () => new $tw.Story().navigateTiddler(title);
</script>

<template>
  <div
    class="data-node"
    @click="handleNodeClick">
    <!-- 输入连接点 -->
    <Handle
      type="target"
      :position="Position.Left"
      :node-id="props.id" />

    <!-- 节点内容 -->
    <div class="data-header">
      <div class="data-name">
        {{ props.data?.fields.title || 'Tiddler title' }}
      </div>
    </div>

    <div class="data-fields">
      <div
        v-for="(field, index) in fields"
        :key="index"
        class="field-row">
        <!-- tags -->
        <div class="field-key">{{ field.key }}:</div>
        <div class="field-value">
          {{ field.value || '无' }}
        </div>
      </div>

      <div
        v-if="tagsList.length > 0"
        class="card-tags">
        <span
          v-for="(tag, index) in tagsList"
          :key="index"
          class="tag">
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- 输出连接点 -->
    <Handle
      type="source"
      :position="Position.Right"
      :node-id="props.id" />
  </div>
</template>

<style scoped>
.data-node {
  padding: 0;
  border-radius: 5px;
  /* background-color: white;
  border: 1px solid #9c27b0; */
  background-color: #e1f5fe;
  border: 1px solid #81d4fa;
  width: 300px;
  position: relative;
}

.data-header {
  /* background-color: #9c27b0; */
  padding: 8px 12px;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
  border-bottom: 1px solid #81d4fa;
  padding-bottom: 5px;
}

.data-type {
  font-size: 11px;
  opacity: 0.8;
  text-transform: uppercase;
}

.data-name {
  font-weight: bold;
  font-size: 14px;
}

.data-fields {
  padding: 8px 12px;
  max-height: 150px;
  overflow-y: auto;
}

.no-fields {
  font-size: 12px;
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 8px 0;
}

.field-row {
  display: flex;
  margin-bottom: 6px;
  font-size: 12px;
  border-bottom: 1px dashed #e0e0e0;
  padding-bottom: 6px;
}

.field-row:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.field-key {
  font-weight: bold;
  color: #555;
  width: 40%;
}

.field-value {
  color: #333;
  width: 60%;
  word-break: break-word;
  cursor: pointer;
}

.field-value:hover {
  background-color: #f5f5f5;
}

.field-value-edit {
  width: 60%;
}

.field-value-edit input {
  width: 100%;
  padding: 2px 4px;
  font-size: 12px;
  border: 1px solid #9c27b0;
  border-radius: 3px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  font-size: 11px;
  /* background-color: #e3f2fd; */
  background-color: #fff;
  color: #1976d2;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 16px;
}
</style>
