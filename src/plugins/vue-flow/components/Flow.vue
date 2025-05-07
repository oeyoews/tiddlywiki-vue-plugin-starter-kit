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
import CardNode from './nodes/CardNode.vue';
import ProcessNode from './nodes/ProcessNode.vue';
import DataNode from './nodes/DataNode.vue';
import useDragAndDrop from '../hooks/useDnd';

// 定义节点类型
const nodeTypes = {
  default: markRaw(DefaultNode),
  text: markRaw(TextNode),
  image: markRaw(ImageNode),
  card: markRaw(CardNode),
  process: markRaw(ProcessNode),
  data: markRaw(DataNode),
};

// 初始化Vue Flow
const {
  onConnect,
  addNodes,
  addEdges,
  fitView,
  setNodes,
  setEdges,
  project,
  onNodeDragStart,
  onNodeDrag,
  onNodeDragStop,
  onPaneReady,
} = useVueFlow({
  defaultEdgeOptions: {
    animated: true,
    style: { stroke: '#1976d2', strokeWidth: 1 },
    markerEnd: 'arrow',
  },
  fitViewOnInit: true,
  minZoom: 0.5,
  maxZoom: 1.5,
});

// 初始节点数据
const initialNodes = [
  {
    id: '0',
    type: 'image',
    label: '节点 1',
    position: { x: 150, y: 250 },
    data: { label: '节点 2' },
  },
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

  // 使用onPaneReady确保画布已准备好
  onPaneReady(() => {
    setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 100);
  });
});

// 处理连接
onConnect((params) => {
  // 添加动态连接线，带箭头
  addEdges({
    ...params,
    animated: true,
    markerEnd: 'arrow', // 添加箭头
    style: { stroke: '#1976d2', strokeWidth: 1 },
  });
});

// 节点拖动相关处理
onNodeDragStart(() => {
  // 防止文本被选中
  document.body.style.userSelect = 'none';
});

onNodeDragStop(() => {
  // 恢复文本选择
  document.body.style.userSelect = '';
});

// 使用useDragAndDrop钩子获取所有拖拽相关函数
const { onDragOver, onDrop, onDragLeave, isDragOver, onDragStart, isDragging } =
  useDragAndDrop();

// 定义节点类型数据
const nodeCategories = [
  {
    title: '基础节点',
    nodes: [
      { type: 'default', icon: '📦', label: '默认节点' },
      { type: 'text', icon: '📝', label: '文本节点' },
      { type: 'image', icon: '🖼️', label: '图片节点' },
    ],
  },
  {
    title: '高级节点',
    nodes: [
      { type: 'card', icon: '🗂️', label: '卡片节点' },
      { type: 'process', icon: '⚙️', label: '流程节点' },
      { type: 'data', icon: '📊', label: '数据节点' },
    ],
  },
];

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

      <!-- 使用v-for渲染节点类别和节点 -->
      <div
        v-for="(category, categoryIndex) in nodeCategories"
        :key="categoryIndex"
        class="sidebar-section">
        <div class="section-title">{{ category.title }}</div>

        <div
          v-for="(node, nodeIndex) in category.nodes"
          :key="`${categoryIndex}-${nodeIndex}`"
          class="dnd-node"
          draggable
          @dragstart="onDragStart($event, node.type)">
          <div class="node-icon">{{ node.icon }}</div>
          <div class="node-label">{{ node.label }}</div>
        </div>
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
        :max-zoom="1.5"
        :default-edge-options="{
          animated: true,
          style: { stroke: '#1976d2', strokeWidth: 1 },
          markerEnd: 'arrow',
        }"
        class="vue-flow-wrapper">
        <Background
          pattern-color="#fff"
          :gap="8" />
        <MiniMap />
        <Controls />
        <Panel
          position="top-right"
          class="custom-panel">
          <button @click="fitView({ padding: 0.2 })">适应视图</button>
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

.sidebar-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
  padding-left: 5px;
  border-left: 3px solid #1976d2;
}

.dnd-node {
  padding: 10px;
  margin-bottom: 8px;
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
  stroke-width: 1;
  transition: stroke 0.2s ease, stroke-width 0.2s ease; /* 平滑过渡效果 */
}

:deep(.vue-flow__edge.animated .vue-flow__edge-path) {
  stroke-dasharray: 5;
  animation: dashdraw 0.5s linear infinite;
}

/* 鼠标悬停时的连接线样式 */
:deep(.vue-flow__edge:hover .vue-flow__edge-path) {
  stroke: #2196f3; /* 悬停时颜色变亮 */
  stroke-width: 3; /* 悬停时线条变粗 */
}

/* 选中的连接线样式 */
:deep(.vue-flow__edge.selected .vue-flow__edge-path) {
  stroke: #ff9800; /* 选中时为橙色 */
  stroke-width: 3; /* 选中时线条变粗 */
}

@keyframes dashdraw {
  from {
    stroke-dashoffset: 10;
  }
}

:deep(.vue-flow__handle) {
  width: 6px;
  height: 6px;
  background-color: #1976d2; /* 蓝色，与连接线颜色匹配 */
  border-radius: 50%; /* 圆形连接点 */
  border: 2px solid white; /* 白色边框 */
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); /* 轻微阴影效果 */
  transition: transform 0.2s ease, background-color 0.2s ease; /* 平滑过渡效果 */
}

/* 鼠标悬停时的连接点样式 */
:deep(.vue-flow__handle:hover) {
  background-color: #2196f3; /* 悬停时颜色变亮 */
  cursor: crosshair; /* 十字光标 */
}

/* 添加箭头样式 */
:deep(.vue-flow__edge-path) {
  marker-end: url(#vue-flow__arrowhead);
}

:deep(#vue-flow__arrowhead) {
  fill: #1976d2; /* 蓝色，与连接线颜色匹配 */
  transition: fill 0.2s ease; /* 平滑过渡效果 */
}

/* 鼠标悬停时的箭头样式 */
:deep(.vue-flow__edge:hover #vue-flow__arrowhead) {
  fill: #2196f3; /* 悬停时颜色变亮 */
}

/* 选中的箭头样式 */
:deep(.vue-flow__edge.selected #vue-flow__arrowhead) {
  fill: #ff9800; /* 选中时为橙色 */
}

/* 拖拽相关样式 */
.vue-flow-wrapper {
  width: 100%;
  height: 100%;
}

/* 禁止文本选择，防止拖拽时选中文本 */
.vue-flow-wrapper.dragging,
.vue-flow-wrapper.dragging * {
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
}

/* 拖拽时的节点样式 */
:deep(.vue-flow__node.dragging) {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

/* 拖拽预览样式 */
.dnd-preview {
  pointer-events: none;
  position: absolute;
  z-index: 1000;
  opacity: 0.8;
}
:deep(.vue-flow__node) {
  border-radius: 4px;
  padding: 0px;
  border: none;
  background: transparent;
  box-shadow: none;
}
</style>
