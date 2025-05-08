<script setup lang="ts">
import { Position, NodeProps, Handle } from '@vue-flow/core'

// 获取节点属性
const props = defineProps<NodeProps>()
</script>

<template>
  <div class="default-node">
    <!-- 输入连接点 -->
    <Handle
      type="target"
      :position="Position.Left"
      :node-id="props.id"
    />

    <!-- 节点内容 -->
    <div class="node-content">
      {{ props.data?.label || '默认节点' }}
    </div>

    <!-- 输出连接点 -->
    <Handle
      type="source"
      :position="Position.Right"
      :node-id="props.id"
    />
  </div>
</template>

<style scoped>
.default-node {
  padding: 10px;
  border-radius: 5px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  width: 150px;
  text-align: center;
  position: relative;
}

.node-content {
  font-size: 14px;
  padding: 5px;
}
</style>
