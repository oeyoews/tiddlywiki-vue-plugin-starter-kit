import { useVueFlow } from '@vue-flow/core';
import * as dagre from '@dagrejs/dagre';
import { ref } from 'vue';

export type LayoutDirection = 'LR' | 'TB';

export interface AutoLayoutOptions {
  nodeWidth?: number;
  nodeHeight?: number;
  direction?: LayoutDirection;
  nodesep?: number;
  ranksep?: number;
  marginx?: number;
  marginy?: number;
  fitViewPadding?: number;
  fitViewDelay?: number;
}

/**
 * Hook for automatic layout of Vue Flow nodes using dagre algorithm
 * @returns Functions and state for auto layout
 */
export default function useAutoLayout(defaultOptions?: AutoLayoutOptions) {
  // 默认配置
  const defaultLayoutOptions: AutoLayoutOptions = {
    nodeWidth: 180,
    nodeHeight: 80,
    direction: 'LR', // 默认水平布局（从左到右）
    nodesep: 80, // 节点之间的间距
    ranksep: 100, // 层级之间的间距
    marginx: 20, // 图形左右边距
    marginy: 20, // 图形上下边距
    fitViewPadding: 0.2, // 适应视图的内边距
    fitViewDelay: 100, // 适应视图的延迟时间
  };

  // 合并默认配置和用户配置
  const options = { ...defaultLayoutOptions, ...defaultOptions };

  // 当前布局方向
  const currentDirection = ref<LayoutDirection>(options.direction || 'LR');

  // 获取Vue Flow实例
  const { getNodes, getEdges, setNodes, fitView } = useVueFlow();

  /**
   * 执行自动布局
   * @param layoutOptions 布局选项，可覆盖默认选项
   */
  const autoLayout = (layoutOptions?: Partial<AutoLayoutOptions>) => {
    // 合并选项
    const mergedOptions = { ...options, ...layoutOptions };
    const {
      nodeWidth,
      nodeHeight,
      direction,
      nodesep,
      ranksep,
      marginx,
      marginy,
      fitViewPadding,
      fitViewDelay,
    } = mergedOptions;

    // 更新当前方向
    if (direction) {
      currentDirection.value = direction;
    }

    // 创建dagre图实例
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // 设置图形布局方向和间距
    dagreGraph.setGraph({
      rankdir: currentDirection.value, // LR: 从左到右, TB: 从上到下
      nodesep, // 节点之间的水平间距
      ranksep, // 层级之间的垂直间距
      marginx, // 图形左右边距
      marginy, // 图形上下边距
    });

    // 获取当前节点和边
    const nodes = getNodes.value;
    const edges = getEdges.value;

    // 将节点添加到dagre图中
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, {
        width: node.dimensions?.width || nodeWidth,
        height: node.dimensions?.height || nodeHeight,
      });
    });

    // 将边添加到dagre图中
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    // 使用dagre算法计算布局
    dagre.layout(dagreGraph);

    // 应用计算后的布局到节点
    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);

      // 计算节点的新位置，使其居中
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - (node.dimensions?.width || nodeWidth) / 2,
          y: nodeWithPosition.y - (node.dimensions?.height || nodeHeight) / 2,
        },
      };
    });

    // 更新节点位置
    setNodes(layoutedNodes);

    // 自动调整视图以适应所有节点
    setTimeout(() => {
      fitView({ padding: fitViewPadding });
    }, fitViewDelay);
  };

  /**
   * 切换布局方向（水平/垂直）
   */
  const toggleDirection = () => {
    // 切换方向
    const newDirection: LayoutDirection =
      currentDirection.value === 'LR' ? 'TB' : 'LR';
    currentDirection.value = newDirection;

    // 应用新的布局
    autoLayout({ direction: newDirection });
  };

  /**
   * 应用水平布局（从左到右）
   */
  const applyHorizontalLayout = () => {
    currentDirection.value = 'LR';
    autoLayout({ direction: 'LR' });
  };

  /**
   * 应用垂直布局（从上到下）
   */
  const applyVerticalLayout = () => {
    currentDirection.value = 'TB';
    autoLayout({ direction: 'TB' });
  };

  return {
    autoLayout,
    toggleDirection,
    applyHorizontalLayout,
    applyVerticalLayout,
    currentDirection,
  };
}
