<script setup lang="ts">
import { Position, NodeProps, Handle } from '@vue-flow/core'
import { ref } from 'vue'

// 获取节点属性
const props = defineProps<NodeProps>()

// 编辑状态
const isEditing = ref(false)
const editValue = ref('')

// 开始编辑
function startEdit(key: string) {
  if (!props.data || !props.data.fields) return
  
  const field = props.data.fields.find(f => f.key === key)
  if (field) {
    editValue.value = field.value
    isEditing.value = true
  }
}

// 保存编辑
function saveEdit(key: string) {
  if (!props.data || !props.data.fields) return
  
  const fieldIndex = props.data.fields.findIndex(f => f.key === key)
  if (fieldIndex !== -1) {
    props.data.fields[fieldIndex].value = editValue.value
  }
  
  isEditing.value = false
}
</script>

<template>
  <div class="data-node">
    <!-- 输入连接点 -->
    <Handle 
      type="target" 
      :position="Position.Top" 
      :node-id="props.id" 
    />
    
    <!-- 节点内容 -->
    <div class="data-header">
      <div class="data-type">{{ props.data?.dataType || '数据' }}</div>
      <div class="data-name">{{ props.data?.label || '数据节点' }}</div>
    </div>
    
    <div class="data-fields">
      <div v-if="!props.data?.fields || props.data.fields.length === 0" class="no-fields">
        无数据字段
      </div>
      <div 
        v-else
        v-for="field in props.data.fields" 
        :key="field.key"
        class="field-row"
      >
        <div class="field-key">{{ field.key }}:</div>
        <div 
          v-if="isEditing && editValue === field.value" 
          class="field-value-edit"
        >
          <input 
            v-model="editValue" 
            @blur="saveEdit(field.key)"
            @keyup.enter="saveEdit(field.key)"
            ref="inputRef"
          />
        </div>
        <div 
          v-else
          class="field-value"
          @dblclick="startEdit(field.key)"
        >
          {{ field.value }}
        </div>
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
.data-node {
  padding: 0;
  border-radius: 6px;
  background-color: white;
  border: 1px solid #9c27b0;
  width: 200px;
  overflow: hidden;
  position: relative;
}

.data-header {
  background-color: #9c27b0;
  color: white;
  padding: 8px 12px;
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
</style>
