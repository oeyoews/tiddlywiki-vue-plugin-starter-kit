<script setup lang="ts">
import { Position, NodeProps, Handle } from '@vue-flow/core'

// 获取节点属性
const props = defineProps<NodeProps>()
</script>

<template>
  <div class="start-node">
    <!-- 输出连接点 -->
    <Handle
      type="source"
      :position="Position.Right"
      :node-id="props.id"
    />

    <!-- 节点内容 -->
    <div class="node-content">
      <div class="start-icon">▶</div>
      <div class="node-label">{{ props.data?.label || '开始节点' }}</div>
    </div>
  </div>
</template>

<style scoped>
.start-node {
  padding: 15px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  border: 2px solid #2E7D32;
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  box-shadow: none; /* 移除阴影效果 */
  position: relative;
  transition: all 0.3s ease;
}

.start-node:hover {
  transform: scale(1.05);
  /* 移除悬停时的阴影效果 */
}

.node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.start-icon {
  font-size: 28px;
  margin-bottom: 8px;
  color: white;
  /* 移除文本阴影 */
}

.node-label {
  font-size: 14px;
  font-weight: bold;
  /* 移除文本阴影 */
}

/* 自定义连接点样式 */
:deep(.vue-flow__handle) {
  width: 10px;
  height: 10px;
  background-color: #4CAF50;
  border: 2px solid white;
}

:deep(.vue-flow__handle:hover) {
  background-color: #8BC34A;
}
</style>
