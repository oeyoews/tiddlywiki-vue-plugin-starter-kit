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

  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } =
    useVueFlow();

  watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? 'none' : '';
  });

  /**
   * Handles the drag start event.
   */
  function onDragStart(event: DragEvent, type: string) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type);
      event.dataTransfer.effectAllowed = 'move';
    }

    draggedType.value = type;
    isDragging.value = true;

    // 防止文本被选中
    if (event.target instanceof HTMLElement) {
      event.target.style.userSelect = 'none';
    }
    document.body.style.userSelect = 'none';

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

  function onDragLeave() {
    isDragOver.value = false;
  }

  function onDragEnd() {
    isDragging.value = false;
    isDragOver.value = false;
    draggedType.value = null;

    // 恢复文本选择
    document.body.style.userSelect = '';

    document.removeEventListener('drop', onDragEnd);
  }

  /**
   * Handles the drop event.
   */
  function onDrop(event: DragEvent) {
    event.preventDefault();

    // 如果没有拖拽类型，则不处理
    if (!draggedType.value) return;

    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    });

    const nodeId = getId();

    const newNode = {
      id: nodeId,
      type: draggedType.value,
      position,
      data: { label: `${draggedType.value} ${nodeId.split('_')[1]}` },
    };

    /**
     * Align node position after drop, so it's centered to the mouse
     *
     * We can hook into events even in a callback, and we can remove the event listener after it's been called.
     */
    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => ({
        position: {
          x: node.position.x - node.dimensions.width / 2,
          y: node.position.y - node.dimensions.height / 2,
        },
      }));

      off();
    });

    addNodes(newNode);

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
