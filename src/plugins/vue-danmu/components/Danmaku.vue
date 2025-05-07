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

// TiddlyWiki 图标作为头像
const twAvatar = 'https://tiddlywiki.com/favicon.ico';

// TiddlyWiki 相关的弹幕数据
const danmus = ref<dm[]>([
  { text: 'TiddlyWiki 是一个非线性笔记本', avatar: twAvatar },
  { text: '支持 Vue 3 组件集成', avatar: twAvatar },
  { text: '可以创建自定义插件', avatar: twAvatar },
  { text: 'Tiddlers 是 TiddlyWiki 的基本单元', avatar: twAvatar },
  { text: '使用 widget 可以扩展功能', avatar: twAvatar },
  { text: '支持 Markdown 和 WikiText 语法', avatar: twAvatar },
  { text: '可以导出为单个 HTML 文件', avatar: twAvatar },
  { text: '标签系统非常强大', avatar: twAvatar },
  { text: '可以使用筛选器查询数据', avatar: twAvatar },
  { text: '支持自定义主题和样式', avatar: twAvatar },
  { text: '可以创建宏简化操作', avatar: twAvatar },
  { text: '支持插件开发和分享', avatar: twAvatar },
  { text: 'TiddlyWiki 社区非常活跃', avatar: twAvatar },
  { text: '可以使用 Node.js 作为服务器', avatar: twAvatar },
  { text: '支持多语言界面', avatar: twAvatar },
]);

// 配置
const config = reactive({
  useSlot: true,
  useSuspendSlot: true,
  isSuspend: true,
  randomChannel: true,
  loop: true,
  right: 20,
  channels: 8, // 增加轨道数量，因为每个轨道高度变小了
  speeds: 100,
  autoplay: true, // 自动播放
  channelHeight: 30, // 设置轨道高度，默认是40
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
  height: 24px;
  text-align: center;
  line-height: 24px;
  border-radius: 24px;
  padding: 0 8px;
  box-sizing: border-box;
  font-size: 12px;
}

.danmu-item:hover {
  color: #fff;
  background: rgba(0, 0, 0, 0.8);
  border: none;
}

.danmu-item--avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
}

.btn-item--me {
  border: 1px solid #888;
  background: rgba(255, 255, 255, 0.2);
}

.danmu-suspend {
  display: flex;
  align-items: center;
  border-radius: 0 24px 24px 0;
  font-size: 12px;
}

.danmu-suspend .item {
  padding-left: 6px;
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

/* 添加弹幕按钮样式 */
.add-danmu-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
  padding: 5px 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-danmu-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
