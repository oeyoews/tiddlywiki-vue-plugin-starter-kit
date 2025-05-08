import { MarkerType } from '@vue-flow/core';

// 定义箭头标记常量
export const DEFAULT_MARKER_END = {
  type: MarkerType.ArrowClosed,
  color: '#1890ff',
  width: 16,
  height: 16,
  strokeWidth: 0.1,
};

// 初始节点数据
export const initialNodes = [
  {
    id: '1',
    type: 'start',
    position: { x: 20, y: 250 },
    data: { label: 'TiddlyWiki简介' },
  },
  {
    id: '0',
    type: 'image',
    position: { x: 320, y: 50 },
    data: {
      label: 'TiddlyWiki Logo',
      imageUrl: '/src/plugins/vue-flow/assets/tiddlywiki-icon.svg',
    },
  },
  {
    id: '3',
    type: 'text',
    position: { x: 620, y: 0 },
    data: {
      label: 'TiddlyWiki核心概念',
      text: `TiddlyWiki的核心概念：

1. Tiddler：独立的内容片段，类似于卡片或笔记
2. Tag：用于组织和分类Tiddler的标签系统
3. WikiText：TiddlyWiki的标记语言，用于格式化内容
4. Transclusion：在一个Tiddler中嵌入另一个Tiddler的内容
5. Filter：用于查询和筛选Tiddler的表达式`,
    },
  },
  {
    id: '2',
    type: 'process',
    position: { x: 280, y: 250 },
    data: {
      label: 'TiddlyWiki工作流程',
      description: '创建、编辑、组织和保存知识的流程',
      status: 'processing',
    },
  },
  {
    id: '4',
    type: 'data',
    position: { x: 620, y: 250 },
    data: {
      label: 'TiddlyWiki数据结构',
      dataType: 'Tiddler',
      fields: {
        tags: ['插件', '扩展', '社区'],
        created: '20250508020312652',
        title: 'TiddlyWiki数据结构',
        description: 'tiddler desc',
      },
    },
  },
  {
    id: '5',
    type: 'card',
    position: { x: 920, y: 295 },
    data: {
      label: 'TiddlyWiki插件系统',
      title: '插件生态系统',
      content:
        'TiddlyWiki拥有丰富的插件生态系统，可以扩展其功能。常见插件包括：Markdown支持、任务管理、图表生成、主题美化等。',
      tags: ['插件', '扩展', '社区'],
    },
  },
  {
    id: '6',
    type: 'text',
    position: { x: 320, y: 490 },
    data: {
      label: 'TiddlyWiki历史',
      text: `TiddlyWiki的发展历程：

2004年：由Jeremy Ruston创建，作为一个单文件的非线性笔记本。
2007年：TiddlyWiki获得了Osmosoft的支持。
2011年：发布了TiddlySpace，一个基于TiddlyWiki的托管服务。
2013年：TiddlyWiki 5发布，完全重写，使用JavaScript和HTML5。
2014年：引入了插件系统，大大增强了扩展性。
2015-2020：社区蓬勃发展，出现了大量插件和主题。
2021年至今：持续发展，成为个人知识管理的重要工具。`,
    },
  },
  {
    id: '7',
    type: 'card',
    position: { x: 620, y: 550 },
    data: {
      label: 'TiddlyWiki使用场景',
      title: '应用场景',
      content:
        'TiddlyWiki适用于多种场景：个人知识管理、项目文档、研究笔记、日记、任务管理、写作、教学材料整理等。',
      tags: ['应用', '场景', '实践'],
    },
  },
  {
    id: '8',
    type: 'process',
    position: { x: 920, y: 600 },
    data: {
      label: 'TiddlyWiki保存方式',
      description: '单文件保存、Node.js服务器、TiddlyHost等多种保存方式',
      status: 'success',
    },
  },
];

// 初始边数据 - 每个节点只有一个入边（除了开始节点）
export const initialEdges = [
  // 从简介到Logo
  {
    id: 'e-1-0',
    source: '1',
    target: '0',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#1890ff', strokeWidth: 2 },
    markerEnd: DEFAULT_MARKER_END,
  },
  // 从简介到工作流程
  {
    id: 'e-1-2',
    source: '1',
    target: '2',
    animated: true,
    type: 'smoothstep',
    style: { stroke: '#1890ff', strokeWidth: 2 },
    markerEnd: DEFAULT_MARKER_END,
  },
  // 从Logo到核心概念
  {
    id: 'e-0-3',
    source: '0',
    target: '3',
    animated: true,
    type: 'smoothstep',
    style: { stroke: '#1890ff', strokeWidth: 2 },
    markerEnd: DEFAULT_MARKER_END,
  },
  // 从工作流程到数据结构
  {
    id: 'e-2-4',
    source: '2',
    target: '4',
    animated: true,
    type: 'straight',
    style: { stroke: '#1890ff', strokeWidth: 2 },
    markerEnd: DEFAULT_MARKER_END,
  },
  // 从数据结构到插件系统
  {
    id: 'e-4-5',
    source: '4',
    target: '5',
    animated: true,
    type: 'smoothstep',
    style: { stroke: '#1890ff', strokeWidth: 2 },
    markerEnd: DEFAULT_MARKER_END,
  },
  // 从Logo到历史
  {
    id: 'e-0-6',
    source: '0',
    target: '6',
    animated: true,
    type: 'smoothstep',
    style: { stroke: '#1890ff', strokeWidth: 2 },
    markerEnd: DEFAULT_MARKER_END,
  },
  // 从历史到使用场景
  {
    id: 'e-6-7',
    source: '6',
    target: '7',
    animated: true,
    type: 'smoothstep',
    style: { stroke: '#1890ff', strokeWidth: 2 },
    markerEnd: DEFAULT_MARKER_END,
  },
  // 从使用场景到保存方式
  {
    id: 'e-7-8',
    source: '7',
    target: '8',
    animated: true,
    type: 'straight',
    style: { stroke: '#1890ff', strokeWidth: 2 },
    markerEnd: DEFAULT_MARKER_END,
  },
];
