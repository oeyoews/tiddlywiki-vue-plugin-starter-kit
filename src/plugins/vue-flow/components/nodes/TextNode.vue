<script setup lang="ts">
import { Position, NodeProps, Handle } from '@vue-flow/core'
import { ref } from 'vue'

// 获取节点属性
const props = defineProps<NodeProps>()

// 文本内容
const text = ref(props.data?.text || '编辑文本...')

// 编辑状态
const isEditing = ref(false)

// 开始编辑
function startEditing() {
  isEditing.value = true
}

// 结束编辑
function finishEditing() {
  isEditing.value = false
  // 更新节点数据
  if (props.data) {
    props.data.text = text.value
  }
}
</script>

<template>
  <div class="text-node">
    <!-- 输入连接点 -->
    <Handle 
      type="target" 
      :position="Position.Top" 
      :node-id="props.id" 
    />
    
    <!-- 节点内容 -->
    <div class="node-content">
      <div class="node-title">{{ props.data?.label || '文本节点' }}</div>
      
      <div v-if="isEditing" class="text-editor">
        <textarea 
          v-model="text" 
          @blur="finishEditing" 
          @keydown.enter="finishEditing"
          ref="textareaRef"
          rows="3"
        ></textarea>
      </div>
      <div v-else class="text-display" @click="startEditing">
        {{ text }}
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
.text-node {
  padding: 10px;
  border-radius: 5px;
  background-color: #e1f5fe;
  border: 1px solid #81d4fa;
  width: 200px;
  position: relative;
}

.node-title {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
  border-bottom: 1px solid #81d4fa;
  padding-bottom: 5px;
}

.text-display {
  font-size: 12px;
  padding: 5px;
  min-height: 40px;
  cursor: text;
  white-space: pre-wrap;
  word-break: break-word;
}

.text-editor textarea {
  width: 100%;
  padding: 5px;
  font-size: 12px;
  border: 1px solid #81d4fa;
  border-radius: 3px;
  resize: none;
}
</style>
