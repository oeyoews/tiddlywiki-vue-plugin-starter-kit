<script setup lang="ts">
import { Position, NodeProps, Handle } from '@vue-flow/core'
import { ref } from 'vue'

// 获取节点属性
const props = defineProps<NodeProps>()

// 展开/折叠状态
const isExpanded = ref(true)

// 切换展开/折叠状态
function toggleExpand() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="card-node">
    <!-- 输入连接点 -->
    <Handle 
      type="target" 
      :position="Position.Top" 
      :node-id="props.id" 
    />
    
    <!-- 节点内容 -->
    <div class="card-header">
      <div class="card-title">{{ props.data?.title || '卡片标题' }}</div>
      <button class="toggle-button" @click="toggleExpand">
        {{ isExpanded ? '▼' : '►' }}
      </button>
    </div>
    
    <div v-if="isExpanded" class="card-body">
      <div class="card-subtitle">{{ props.data?.subtitle || '副标题' }}</div>
      <div class="card-content">
        {{ props.data?.content || '这是卡片内容，可以包含详细信息。' }}
      </div>
      <div v-if="props.data?.tags && props.data.tags.length > 0" class="card-tags">
        <span v-for="(tag, index) in props.data.tags" :key="index" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>
    
    <!-- 输出连接点 -->
    <Handle 
      type="source" 
      :position="Position.Bottom" 
      :node-id="props.id" 
    />
  </div>
</template>

<style scoped>
.card-node {
  padding: 0;
  border-radius: 8px;
  background-color: white;
  border: 1px solid #e0e0e0;
  width: 220px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.card-header {
  background-color: #f5f5f5;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.card-title {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

.toggle-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-body {
  padding: 10px 15px;
}

.card-subtitle {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.card-content {
  font-size: 13px;
  line-height: 1.4;
  color: #333;
  margin-bottom: 10px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  font-size: 11px;
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
