<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import Danmaku from 'danmaku-vue';

// 由于 TypeScript 类型问题，这里使用 any 类型
const danmaku = ref<any>();

type dm = {
  avatar: string;
  text: string;
  isMe?: boolean;
};

const avatar =
  'https://github.com/dshuais/danmaku-vue/blob/main/src/assets/img/default-avatar%20(1).png?raw=true';
// 示例弹幕数据
const danmus = ref<dm[]>([
  {
    text: '弹幕示例1',
    avatar,
  },
]);

// 配置
const config = reactive({
  useSlot: true,
  useSuspendSlot: true,
  isSuspend: true,
  randomChannel: true,
  loop: true,
  right: 20,
  channels: 6,
  speeds: 100,
  autoplay: true, // 自动播放
});

// 点击弹幕事件处理
function handleClickDm(dm: dm, index: number) {
  console.log('当前点击的弹幕:>> ', index, dm);
}

// 播放结束事件处理
function handlePlayEnd(index: number) {
  console.log('播放结束', index);
}

// 循环播放一轮结束事件处理
function handleListEnd() {
  console.log('循环播放一轮结束');
}

// 添加弹幕
function handleAdd(dm: dm) {
  const newDm: dm = { ...dm, isMe: true };
  danmaku.value?.insert(newDm);
}

// 组件挂载后初始化
onMounted(() => {
  // 确保弹幕容器已经渲染
  setTimeout(() => {
    // 重新计算弹幕尺寸
    danmaku.value?.resize();
    // 确保弹幕开始播放
    danmaku.value?.play();
  }, 500);
});
</script>

<template>
  <div class="danmaku-container">
    <Danmaku
      ref="danmaku"
      :danmus="danmus"
      v-bind="config"
      @dm-click="handleClickDm"
      @play-end="handlePlayEnd"
      @list-end="handleListEnd">
      <template #dm="{ danmu }">
        <div
          class="danmu-item"
          :class="[danmu.isMe ? 'btn-item--me' : '']">
          <img
            class="danmu-item--avatar"
            v-if="danmu.avatar"
            :src="danmu.avatar"
            alt="" />
          <div>{{ danmu.text }}</div>
        </div>
      </template>
      <template #suspend="{ danmu }">
        <div class="danmu-suspend">
          <div
            class="item"
            @click="handleAdd(danmu)">
            ➕
          </div>
          <div class="item">👍</div>
        </div>
      </template>
    </Danmaku>
  </div>
</template>

<style>
.danmu-item {
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 30px;
  padding: 0 10px;
  box-sizing: border-box;
}

.danmu-item:hover {
  color: #fff;
  background: rgba(0, 0, 0, 0.8);
  border: none;
}

.danmu-item--avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.btn-item--me {
  border: 1px solid #888;
  background: rgba(255, 255, 255, 0.2);
}

.danmu-suspend {
  display: flex;
  align-items: center;
  border-radius: 0 30px 30px 0;
}

.danmu-suspend .item {
  padding-left: 10px;
}

.danmu-suspend .item:nth-last-child(1):active {
  transform: scale(1.2);
}

/* 确保弹幕容器有足够的尺寸 */
.danmaku-container {
  width: 100%;
  height: 300px;
  position: relative;
}
</style>
