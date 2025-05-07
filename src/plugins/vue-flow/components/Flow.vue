<script setup lang="ts">
import { ref, markRaw, onMounted } from 'vue';
import { useVueFlow, VueFlow, Panel } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

// 导入自定义节点组件
import DefaultNode from './nodes/DefaultNode.vue';
import TextNode from './nodes/TextNode.vue';
import ImageNode from './nodes/ImageNode.vue';

// 定义节点类型
const nodeTypes = {
  default: markRaw(DefaultNode),
  text: markRaw(TextNode),
  image: markRaw(ImageNode),
};

// 初始化Vue Flow
const {
  onNodesChange,
  onEdgesChange,
  onConnect,
  addNodes,
  addEdges,
  nodes,
  edges,
  fitView,
  setNodes,
  setEdges,
  getIntersectingNodes,
  project,
} = useVueFlow();

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
  addEdges(params);
});

// 处理拖拽开始
function onDragStart(event: DragEvent, nodeType: string) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }
}

// 处理拖拽结束
function onDragOver(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}

// 处理放置
function onDrop(event: DragEvent) {
  event.preventDefault();

  // 获取拖拽的节点类型
  const nodeType = event.dataTransfer?.getData('application/vueflow');

  if (!nodeType) return;

  // 获取画布的DOM元素
  const wrapper = document.querySelector('.vue-flow');
  if (!wrapper) return;

  // 获取画布的位置和大小
  const wrapperBounds = wrapper.getBoundingClientRect();

  // 计算放置位置
  const position = project({
    x: event.clientX - wrapperBounds.left,
    y: event.clientY - wrapperBounds.top,
  });

  // 创建新节点
  const newNode = {
    id: `node_${Date.now()}`,
    type: nodeType,
    position,
    data: { label: `${nodeType} 节点` },
  };

  // 添加新节点
  addNodes(newNode);
}

// 定义组件可接收的属性
const props = defineProps<{
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
        默认节点
      </div>
      <div
        class="dnd-node"
        draggable
        @dragstart="onDragStart($event, 'text')">
        文本节点
      </div>
      <div
        class="dnd-node"
        draggable
        @dragstart="onDragStart($event, 'image')">
        图片节点
      </div>
    </div>

    <!-- Vue Flow 画布 -->
    <div
      class="flow-wrapper"
      @dragover="onDragOver"
      @drop="onDrop">
      <VueFlow
        :node-types="nodeTypes"
        :default-zoom="1"
        :min-zoom="0.2"
        :max-zoom="4">
        <Background
          pattern-color="#aaa"
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
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.sidebar {
  width: 150px;
  background-color: #f8f8f8;
  padding: 10px;
  border-right: 1px solid #ddd;
}

.sidebar-title {
  font-weight: bold;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
}

.dnd-node {
  padding: 10px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: grab;
  transition: all 0.2s;
}

.dnd-node:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.flow-wrapper {
  flex: 1;
  height: 100%;
  position: relative;
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
  stroke: #555;
  stroke-width: 2;
}

:deep(.vue-flow__handle) {
  width: 8px;
  height: 8px;
  background-color: #555;
}
</style>
