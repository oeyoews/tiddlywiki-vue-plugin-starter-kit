<script setup lang="ts">
import { markRaw, onMounted, ref } from 'vue';
import {
  ConnectionMode,
  useVueFlow,
  VueFlow,
  Panel,
  Position,
} from '@vue-flow/core';
// import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
// @ts-ignore
// import { MiniMap } from '@vue-flow/minimap';

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
import useAutoLayout from '../hooks/useAutoLayout';
import { DEFAULT_MARKER_END } from '../constant/index';

import { type FlowProps } from '@/plugins/vue-flow/vue-flow-types';

const props = defineProps<FlowProps>();

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
  addEdges,
  fitView,
  setNodes,
  setEdges,
  onNodeDragStart,
  onNodeDragStop,
  onPaneReady,
} = useVueFlow({
  id: 'tiddlywiki-flow', // 添加唯一ID
  defaultEdgeOptions: {
    animated: true,
    style: { stroke: '#1976d2', strokeWidth: 1 },
    markerEnd: 'arrowclosed',
  },
  fitViewOnInit: true,
  minZoom: 0.5,
  maxZoom: 1.0,
});

// 设置初始节点和边
onMounted(() => {
  setNodes(props.data.nodes);
  setEdges(props.data.edges);

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
  addEdges([
    {
      id: `e-${params.source}-${params.target}`,
      source: params.source,
      target: params.target,
      animated: true,
      style: { stroke: '#1890ff', strokeWidth: 2 },
      markerEnd: DEFAULT_MARKER_END,
    },
  ]);
});
const onNodeClick = () => {};
const onDragEnd = () => {};

const handleConnect = (params: any) => {
  console.log('Connection params:', params);

  addEdges([
    {
      id: `e-${params.source}-${params.target}`,
      source: params.source,
      target: params.target,
      animated: true,
      style: { stroke: '#1890ff', strokeWidth: 2 },
      markerEnd: DEFAULT_MARKER_END,
    },
  ]);
};

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
  { type: 'start', icon: '📦', label: '开始节点' },
  // { type: 'default', icon: '▶', label: '默认节点' },
  // { type: 'text', icon: '📝', label: '文本节点' },
  // { type: 'image', icon: '🖼️', label: '图片节点' },
  // { type: 'card', icon: '🗂️', label: '卡片节点' },
  // { type: 'process', icon: '⚙️', label: '流程节点' },
  { type: 'data', icon: '📊', label: 'Tiddler节点' },
];

// 检测是否为小屏幕设备（宽度小于768px）
const isSmallScreen = ref(window.innerWidth < 768);

// 监听窗口大小变化
window.addEventListener('resize', () => {
  const wasSmallScreen = isSmallScreen.value;
  isSmallScreen.value = window.innerWidth < 768;

  // 如果从大屏幕变为小屏幕，自动隐藏侧边栏
  if (!wasSmallScreen && isSmallScreen.value) {
    showSidebar.value = false;
  }
});

// 定义侧边栏显示状态，小屏幕默认隐藏
const showSidebar = ref(false);

// 切换侧边栏显示/隐藏
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

// 使用自动排序hook
const { applyHorizontalLayout, applyVerticalLayout } = useAutoLayout({
  // 默认使用水平布局
  direction: 'LR',
  nodeWidth: 180,
  nodeHeight: 80,
  nodesep: 80,
  ranksep: 100,
});
</script>

<template>
  <div class="flow-container">
    <!-- 侧边栏 -->
    <div
      class="sidebar"
      :class="{ hidden: !showSidebar }">
      <div class="sidebar-header">
        <div class="sidebar-title">TiddlyWiki 流程图</div>
        <button
          class="sidebar-toggle-inside"
          @click="toggleSidebar">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
              fill="currentColor" />
          </svg>
        </button>
      </div>
      <div class="node-list">
        <div
          v-for="node in nodeCategories"
          :key="node.type"
          class="node-item"
          draggable="true"
          @dragstart="onDragStart($event, node.type)"
          @dragend="onDragEnd">
          <span class="node-icon">{{ node.icon }}</span>
          <span class="node-label">{{ node.label }}</span>
        </div>
      </div>
    </div>

    <button
      v-if="!showSidebar"
      class="sidebar-toggle"
      @click="toggleSidebar">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"
          fill="currentColor" />
      </svg>
    </button>

    <!-- Vue Flow 画布 -->
    <div
      class="flow-wrapper"
      :class="{ 'drag-over': isDragOver, 'with-sidebar': showSidebar }">
      <VueFlow
        id="tiddlywiki-flow"
        :node-types="nodeTypes"
        :default-zoom="0.7"
        :min-zoom="0.5"
        :max-zoom="1.5"
        :connect-on-drop="true"
        :snap-to-grid="true"
        :snap-grid="[20, 20]"
        :default-edge-options="{
          animated: true,
          style: { stroke: '#1890ff', strokeWidth: 2 },
          markerEnd: DEFAULT_MARKER_END,
        }"
        :connection-mode="ConnectionMode.Loose"
        @drop="onDrop"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @connect="handleConnect"
        @node-click="onNodeClick"
        :connection-radius="30"
        auto-connect
        fit-view-on-init
        class="vue-flow-wrapper"
        style="height: 100%; width: 100%">
        <!-- <Background pattern-color="#fff" :gap="8" /> -->
        <!-- <MiniMap /> -->
        <Controls position="top-center" />
        <Panel
          position="top-right"
          class="custom-panel">
          <div class="panel-buttons">
            <button @click="fitView({ padding: 0.2 })">适应视图</button>
            <button
              @click="applyHorizontalLayout"
              class="auto-layout-btn">
              水平排序
            </button>
            <!-- <button
              @click="applyVerticalLayout"
              class="auto-layout-btn vertical-btn">
              垂直排序
            </button> -->
          </div>
        </Panel>
      </VueFlow>
    </div>
  </div>
