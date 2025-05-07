<script setup lang="ts">
import { Position, NodeProps, Handle } from '@vue-flow/core'
import { ref } from 'vue'

// 获取节点属性
const props = defineProps<NodeProps>()

// 图片URL
const imageUrl = ref(props.data?.imageUrl || 'https://via.placeholder.com/150')

// 是否显示设置面板
const showSettings = ref(false)

// 新的图片URL
const newImageUrl = ref(imageUrl.value)

// 切换设置面板
function toggleSettings() {
  showSettings.value = !showSettings.value
  if (showSettings.value) {
    newImageUrl.value = imageUrl.value
  }
}

// 应用新的图片URL
function applyImageUrl() {
  imageUrl.value = newImageUrl.value
  // 更新节点数据
  if (props.data) {
    props.data.imageUrl = imageUrl.value
  }
  showSettings.value = false
}
</script>

<template>
  <div class="image-node">
    <!-- 输入连接点 -->
    <Handle 
      type="target" 
      :position="Position.Top" 
      :node-id="props.id" 
    />
    
    <!-- 节点内容 -->
    <div class="node-content">
      <div class="node-title">
        {{ props.data?.label || '图片节点' }}
        <button class="settings-button" @click="toggleSettings">⚙️</button>
      </div>
      
      <div v-if="showSettings" class="settings-panel">
        <input 
          v-model="newImageUrl" 
          placeholder="输入图片URL" 
          class="url-input"
        />
        <button @click="applyImageUrl" class="apply-button">应用</button>
      </div>
      
      <div class="image-container">
        <img :src="imageUrl" alt="节点图片" />
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
.image-node {
  padding: 10px;
  border-radius: 5px;
  background-color: #f3e5f5;
  border: 1px solid #ce93d8;
  width: 180px;
  position: relative;
}

.node-title {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
  border-bottom: 1px solid #ce93d8;
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.settings-panel {
  margin-bottom: 10px;
  padding: 5px;
  background-color: #f9f9f9;
  border-radius: 3px;
}

.url-input {
  width: 100%;
  padding: 5px;
  font-size: 12px;
  border: 1px solid #ce93d8;
  border-radius: 3px;
  margin-bottom: 5px;
}

.apply-button {
  padding: 3px 8px;
  background-color: #9c27b0;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.image-container {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}

.image-container img {
  max-width: 100%;
  max-height: 120px;
  object-fit: contain;
}
</style>
