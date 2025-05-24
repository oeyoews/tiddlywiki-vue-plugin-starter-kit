<template>
  <div
    class="flex h-screen bg-gradient-to-tr from-blue-50 via-white to-purple-100">
    <!-- Left Sidebar -->
    <div
      class="w-64 p-4 shadow-xl rounded-r-3xl bg-white/80 backdrop-blur-md border-r border-blue-100">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          Feeds
          <i
            class="i-[vscode-icons--file-type-rss] text-orange-400 animate-pulse"></i>
        </h2>
      </div>

      <!-- Search Bar -->
      <div class="relative mb-4">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search feeds..."
          class="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/70 backdrop-blur placeholder:text-gray-400" />
      </div>

      <!-- Add RSS Feed -->
      <div class="flex mb-4 space-x-2">
        <input
          v-model="newFeedUrl"
          type="text"
          placeholder="Add RSS URL"
          class="flex-1 p-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/70 backdrop-blur placeholder:text-gray-400" />
        <button
          class=""
          @click="addFeed"
          :disabled="!newFeedUrl.trim()">
          <i class="i-[material-symbols--add-rounded]"></i>
          Add
        </button>
      </div>

      <!-- Feed List -->
      <div class="space-y-1">
        <div
          class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
          My Feeds
        </div>
        <div
          v-for="feed in filteredFeeds"
          :key="feed.name"
          class="flex items-center group gap-1">
          <div class="flex-1 min-w-0">
            <FeedButton
              :feed="feed"
              :selected="selectedFeed === feed.name"
              @load="selectFeed(feed.name)"
              class="w-full transition-all duration-150 rounded-xl shadow-sm border border-transparent px-2 py-1 cursor-pointer bg-white/80 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 hover:shadow-md hover:border-blue-200 group-hover:scale-[1.02] group-hover:z-10 group-hover:ring-2 group-hover:ring-blue-100"
              :class="
                selectedFeed === feed.name
                  ? 'bg-gradient-to-r from-blue-200 to-purple-200 border-blue-400 shadow-lg scale-105 ring-2 ring-blue-200 text-blue-900 font-bold'
                  : 'text-gray-700'
              " />
          </div>
        </div>
      </div>
    </div>

    <!-- Middle Column (Article List) -->
    <div
      class="flex-1 overflow-y-auto p-6 bg-white/60 backdrop-blur-lg rounded-xl mx-4 shadow-lg border border-blue-50">
      <h2 class="text-lg font-semibold mb-4 text-blue-700 drop-shadow">
        Articles
      </h2>
      <div>
        <ArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
          @click="selectArticle(article)" />
      </div>
    </div>

    <!-- Right Column (Article Content) -->
    <div
      class="w-1/2 overflow-y-auto bg-white/80 backdrop-blur-lg p-8 shadow-2xl rounded-l-3xl border-l border-purple-100">
      <template v-if="selectedArticle">
        <h2 class="text-2xl font-bold mb-4 text-purple-700 drop-shadow">
          {{ selectedArticle.title }}
        </h2>
        <p class="text-sm text-gray-500 mb-4">
          {{ selectedArticle.author }}, {{ selectedArticle.date }}
        </p>
        <div>
          <p
            v-html="selectedArticle.content"
            class="prose max-w-none"></p>
          <div
            class="mt-4 bg-gradient-to-r from-blue-100 to-purple-100 h-64 flex items-center justify-center rounded-xl shadow-inner backdrop-blur">
            <span class="text-gray-400">Article Image/Diagram</span>
          </div>
          <p class="mt-4 text-gray-500">...</p>
        </div>
      </template>
      <template v-else>
        <div class="text-gray-400 text-center mt-20">暂无文章</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { rss2json } from '../utils/index';
// 引入抽离的组件
import FeedButton from './FeedButton.vue';
import ArticleCard from './ArticleCard.vue';
import { rssUrls } from './mockFeeds.js';
import tiddlywikiIcon from '../assets/icon.svg';

// 获取 favicon 的工具函数（返回 base64）
async function getFaviconBase64(url: string): Promise<string> {
  try {
    const { origin, hostname } = new URL(url);
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

// 根据 rssUrls 初始化 feeds（异步获取 base64 favicon）
const feeds = ref<any[]>([]);
(async () => {
  for (const url of rssUrls) {
    let name = new URL(url).hostname;
    const favicon = await getFaviconBase64(url);
    feeds.value.push({
      name,
      url,
      count: 0,
      articles: [],
      favicon,
    });
  }
})();

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
  console.log('调用', feedName);
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
  selectedArticle.value = article;
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

onMounted(() => {
  // 初始化默认选中第一个 feed 并拉取数据
  if (feeds.value.length > 0) {
    selectFeed(feeds.value[0].name);
  }
});
</script>
