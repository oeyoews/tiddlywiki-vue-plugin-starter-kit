import { useVueFlow } from '@vue-flow/core';
import { ref, watch } from 'vue';

let id = 0;

/**
 * @returns {string} - A unique id.
 */
function getId() {
  return `dndnode_${id++}`;
}

/**
 * In a real world scenario you'd want to avoid creating refs in a global scope like this as they might not be cleaned up properly.
 * @type {{draggedType: Ref<string|null>, isDragOver: Ref<boolean>, isDragging: Ref<boolean>}}
 */
const state = {
  /**
   * The type of the node being dragged.
   */
  draggedType: ref(null),
  isDragOver: ref(false),
  isDragging: ref(false),
};

export default function useDragAndDrop() {
  const { draggedType, isDragOver, isDragging } = state;

  const {
    addNodes,
    screenToFlowCoordinate,
    onNodesInitialized,
    updateNode,
    getNodes,
  } = useVueFlow();

  watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? 'none' : '';
  });

  /**
   * Handles the drag start event.
   */
  function onDragStart(event: DragEvent, type: string) {
    if (event.dataTransfer) {
      // 设置拖拽数据
      event.dataTransfer.setData('application/vueflow', type);
      event.dataTransfer.effectAllowed = 'move';

      // 创建拖拽预览图像
      if (event.target instanceof HTMLElement) {
        // 尝试创建一个克隆元素作为拖拽预览
        const dragPreview = event.target.cloneNode(true) as HTMLElement;
        dragPreview.style.width = `${event.target.offsetWidth}px`;
        dragPreview.style.height = `${event.target.offsetHeight}px`;
        dragPreview.style.position = 'absolute';
        dragPreview.style.top = '-1000px'; // 放在视图外
        document.body.appendChild(dragPreview);

        // 设置拖拽图像
        try {
          event.dataTransfer.setDragImage(
            dragPreview,
            event.target.offsetWidth / 2,
            event.target.offsetHeight / 2
          );
          // 在下一个事件循环中移除预览元素
          setTimeout(() => {
            document.body.removeChild(dragPreview);
          }, 0);
        } catch (error) {
          console.error('Failed to set drag image:', error);
          if (document.body.contains(dragPreview)) {
            document.body.removeChild(dragPreview);
          }
        }
      }
    }

    draggedType.value = type;
    isDragging.value = true;

    // 防止文本被选中
    if (event.target instanceof HTMLElement) {
      event.target.style.userSelect = 'none';
    }
    document.body.style.userSelect = 'none';

    // 添加全局事件监听
    document.addEventListener('dragend', onDragEnd);
    document.addEventListener('drop', onDragEnd);
  }

  /**
   * Handles the drag over event.
   */
  function onDragOver(event: DragEvent) {
    event.preventDefault();

    if (draggedType.value) {
      isDragOver.value = true;

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
    }
  }

  function onDragLeave(event: DragEvent) {
    event.preventDefault();
    isDragOver.value = false;
  }

  function onDragEnd(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    isDragging.value = false;
    isDragOver.value = false;
    draggedType.value = null;

    // 恢复文本选择
    document.body.style.userSelect = '';

    // 移除全局事件监听
    document.removeEventListener('dragend', onDragEnd);
    document.removeEventListener('drop', onDragEnd);
  }

  /**
   * Handles the drop event.
   */
  function onDrop(event: DragEvent) {
    event.preventDefault();

    // 如果没有拖拽类型，则不处理
    if (!draggedType.value) return;

    // 获取鼠标在流程图中的坐标
    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    });

    const nodeId = getId();
    const nodeType = draggedType.value;

    // 创建新节点
    const newNode = {
      id: nodeId,
      type: nodeType,
      position,
      data: {
        label: `${nodeType} ${nodeId.split('_')[1]}`,
        // 为不同类型的节点添加默认数据
        ...(nodeType === 'text' ? { text: '双击编辑文本...' } : {}),
        ...(nodeType === 'image'
          ? { imageUrl: '/src/plugins/vue-flow/assets/tiddlywiki-icon.svg' }
          : {}),
        ...(nodeType === 'card'
          ? {
              title: `卡片 ${nodeId.split('_')[1]}`,
              subtitle: '可折叠卡片',
              content: '这是卡片内容，可以包含详细信息。',
              tags: ['标签1', '标签2'],
            }
          : {}),
        ...(nodeType === 'process'
          ? {
              description: '处理流程步骤',
              status: 'pending', // 可选值: pending, processing, completed, error
            }
          : {}),
        ...(nodeType === 'data'
          ? {
              dataType: 'JSON',
              fields: [
                { key: 'id', value: '001' },
                { key: 'name', value: '示例数据' },
                { key: 'type', value: 'string' },
                { key: 'required', value: 'true' },
              ],
            }
          : {}),
      },
    };

    // 添加节点
    addNodes(newNode);

    // 在节点初始化后调整位置，使其居中于鼠标位置
    const { off } = onNodesInitialized(() => {
      // 获取所有节点
      const nodes = getNodes.value;
      // 找到刚添加的节点
      const addedNode = nodes.filter((node) => node.id === nodeId)[0];

      if (addedNode) {
        // 调整节点位置，使其居中于鼠标位置
        updateNode(nodeId, (node) => ({
          position: {
            x: node.position.x - (node.dimensions?.width || 0) / 2,
            y: node.position.y - (node.dimensions?.height || 0) / 2,
          },
        }));
      }

      // 移除监听器
      off();
    });

    // 重置拖拽状态
    onDragEnd();
  }

  return {
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
  };
}
