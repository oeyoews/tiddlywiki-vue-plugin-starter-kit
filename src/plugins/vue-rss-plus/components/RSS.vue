<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Left Sidebar -->
    <div class="w-64 bg-white p-4 shadow-md">
      <h2 class="text-lg font-semibold mb-4">Feeds</h2>
      <!-- Feed list goes here -->
      <ul>
        <li class="mb-2">DEV Community</li>
        <li class="mb-2">freeCodeCamp</li>
        <li>...</li>
      </ul>
    </div>

    <!-- Middle Column (Article List) -->
    <div class="flex-1 overflow-y-auto p-4">
      <h2 class="text-lg font-semibold mb-4">Articles</h2>
      <!-- Article list goes here -->
      <div>
        <div class="bg-white p-3 mb-3 rounded shadow">
          <h3 class="font-semibold">Pipelining for Memcached</h3>
          <p class="text-sm text-gray-600">
            Typical Client-Server protocols operate a request - response model.
          </p>
        </div>
        <div class="bg-white p-3 mb-3 rounded shadow">
          <h3 class="font-semibold">How to build index with text embeddings</h3>
          <p class="text-sm text-gray-600">
            In this blog, we will build index with text embeddings and...
          </p>
        </div>
        <!-- More articles -->
      </div>
    </div>

    <!-- Right Column (Article Content) -->
    <div class="w-1/2 overflow-y-auto bg-white p-4 shadow-md">
      <h2 class="text-xl font-bold mb-4">Pipelining for Memcached</h2>
      <p class="text-sm text-gray-500 mb-4">paschal, May 24, 2025</p>
      <!-- Article content goes here -->
      <div>
        <p>
          Typical Client-Server protocols operate a request - response model.
        </p>
        <!-- Image Placeholder -->
        <div class="mt-4 bg-gray-200 h-64 flex items-center justify-center">
          Article Image/Diagram
        </div>
        <p class="mt-4">...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Script content goes here
</script>

<style scoped>
/* Optional: Add component-specific styles here */
</style>