</template>

<style scoped>
.flow-container {
  width: 100%;
  height: 98vh; /* 明确设置高度为视口高度 */
  border: none;
  border-radius: 0;
  overflow: auto;
  position: relative;
  background-color: #ffffff;
  overflow: hidden;
}

.sidebar-toggle {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 100;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sidebar-toggle:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}

.sidebar {
  width: 260px;
  background-color: #f8f8f8;
  color: #333;
  /* height: 100%; */
  padding: 0;
  display: flex;
  flex-direction: column;
  z-index: 50;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0px;
  border: 2px solid #ddd;
  border-radius: 5px;
}

/* 小屏幕设备上的侧边栏样式 */
@media (max-width: 767px) {
  .sidebar {
    width: 240px;
  }
}

.sidebar.hidden {
  transform: translateX(-100%);
  width: 0;
  opacity: 0;
}

.sidebar-header {
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-title {
  font-weight: 600;
  font-size: 16px;
  color: #1976d2;
  display: flex;
  align-items: center;
}

.sidebar-toggle-inside {
  width: 24px;
  height: 24px;
  border: none;
  cursor: pointer;
  display: flex;
  background-color: transparent;
  align-items: center;
  justify-content: center;
}

.sidebar-toggle-inside:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
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
  transition: all 0.3s all;
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

/* 节点图标和标签样式已移至底部 */

.flow-wrapper {
  flex: 1;
  position: relative;
  transition: margin-left 0.3s ease;
  margin-left: 0;
  background-color: #ffffff;
  width: 100%;
  height: 100vh; /* 明确设置高度为视口高度 */
  min-height: 500px; /* 设置最小高度，确保在任何情况下都有足够的空间 */
}

.flow-wrapper.with-sidebar {
  margin-left: 260px;
  width: calc(100% - 260px);
}

/* 小屏幕设备上的流程图画布样式 */
@media (max-width: 767px) {
  .flow-wrapper.with-sidebar {
    margin-left: 240px;
    width: calc(100% - 240px);
  }
}

.flow-wrapper.drag-over {
  background-color: transparent;
  /* 移除阴影效果 */
}

.custom-panel .panel-buttons {
  display: flex;
  gap: 8px;
}

.custom-panel button {
  padding: 6px 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.custom-panel button:hover {
  background-color: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-panel .auto-layout-btn {
  background-color: #2196f3;
}

.custom-panel .auto-layout-btn:hover {
  background-color: #0b7dda;
}

.custom-panel .vertical-btn {
  background-color: #ff9800;
}

.custom-panel .vertical-btn:hover {
  background-color: #e68a00;
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
:deep(marker[id^='vue-flow__']) {
  fill: #1890ff; /* 蓝色，与连接线颜色匹配 */
  transition: fill 0.2s ease; /* 平滑过渡效果 */
}

/* 鼠标悬停时的箭头样式 */
:deep(.vue-flow__edge:hover marker[id^='vue-flow__']) {
  fill: #2196f3; /* 悬停时颜色变亮 */
}

/* 选中的箭头样式 */
:deep(.vue-flow__edge.selected marker[id^='vue-flow__']) {
  fill: #ff9800; /* 选中时为橙色 */
}

/* 拖拽相关样式 */
.vue-flow-wrapper {
  width: 100%;
  height: 100vh; /* 明确设置高度为视口高度 */
  min-height: 500px; /* 设置最小高度 */
  display: block; /* 确保元素是块级元素 */
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
  padding: 8px 10px;
  overflow-y: auto;
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

.node-icon {
  font-size: 16px;
}

.node-label {
  font-size: 14px;
}
:deep(.vue-flow__controls) {
  display: flex;
}
</style>
