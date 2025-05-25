<template>
  <div class="flex h-screen">
    <!-- Sidebar Toggle Button -->
    <!-- Left Sidebar -->
    <Icons.MenuIcon
      class="cursor-pointer absolute top-6 right-6 z-20 rounded-full text-gray-800 backdrop-blur p-1 size-6 shadow"
      @click="sidebarOpen = !sidebarOpen" />
    <transition name="sidebar-slide">
      <div
        v-show="sidebarOpen"
        class="w-1/7 p-4"
        key="sidebar">
        <div class="flex items-center justify-between mb-6">
          <h2
            class="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Feeds
            <Icons.RSSIcon class="size-4" />
            <!-- <i
              class="i-[vscode-icons--file-type-rss] text-orange-400 animate-pulse"></i> -->
          </h2>
        </div>

        <!-- Search Bar -->
        <div class="mb-4 flex">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search feeds..."
            class="outline-gray-400 border w-full p-2" />
        </div>

        <!-- Add RSS Feed -->
        <div class="flex mb-4 justify-between items-center">
          <input
            v-model="newFeedUrl"
            type="text"
            placeholder="Add RSS URL"
            class="p-2 border outline-gray-400 placeholder:text-gray-400" />
          <div
            class="flex items-center bg-gray-300 ml-1 size-7 rounded-sm cursor-pointer">
            <Icons.PlusIcon @click="addFeed" />
          </div>
        </div>

        <!-- Feed List -->
        <div class="space-y-1">
          <div
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            My Feeds
          </div>
          <div
            v-for="feed in filteredFeeds"
            :key="feed.name"
            class="flex items-center group gap-1">
            <div class="flex-1">
              <FeedButton
                :feed="feed"
                :selected="selectedFeed === feed.name"
                @load="selectFeed(feed.name)" />
            </div>
          </div>
          <div class="bottom-1 absolute">
            <Icons.LogoutIcon
              class="cursor-pointer text-gray-500 size-4"
              @click="goHome" />
          </div>
        </div>
      </div>
    </transition>
    <!-- Middle Column (Article List) -->
    <div class="overflow-y-auto p-4 w-2/7 custom-scrollbar">
      <h2 class="text-lg mb-3 font-semibold">Articles</h2>
      <transition-group
        name="fade"
        tag="div">
        <ArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
          @click="selectArticle(article)" />
      </transition-group>
    </div>
    <!-- Right Column (Article Content) -->
    <div
      class="overflow-y-auto p-4 pt-0 overflow-x-hidden custom-scrollbar"
      :class="[sidebarOpen ? 'w-4/7' : 'flex-1']">
      <transition
        name="fade"
        mode="out-in">
        <div
          v-if="loadingArticle"
          key="skeleton"></div>
        <div
          v-else-if="selectedArticle"
          key="article">
          <h3 class="text-xl font-bold mb-4 -sticky py-1 top-0 z-10">
            {{ selectedArticle.title }}
          </h3>
          <div
            class="flex items-center gap-2 mb-8 text-sm text-gray-500 justify-end">
            <!-- <div class="flex items-center gap-2">
              <UserIcon class="size-4" />
              {{ selectedArticle.author || 'Unknown Author' }}
            </div> -->
            <div class="flex items-center gap-1 text-green-400 cursor-pointer">
              <Icons.SaveIcon class="size-3" />
              Save
            </div>
            <div class="h-3 w-0.5 bg-slate-300/80 rounded-full"></div>
            <div>
              <a
                v-if="selectedArticle.link"
                :href="selectedArticle.link"
                target="_blank"
                class="flex items-center gap-1 text-orange-500 hover:text-orange-600 no-underline">
                <Icons.LinkIcon class="size-4" />
                Original
              </a>
            </div>
          </div>
          <p class="text-sm text-gray-500 mb-4">
            {{ selectedArticle.author }}, {{ selectedArticle.date }}
          </p>
          <p
            v-html="selectedArticle.content"
            class="prose max-w-none"></p>
        </div>
        <div
          v-else
          key="empty">
          <div class="text-gray-400 text-center mt-20">暂无文章</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { rss2json } from '~/vue-rss-plus/utils';
