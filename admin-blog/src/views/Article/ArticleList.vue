<template>
  <div class="articlelist-page">
    <h2>文章列表</h2>
    <!-- 表格数据列表 -->
    <el-table :data="articleLists" border style="margin-top: 20px" v-loading="loading">
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column prop="avatar" label="作者" width="70"></el-table-column>
      <el-table-column prop="title" label="文章标题"></el-table-column>
      <el-table-column
        prop="intro"
        label="简介"
        width="150"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="tags" label="标签">
        <template #default="{ row }">
          <el-tag style="margin: 3px 3px;" v-for="item in row.tags" :key="item._id" effect="dark">
            {{ item.tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable prop="resource" label="状态" width="80">
        <template #default="{ row }">
          <el-tag
            style="margin: 3px 3px;"
            effect="dark"
            :type="row.resource === 1 ? 'success' : 'warning'"
          >
            {{ row.resource === 1 ? '发表' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="image" label="封面" width="160">
        <template #default="{ row }">
          <img :src="row.image" style="margin: 0; width: 120px; height: 60px;" />
        </template>
      </el-table-column>
      <el-table-column sortable prop="created" label="创建时间" width="100">
        <template #default="scope">
          <span>{{ scope.row.created }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="updated" label="更新时间" width="100">
        <template #default="scope">
          <span>{{ scope.row.updated }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="$router.push(`/article/edit/${scope.row._id}`)"
          >
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="removed(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    // init
    const articleList = ref([]) // 文章列表
    const loading = ref(false) // 是否显示加载中

    // methods

    return { articleList, loading }
  },
})
</script>

<style>
.el-table td,
.el-table th {
  text-align: center !important;
}
.intro-nowrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 180px;
}
</style>
