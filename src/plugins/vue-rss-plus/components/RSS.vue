<template>
  <div class="flex h-screen">
    <!-- Left Sidebar -->
    <div class="w-64 p-4 shadow-md">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-800">Feeds</h2>
      </div>

      <!-- Search Bar -->
      <div class="relative mb-4">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search feeds..."
          class="w-[90%] p-2 rounded border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" />
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
        <FeedButton
          v-for="feed in filteredFeeds"
          :key="feed.name"
          :feed="feed"
          :selected="selectedFeed === feed.name"
          @click="selectFeed(feed.name)" />
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
      <h2 class="text-xl font-bold mb-4">{{ selectedArticle.title }}</h2>
      <p class="text-sm text-gray-500 mb-4">
        {{ selectedArticle.author }}, {{ selectedArticle.date }}
      </p>
      <div>
        <p>{{ selectedArticle.content }}</p>
        <div class="mt-4 bg-gray-200 h-64 flex items-center justify-center">
          Article Image/Diagram
        </div>
        <p class="mt-4">...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
// 引入抽离的组件
import FeedButton from './FeedButton.vue';
import ArticleCard from './ArticleCard.vue';
import { svgAllFeeds, svgFavorites, svgRecent } from './svgIcons.js';
import { feeds as mockFeeds } from './mockFeeds.js';

const searchTerm = ref('');

// 使用 mockFeeds
const feeds = ref(mockFeeds);

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

function selectFeed(feedName) {
  selectedFeed.value = feedName;
  // 自动选中该 feed 的第一篇文章
  const feed = feeds.value.find((f) => f.name === feedName);
  selectedArticle.value =
    feed && feed.articles.length > 0 ? feed.articles[0] : null;
}

function selectArticle(article) {
  selectedArticle.value = article;
}

// 初始化默认选中第一个 feed
if (feeds.value.length > 0) {
  selectFeed(feeds.value[0].name);
}

// 切换 feeds 时自动切换文章
watch(selectedFeed, (newFeed) => {
  const feed = feeds.value.find((f) => f.name === newFeed);
  selectedArticle.value =
    feed && feed.articles.length > 0 ? feed.articles[0] : null;
});
</script>
