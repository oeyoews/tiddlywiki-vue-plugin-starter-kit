<template>
  <div
    class="flex h-screen bg-gradient-to-tr from-blue-50 via-white to-purple-100">
    <!-- Left Sidebar -->
    <div class="w-64 p-4 bg-white/80 backdrop-blur-md border-r border-blue-100">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          Feeds
          <RssIcon class="size-4" />
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
      <div class="flex mb-4 justify-between">
        <input
          v-model="newFeedUrl"
          type="text"
          placeholder="Add RSS URL"
          class="p-2 border outline-gray-400 placeholder:text-gray-400" />
        <button
          class="flex items-center"
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
              @load="selectFeed(feed.name)" />
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
      class="w-1/2 overflow-y-auto bg-white/80 backdrop-blur-lg p-8 shadow-2xl rounded">
      <template v-if="selectedArticle">
        <h2 class="text-2xl font-bold mb-4 text-purple-700 drop-shadow">
          {{ selectedArticle.title }}
        </h2>
        <p class="text-sm text-gray-500 mb-4">
          {{ selectedArticle.author }}, {{ selectedArticle.date }}
        </p>
        <p
          v-html="selectedArticle.content"
          class="prose max-w-none"></p>
      </template>
      <template v-else>
        <div class="text-gray-400 text-center mt-20">暂无文章</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { rss2json } from '~/vue-rss-plus/utils';
// @ts-ignore
import RssIcon from '~icons/tw-icons/rss';
// 引入抽离的组件
import FeedButton from './FeedButton.vue';
import ArticleCard from './ArticleCard.vue';
import { rssUrls } from './mockFeeds';
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
