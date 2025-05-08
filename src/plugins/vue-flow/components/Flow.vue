<script setup lang="ts">
import { markRaw, onMounted } from 'vue';
import { ConnectionMode, useVueFlow, VueFlow, Panel, } from '@vue-flow/core';
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
import StartNode from './nodes/StartNode.vue';
import useDragAndDrop from '../hooks/useDnD';
import { initialEdges, initialNodes, DEFAULT_MARKER_END } from '../constant/index';

// 定义节点类型
const nodeTypes = {
  default: markRaw(DefaultNode),
  text: markRaw(TextNode),
  image: markRaw(ImageNode),
  card: markRaw(CardNode),
  process: markRaw(ProcessNode),
  data: markRaw(DataNode),
  start: markRaw(StartNode),
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
    markerEnd: 'arrowclosed',
  },
  fitViewOnInit: true,
  minZoom: 0.5,
  maxZoom: 1.5,
});

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
    addEdges([{
      id: `e-${params.source}-${params.target}`,
      source: params.source,
      target: params.target,
      animated: true,
      style: { stroke: '#1890ff', strokeWidth: 2 },
      markerEnd: DEFAULT_MARKER_END
    }]);
  });
  const onNodeClick = () => { };
  const onDragEnd = () => { };

  const handleConnect = (params: any) => {
    console.log('Connection params:', params)

      addEdges([{
        id: `e-${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        animated: true,
        style: { stroke: '#1890ff', strokeWidth: 2 },
        markerEnd: DEFAULT_MARKER_END
      }])
  }

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
const { onDragOver, onDrop, onDragLeave, isDragOver, onDragStart } =
  useDragAndDrop();

// 定义节点类型数据
const nodeCategories = [
      { type: 'start', icon: '▶', label: '开始节点' },
      { type: 'default', icon: '📦', label: '默认节点' },
      { type: 'text', icon: '📝', label: '文本节点' },
      { type: 'image', icon: '🖼️', label: '图片节点' },
      { type: 'card', icon: '🗂️', label: '卡片节点' },
      { type: 'process', icon: '⚙️', label: '流程节点' },
      { type: 'data', icon: '📊', label: '数据节点' },
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
    <div class="sidebar">
      <div class="node-list">
        <div v-for="node in nodeCategories" :key="node.type" class="node-item" draggable="true"
          @dragstart="onDragStart($event, node.type)" @dragend="onDragEnd">
          <span>{{ node.icon }}</span>
          <span>{{ node.label }}</span>
        </div>
      </div>
    </div>
    <!-- Vue Flow 画布 -->
    <div class="flow-wrapper" :class="{ 'drag-over': isDragOver }">
      <VueFlow :node-types="nodeTypes" :default-zoom="0.7" :min-zoom="0.5" :max-zoom="1.5" :connect-on-drop="true"
        :snap-to-grid="true" :snap-grid="[20, 20]" :default-edge-options="{
            animated: true,
            style: { stroke: '#1890ff', strokeWidth: 2 },
            markerEnd: DEFAULT_MARKER_END
          }" :connection-mode="ConnectionMode.Loose" @drop="onDrop" @dragover="onDragOver" @dragleave="onDragLeave"
        @connect="handleConnect" @node-click="onNodeClick" :connection-radius="30" auto-connect fit-view-on-init
        class="vue-flow-wrapper">
        <Background pattern-color="#fff" :gap="8" />
        <MiniMap />
        <Controls />
        <Panel position="top-right" class="custom-panel">
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
  background-color: transparent;
  /* 移除阴影效果 */
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
  padding: 0;
  border: none;
  background: transparent;
  box-shadow: none;
}

/* 连接线基本样式 */
:deep(.vue-flow__edge-path) {
  stroke: #1890ff; /* 蓝色 */
  stroke-width: 2;
  transition: stroke 0.2s ease, stroke-width 0.2s ease; /* 平滑过渡效果 */
}

/* 动画连接线样式 */
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

/* 连接点样式 */
:deep(.vue-flow__handle) {
  width: 8px;
  height: 8px;
  background-color: #2196f3; /* 悬停时颜色变亮 */
  border-radius: 50%; /* 圆形连接点 */
  box-shadow: none; /* 移除阴影效果 */
  transition: transform 0.2s ease, background-color 0.2s ease; /* 平滑过渡效果 */
}

/* 鼠标悬停时的连接点样式 */
:deep(.vue-flow__handle:hover) {
  background-color: #2196f3; /* 悬停时颜色变亮 */
  cursor: crosshair; /* 十字光标 */
}

/* 箭头样式 */
:deep(marker[id^="vue-flow__"]) {
  fill: #1890ff; /* 蓝色，与连接线颜色匹配 */
  transition: fill 0.2s ease; /* 平滑过渡效果 */
}

/* 鼠标悬停时的箭头样式 */
:deep(.vue-flow__edge:hover marker[id^="vue-flow__"]) {
  fill: #2196f3; /* 悬停时颜色变亮 */
}

/* 选中的箭头样式 */
:deep(.vue-flow__edge.selected marker[id^="vue-flow__"]) {
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
  box-shadow: none; /* 移除阴影效果 */
  z-index: 10;
}

/* 拖拽预览样式 */
.dnd-preview {
  pointer-events: none;
  position: absolute;
  z-index: 1000;
  opacity: 0.8;
}
  .node-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;
  }

  .node-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background-color: white;
    cursor: move;
    transition: all 0.3s;
  }

  .node-item:hover {
    background-color: #ecf5ff;
    border-color: #409eff;
  }

</style>



