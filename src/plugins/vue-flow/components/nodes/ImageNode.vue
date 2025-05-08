<script setup lang="ts">
import { Position, NodeProps, Handle } from '@vue-flow/core';
import { ref, computed } from 'vue';

// 获取节点属性
const props = defineProps<NodeProps>();

// 默认TiddlyWiki SVG图标路径
const defaultSvgPath = '/src/plugins/vue-flow/assets/tiddlywiki-icon.svg';

// 图片URL
const imageUrl = ref(props.data?.imageUrl || defaultSvgPath);

// 是否显示设置面板
const showSettings = ref(false);

// 新的图片URL
const newImageUrl = ref(imageUrl.value);

// 判断是否为SVG图标
const isSvgIcon = computed(() => {
  return imageUrl.value === defaultSvgPath || imageUrl.value.endsWith('.svg');
});

// 切换设置面板
function toggleSettings() {
  showSettings.value = !showSettings.value;
  if (showSettings.value) {
    newImageUrl.value = imageUrl.value;
  }
}

// 应用新的图片URL
function applyImageUrl() {
  imageUrl.value = newImageUrl.value;
  // 更新节点数据
  if (props.data) {
    props.data.imageUrl = imageUrl.value;
  }
  showSettings.value = false;
}
</script>

<template>
  <div class="image-node">
    <!-- 输入连接点 -->
    <Handle
      type="target"
      :position="Position.Left"
      :node-id="props.id" />

    <!-- 节点内容 -->
    <div class="node-content">
      <div class="node-title">
        {{ props.data?.label || '图片节点' }}
        <button
          class="settings-button"
          @click="toggleSettings">
          ⚙️
        </button>
      </div>

      <div
        v-if="showSettings"
        class="settings-panel">
        <input
          v-model="newImageUrl"
          placeholder="输入图片URL"
          class="url-input" />
        <button
          @click="applyImageUrl"
          class="apply-button">
          应用
        </button>
      </div>

      <div class="image-container">
        <!-- 如果是SVG图标，使用内联SVG显示 -->
        <div v-if="isSvgIcon" class="svg-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" class="tiddlywiki-icon">
            <path fill="#9c27b0" d="m12 0l10.23 6v12L12 24L1.77 18V6zm3.961 17.889l.154-.02c.113-.043.22-.081.288-.19c.227-.329-.357-.462-.566-.827s-1.071-2.364-.418-2.924s1.359-.79 1.629-1.315c.117-.236.238-.475.269-.742c.159.132.283.255.497.262c.567.036 1.054-.658 1.307-1.315c.135-.404.244-.832.218-1.226c-.069-.76.013-1.582.62-2.087c-.599.302-1.167.69-1.845.789c-.374-.114-.75-.216-1.147-.2c-.194-.253-.456-.727-.797-.782c-.58.208-.597 1.105-.842 2.321a5.4 5.4 0 0 0-1.154-.193c-.54-.035-1.42.134-2.038.116c-.619-.018-1.836-.562-2.849-.445c-.407.05-.817.12-1.195.291c-.231.105-.565.421-.733.468c-1.69.473-4.442.453-3.879-2.102c.044-.196.056-.373-.03-.417c-.11-.055-.17.06-.234.187c-.985 2.138.764 3.514 2.752 3.52c.625-.048.324-.007.904-.118l-.015.082a1.87 1.87 0 0 0 .865 1.718c-.27.771-.805 1.389-1.173 2.097c.138.881 1.031 2.057 1.4 2.225c.326.147 1.036.149 1.2-.089c.059-.111.02-.351-.044-.474c.277.308.651.736 1.013.942c.217.104.434.17.677.18l.31-.016c.154-.033.336-.058.44-.195c.116-.2.007-.756-.476-.796s-.795-.222-1.24-.882c-.365-.638.077-1.517.226-2.145c.765.123 1.535.22 2.31.222c.336-.017.67-.03 1.001-.093c.106.27.402 1.025.404 1.239c.007.601-.219 1.205-.121 1.807c.06.177.005.512.35.526l.388.018l.267-.008c.341.573.637.572 1.307.591m-7.518-1.66l-.063-.056c-.184-.198-.66-.544-.572-.865c.075-.238.213-.457.323-.683l-.004.023c-.02.282-.059.56.032.837c.278.228.663.59.918.837c-.138-.038-.4-.117-.53-.066l-.104-.026z"/>
          </svg>
        </div>
        <!-- 否则显示普通图片 -->
        <img
          v-else
          :src="imageUrl"
          alt="节点图片" />
      </div>
    </div>

    <!-- 输出连接点 -->
    <Handle
      type="source"
      :position="Position.Right"
      :node-id="props.id" />
  </div>
</template>

<style scoped>
.image-node {
  padding: 10px;
  border-radius: 5px;
  background-color: #f3e5f5;
  border: 1px solid #ce93d8;
  width: 180px;
  position: relative;
}

.node-title {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
  border-bottom: 1px solid #ce93d8;
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.settings-panel {
  margin-bottom: 10px;
  padding: 5px;
  background-color: #f9f9f9;
  border-radius: 3px;
}

.url-input {
  width: 100%;
  padding: 5px;
  font-size: 12px;
  border: 1px solid #ce93d8;
  border-radius: 3px;
  margin-bottom: 5px;
}

.apply-button {
  padding: 3px 8px;
  background-color: #9c27b0;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.image-container {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}

.image-container img {
  max-width: 100%;
  max-height: 120px;
  object-fit: contain;
}

.svg-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.tiddlywiki-icon {
  /* 移除阴影效果 */
  transition: transform 0.3s ease;
}

.tiddlywiki-icon:hover {
  transform: scale(1.1);
  /* 移除悬停时的阴影效果 */
}
</style>
