<template>
  <div class="flex h-screen">
    <!-- Left Sidebar -->
    <div class="w-64 p-4 shadow-md">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-800">
          Feeds
          <i class="i-[vscode-icons--file-type-rss]"></i>
        </h2>
      </div>

      <!-- Search Bar -->
      <div class="relative mb-4">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search feeds..."
          class="w-[90%] p-2 rounded border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" />
      </div>

      <!-- Add RSS Feed -->
      <div class="flex mb-4 space-x-2">
        <input
          v-model="newFeedUrl"
          type="text"
          placeholder="Add RSS URL"
          class="flex-1 p-2 rounded border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" />
        <button
          class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          @click="addFeed"
          :disabled="!newFeedUrl.trim()">
          <i class="i-[material-symbols--add-rounded]"></i>
          Add
        </button>
      </div>

      <!-- Feed Categories -->
      <div class="space-y-2 mb-4 hidden">
        <button
          class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <span
            class="h-5 w-5 mr-3"
            v-html="svgAllFeeds"></span>
          All Feeds
        </button>
        <button
          class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <span
            class="h-5 w-5 mr-3"
            v-html="svgFavorites"></span>
          Favorites
        </button>
        <button
          class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <span
            class="h-5 w-5 mr-3"
            v-html="svgRecent"></span>
          Recent
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
          class="flex items-center group">
          <FeedButton
            :feed="feed"
            :selected="selectedFeed === feed.name"
            @load="selectFeed(feed.name)" />
          <button
            class="ml-2 text-gray-400 hover:text-blue-500 transition-colors"
            title="refresh"
            @click="refreshFeed(feed)">
            <i class="i-[material-symbols--refresh]"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Middle Column (Article List) -->
    <div class="flex-1 overflow-y-auto p-4">
      <h2 class="text-lg font-semibold mb-4">Articles</h2>
      <div>
        <ArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
          @click="selectArticle(article)" />
      </div>
    </div>

    <!-- Right Column (Article Content) -->
    <div class="w-1/2 overflow-y-auto bg-white p-4 shadow-md">
      <template v-if="selectedArticle">
        <h2 class="text-xl font-bold mb-4">{{ selectedArticle.title }}</h2>
        <p class="text-sm text-gray-500 mb-4">
          {{ selectedArticle.author }}, {{ selectedArticle.date }}
        </p>
        <div>
          <p v-html="selectedArticle.content"></p>
          <div class="mt-4 bg-gray-200 h-64 flex items-center justify-center">
            Article Image/Diagram
          </div>
          <p class="mt-4">...</p>
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
import { svgAllFeeds, svgFavorites, svgRecent } from './svgIcons.js';
import { rssUrls } from './mockFeeds.js';

const searchTerm = ref('');
const newFeedUrl = ref('');

// 根据 rssUrls 初始化 feeds
const feeds = ref(
  rssUrls.map((url) => {
    let name = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (name.length > 30) name = name.slice(0, 30) + '...';
    return {
      name,
      url,
      color: 'gray',
      count: 0,
      articles: [],
    };
  })
);

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
  let name = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (name.length > 30) name = name.slice(0, 30) + '...';
  if (feeds.value.some((f) => f.url === url || f.name === name)) {
    newFeedUrl.value = '';
    return;
  }
  const feed = {
    name,
    url,
    color: 'gray',
    count: 0,
    articles: [],
  };
  feeds.value.push(feed);
  selectedFeed.value = name;
  newFeedUrl.value = '';
  await fetchFeedArticles(feed);
  // 自动选中第一篇
  selectedArticle.value =
    feed.articles && feed.articles.length > 0 ? feed.articles[0] : null;
}

// 刷新 Feed
async function refreshFeed(feed) {
  feed.articles = [];
  feed.count = 0;
  await fetchFeedArticles(feed);
  // 如果当前选中的是这个 feed，则刷新文章选中状态
  if (selectedFeed.value === feed.name) {
    selectedArticle.value =
      feed.articles && feed.articles.length > 0 ? feed.articles[0] : null;
  }
}

onMounted(() => {
  // 初始化默认选中第一个 feed 并拉取数据
  if (feeds.value.length > 0) {
    selectFeed(feeds.value[0].name);
  }
});
</script>
