<script setup lang="ts">
import { Position, NodeProps, Handle } from '@vue-flow/core'

// 获取节点属性
const props = defineProps<NodeProps>()

// 获取节点状态
const status = props.data?.status || 'pending'
</script>

<template>
  <div class="process-node" :class="`status-${status}`">
    <!-- 左侧连接点 -->
    <Handle 
      type="target" 
      :position="Position.Left" 
      :node-id="props.id" 
    />
    
    <!-- 节点内容 -->
    <div class="process-icon">
      <div v-if="status === 'pending'" class="icon pending">⏳</div>
      <div v-else-if="status === 'processing'" class="icon processing">⚙️</div>
      <div v-else-if="status === 'completed'" class="icon completed">✅</div>
      <div v-else-if="status === 'error'" class="icon error">❌</div>
      <div v-else class="icon">⚪</div>
    </div>
    
    <div class="process-content">
      <div class="process-title">{{ props.data?.label || '流程节点' }}</div>
      <div class="process-description">{{ props.data?.description || '流程描述' }}</div>
      <div class="process-status">
        状态: 
        <span class="status-text">
          {{ 
            status === 'pending' ? '等待中' : 
            status === 'processing' ? '处理中' : 
            status === 'completed' ? '已完成' : 
            status === 'error' ? '错误' : '未知'
          }}
        </span>
      </div>
    </div>
    
    <!-- 右侧连接点 -->
    <Handle 
      type="source" 
      :position="Position.Right" 
      :node-id="props.id" 
    />
  </div>
</template>

<style scoped>
.process-node {
  display: flex;
  padding: 12px;
  border-radius: 8px;
  background-color: white;
  border: 2px solid #e0e0e0;
  width: 220px;
  position: relative;
  align-items: center;
}

.process-node.status-pending {
  border-color: #ffc107;
  background-color: #fff8e1;
}

.process-node.status-processing {
  border-color: #2196f3;
  background-color: #e3f2fd;
}

.process-node.status-completed {
  border-color: #4caf50;
  background-color: #e8f5e9;
}

.process-node.status-error {
  border-color: #f44336;
  background-color: #ffebee;
}

.process-icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f5f5f5;
}

.icon {
  font-size: 18px;
}

.icon.pending {
  color: #ffc107;
}

.icon.processing {
  color: #2196f3;
  animation: spin 2s linear infinite;
}

.icon.completed {
  color: #4caf50;
}

.icon.error {
  color: #f44336;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.process-content {
  flex: 1;
}

.process-title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}

.process-description {
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.process-status {
  font-size: 11px;
  color: #555;
}

.status-text {
  font-weight: bold;
}

.status-pending .status-text {
  color: #ffc107;
}

.status-processing .status-text {
  color: #2196f3;
}

.status-completed .status-text {
  color: #4caf50;
}

.status-error .status-text {
  color: #f44336;
}
</style>