import * as Icons from '@/components/Icons';
// 引入抽离的组件
import FeedButton from './FeedButton.vue';
import ArticleCard from './ArticleCard.vue';
import { rssUrls } from './mockFeeds';
import tiddlywikiIcon from '../assets/icon.svg';
const goHome = () => $tw.wiki.deleteTiddler('$:/layout');

// 获取 favicon 的工具函数（返回 base64）
async function getFaviconBase64(url: string): Promise<string> {
  try {
    const { origin } = new URL(url);
    const faviconUrl = `${origin}/favicon.ico`;
    const res = await fetch(faviconUrl);
    if (!res.ok) return '';
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return tiddlywikiIcon;
  }
}

const searchTerm = ref('');
const newFeedUrl = ref('');
const sidebarOpen = ref(true);

// 根据 rssUrls 初始化 feeds（异步获取 base64 favicon）
const feeds = ref<any[]>([]);

const filteredFeeds = computed(() => {
  return feeds.value.filter((feed) =>
    feed.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// 选中的 Feed
const selectedFeed = ref(null);

// 计算当前 feed 的文章
const articles = computed(() => {
  const feed = feeds.value.find((f) => f.name === selectedFeed.value);
  return feed ? feed.articles : [];
});

// 选中的文章
const selectedArticle = ref(null);
const loadingArticle = ref(false);

// 拉取并解析 RSS 源
async function fetchFeedArticles(feed) {
  if (!feed.url) return;
  let rssData = feed.url;
  if (window?.electronAPI) {
    rssData = await window.electronAPI?.startFetchRSSData({
      url: feed.url,
    });
  }

  if (feed.articles && feed.articles.length > 0) return;
  try {
    const { channel, items } = await rss2json(rssData);
    feed.articles = items.map((item, idx) => ({
      id: idx,
      title: item.title,
      summary: item.summary?.replace(/<[^>]+>/g, '').slice(0, 100) || '',
      author: channel.title || '',
      date: item.pubDate || '',
      content: item.summary || '',
      link: item.link,
      src: item.src,
      mp3: item.mp3,
    }));
    feed.count = feed.articles.length;
  } catch (e) {
    feed.articles = [];
    feed.count = 0;
  }
}

async function selectFeed(feedName) {
  selectedFeed.value = feedName;
  const feed = feeds.value.find((f) => f.name === feedName);
  if (feed) {
    if (!feed.articles || feed.articles.length === 0) {
      await fetchFeedArticles(feed);
    }
    selectedArticle.value =
      feed.articles && feed.articles.length > 0 ? feed.articles[0] : null;
  }
}

function selectArticle(article) {
  loadingArticle.value = true;
  setTimeout(() => {
    selectedArticle.value = article;
    loadingArticle.value = false;
  }, 100); // skeleton 显示时间，可根据需要调整
}

// 新增 RSS 源
async function addFeed() {
  const url = newFeedUrl.value.trim();
  if (!url) return;
  let name = new URL(url).hostname;
  if (feeds.value.some((f) => f.url === url || f.name === name)) {
    newFeedUrl.value = '';
    return;
  }
  const favicon = await getFaviconBase64(url);
  const feed = {
    name,
    url,
    count: 0,
    articles: [],
    favicon,
  };
  feeds.value.push(feed);
  selectedFeed.value = name;
  newFeedUrl.value = '';
  await fetchFeedArticles(feed);
  // 自动选中第一篇
  selectedArticle.value =
    feed.articles && feed.articles.length > 0 ? feed.articles[0] : null;
}

onMounted(async () => {
  // 初始化时先快速填充 feeds 列表（favicon 先留空）
  for (const url of rssUrls.filter((item) => item.startsWith('http'))) {
    let name = new URL(url).hostname;
    feeds.value.push({
      name,
      url,
      count: 0,
      articles: [],
      favicon: '',
    });
  }

  // 立即选中第一个 feed
  if (feeds.value.length > 0) {
    selectFeed(feeds.value[0].name);
  }

  // 异步逐个获取 favicon，不阻塞 UI
  feeds.value.forEach(async (feed) => {
    const favicon = await getFaviconBase64(feed.url);
    feed.favicon = favicon;
  });
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* 可选：让 transition-group 的元素淡入淡出时有更自然的动画 */
.fade-move {
  transition: transform 0.3s;
}
</style>
