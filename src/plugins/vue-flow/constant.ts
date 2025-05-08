import { MarkerType } from "@vue-flow/core";

export const initialNodes = [
  {
    id: '0',
    type: 'image',
    position: { x: 300, y: 100 },
    data: {
      label: 'TiddlyWiki节点',
      imageUrl: '/src/plugins/vue-flow/assets/tiddlywiki-icon.svg'
    },
  },
  {
    id: '1',
    type: 'start',
    position: { x: 50, y: 100 },
    data: { label: '开始节点' },
  },
  {
    id: '2',
    type: 'process',
    position: { x: 300, y: 250 },
    data: {
      label: '处理节点',
      description: '处理流程步骤',
      status: 'processing',
    },
  },
  {
    id: '3',
    type: 'text',
    position: { x: 550, y: 100 },
    data: {
      label: '文本节点',
      text: '这是一个文本节点示例'
    },
  },
  {
    id: '4',
    type: 'data',
    position: { x: 550, y: 250 },
    data: {
      label: '数据节点',
      dataType: 'JSON',
      fields: [
        { key: 'id', value: '001' },
        { key: 'name', value: '示例数据' },
      ],
    },
  },
  {
    id: '5',
    type: 'card',
    position: { x: 550, y: 400 },
    data: {
      label: '卡片节点',
      title: 'TiddlyWiki卡片',
      content: '这是一个卡片节点示例，可以用来展示重要信息。',
      tags: ['TiddlyWiki', '卡片', '示例'],
    },
  },
]

export const initialEdges = [
  // 从开始节点到图片节点
  {
    id: 'e-1-0',
    source: '1',
    target: '0',
    animated: true,
    style: { stroke: '#1890ff', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#1890ff',
      width: 16,
      height: 16,
      strokeWidth: 0.1
    }
  },
  // 从开始节点到处理节点
  {
    id: 'e-1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#1890ff', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#1890ff',
      width: 16,
      height: 16,
      strokeWidth: 0.1
    }
  },
  // 从图片节点到文本节点
  {
    id: 'e-0-3',
    source: '0',
    target: '3',
    animated: true,
    style: { stroke: '#1890ff', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#1890ff',
      width: 16,
      height: 16,
      strokeWidth: 0.1
    }
  },
  // 从处理节点到数据节点
  {
    id: 'e-2-4',
    source: '2',
    target: '4',
    animated: true,
    style: { stroke: '#1890ff', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#1890ff',
      width: 16,
      height: 16,
      strokeWidth: 0.1
    }
  },
  // 从数据节点到卡片节点
  {
    id: 'e-4-5',
    source: '4',
    target: '5',
    animated: true,
    style: { stroke: '#1890ff', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#1890ff',
      width: 16,
      height: 16,
      strokeWidth: 0.1
    }
  }
];
