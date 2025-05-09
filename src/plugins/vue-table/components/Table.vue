<template>
  <div class="table-container">
    <!-- 搜索框 -->
    <div class="search-container mb-5 flex justify-end items-center">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[20, 40, 60]"
        :pager-count="5"
        layout="total, prev, pager, next, sizes,"
        :total="filteredData?.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
      <el-divider direction="vertical" />
      <el-input
        v-model="searchQuery"
        placeholder="Search..."
        clearable
        @input="handleSearch"
        style="width: 300px">
        <template #prefix>
          <i class="i-[material-symbols--search]"></i>
          <!-- <ele-Search /> -->
        </template>
      </el-input>
    </div>

    <!-- 表格 -->
    <el-table
      :data="paginatedData"
      border
      style="width: 100%; overflow: hidden">
      <el-table-column
        type="index"
        label="Index"
        width="65" />
      <el-table-column
        sortable
        v-for="field in fields"
        :key="field.value"
        :prop="field.value"
        :label="field.label">
        <template v-slot="scope">
          <div
            class="inline-flex items-center cursor-pointer text-blue-500"
            @click="handleRowClick(scope.row)">
            <i class="mr-1 i-[mdi--drive-document] bg-sky-400/80 align-top"></i>
            {{ scope.row }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import 'element-plus/theme-chalk/dark/css-vars.css';
import { ref, computed } from 'vue';
const fields = [{ label: 'Title', value: 'title' }];

const handleRowClick = (row: string) => new $tw.Story().navigateTiddler(row);
interface Props {
  tiddlers: string[];
}

const props = withDefaults(defineProps<Props>(), {
  tiddlers: () => [],
});

// 搜索相关
const searchQuery = ref('');

// 分页相关
const currentPage = ref(1);
const pageSize = ref(20);

// 根据搜索条件过滤数据
const filteredData = computed(() => {
  if (props.tiddlers?.length == 0) {
    return;
  }
  if (!searchQuery.value) {
    return props.tiddlers;
  }
  const query = searchQuery.value.toLowerCase();
  return props.tiddlers.filter((item) => item.toLowerCase().includes(query));
});

// 根据当前页和每页数量计算分页数据
const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredData.value.slice(startIndex, startIndex + pageSize.value);
});

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1; // 搜索时重置到第一页
};

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

// 处理每页显示数量变化
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1; // 改变每页数量时重置到第一页
};
</script>

<style scoped>
:deep(.el-table__body),
:deep(.el-table__header) {
  margin: 0 auto;
  border: none;
}
</style>
