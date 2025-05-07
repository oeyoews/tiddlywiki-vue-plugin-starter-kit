<script setup lang="ts">
import { markRaw, onMounted } from 'vue';
import { useVueFlow, VueFlow, Panel } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
// @ts-ignore
import { MiniMap } from '@vue-flow/minimap';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

// 导入自定义节点组件
import DefaultNode from './nodes/DefaultNode.vue';
import TextNode from './nodes/TextNode.vue';
import ImageNode from './nodes/ImageNode.vue';
import useDragAndDrop from '../hooks/useDnd';

// 定义节点类型
const nodeTypes = {
  default: markRaw(DefaultNode),
  text: markRaw(TextNode),
  image: markRaw(ImageNode),
};

// 初始化Vue Flow
const { onConnect, addNodes, addEdges, fitView, setNodes, setEdges, project } =
  useVueFlow();

// 初始节点数据
const initialNodes = [
  {
    id: '1',
    type: 'default',
    label: '节点 1',
    position: { x: 50, y: 50 },
    data: { label: '节点 1' },
  },
];

// 初始边数据
const initialEdges = [];

// 设置初始节点和边
onMounted(() => {
  setNodes(initialNodes);
  setEdges(initialEdges);
  setTimeout(() => {
    fitView();
  }, 0);
});

// 处理连接
onConnect((params) => {
  // 添加动态连接线，带箭头
  addEdges({
    ...params,
    animated: true,
    markerEnd: 'arrow', // 添加箭头
  });
});
// 使用useDragAndDrop钩子获取所有拖拽相关函数
const { onDragOver, onDrop, onDragLeave, isDragOver, onDragStart } =
  useDragAndDrop();

// 定义组件可接收的属性
defineProps<{
  // 添加你需要的属性，并提供默认值
  title?: string;
  theme?: string;
  showLogos?: boolean;
}>();
</script>

<template>
  <div class="flow-container">
    <!-- 侧边栏 - 可拖拽节点 -->
    <div class="sidebar">
      <div class="sidebar-title">节点类型</div>
      <div
        class="dnd-node"
        draggable
        @dragstart="onDragStart($event, 'default')">
        <div class="node-icon">📦</div>
        <div class="node-label">默认节点</div>
      </div>
      <div
        class="dnd-node"
        draggable
        @dragstart="onDragStart($event, 'text')">
        <div class="node-icon">📝</div>
        <div class="node-label">文本节点</div>
      </div>
      <div
        class="dnd-node"
        draggable
        @dragstart="onDragStart($event, 'image')">
        <div class="node-icon">🖼️</div>
        <div class="node-label">图片节点</div>
      </div>
    </div>

    <!-- Vue Flow 画布 -->
    <div
      class="flow-wrapper"
      @dragover="onDragOver"
      @drop="onDrop"
      @dragleave="onDragLeave"
      :class="{ 'drag-over': isDragOver }">
      <VueFlow
        :node-types="nodeTypes"
        :default-zoom="1"
        :min-zoom="0.5"
        :max-zoom="1.5">
        <Background
          pattern-color="#fff"
          :gap="8" />
        <MiniMap />
        <Controls />
        <Panel
          position="top-right"
          class="custom-panel">
          <button @click="fitView()">适应视图</button>
        </Panel>
      </VueFlow>
    </div>
  </div>
</template>

<style scoped>
.flow-container {
  display: flex;
  width: 100%;
  height: 780px;
  border: 2px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.sidebar {
  width: 180px;
  background-color: #f8f8f8;
  padding: 15px;
  border-right: 1px solid #ddd;
  box-shadow: inset -2px 0 5px rgba(0, 0, 0, 0.05);
}

.sidebar-title {
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #1976d2;
  color: #1976d2;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.sidebar-title::before {
  content: '🔄';
  margin-right: 8px;
  font-size: 18px;
}

.dnd-node {
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  cursor: grab;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.dnd-node:hover {
  background-color: #f0f8ff;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(25, 118, 210, 0.15);
  border-color: #1976d2;
}

.node-icon {
  font-size: 18px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-label {
  font-size: 14px;
}

.flow-wrapper {
  flex: 1;
  height: 100%;
  position: relative;
  transition: all 0.2s ease;
}

.flow-wrapper.drag-over {
  background-color: rgba(25, 118, 210, 0.05);
  box-shadow: inset 0 0 20px rgba(25, 118, 210, 0.2);
}

.custom-panel button {
  padding: 6px 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.custom-panel button:hover {
  background-color: #45a049;
}

:deep(.vue-flow__node) {
  border-radius: 4px;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.vue-flow__edge-path) {
  stroke: #1976d2; /* 蓝色 */
  stroke-width: 2;
}

:deep(.vue-flow__edge.animated .vue-flow__edge-path) {
  stroke-dasharray: 5;
  animation: dashdraw 0.5s linear infinite;
}

@keyframes dashdraw {
  from {
    stroke-dashoffset: 10;
  }
}

:deep(.vue-flow__handle) {
  width: 8px;
  height: 8px;
  background-color: #1976d2; /* 蓝色，与连接线颜色匹配 */
}

/* 添加箭头样式 */
:deep(.vue-flow__edge-path) {
  marker-end: url(#vue-flow__arrowhead);
}

:deep(#vue-flow__arrowhead) {
  fill: #1976d2; /* 蓝色，与连接线颜色匹配 */
}
</style>
