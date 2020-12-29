<template>
  <div class="articlelist-page">
    <h2>文章列表</h2>
    <el-form :inline="true" style="margin-left: 50px">
      <el-form-item label="标题">
        <el-input
          type="text"
          placeholder="请输入要查询的字段"
          clearable
          v-model.trim="searchData.title"
          style="width:200px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-setting" @click="resetSearch">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-circle-plus"
          style="margin-left: 20px;"
          type="primary"
          @click="$router.replace('/article/edit')"
        >
          写文章
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格数据列表 -->
    <el-table :data="articleList" style="margin-top: 20px" v-loading="loading">
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column prop="avatar" label="作者" width="70"></el-table-column>
      <el-table-column prop="title" label="文章标题"></el-table-column>
      <el-table-column
        prop="desc"
        label="简介"
        width="150"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="tags" label="标签">
        <template #default="{ row }">
          <el-tag style="margin: 3px 3px;" v-for="item in row.tags" :key="item._id" effect="dark">
            {{ item.tag_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag
            style="margin: 3px 3px;"
            effect="dark"
            :type="row.status === 1 ? 'success' : 'warning'"
          >
            {{ row.status === 1 ? '发表' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="img_url" label="封面" width="160">
        <template #default="{ row }">
          <img
            v-if="row.img_url"
            :src="row.img_url"
            alt="图片加载失败"
            style="margin: 0; width: 120px; height: 60px;"
          />
          <span v-else>无图片</span>
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
          <el-button type="danger" size="small" @click="removeArticle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        style="margin-top: 20px;"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageSetting.page"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSetting.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageSetting.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent, onMounted, reactive, ref, toRef, toRefs } from 'vue'
import { addArticle, delArticle, putArticle, getArticle } from '../../api/article'

export default defineComponent({
  setup() {
    // init
    const articleList = ref([]) // 文章列表
    const loading = ref(false) // 是否显示加载中
    const pageSetting = reactive({
      total: 0, // 文章总数
      page: 1, // 当前页数
      size: 10, // 每页的条数
      hasMore: false,
    })
    const searchData = reactive({
      title: '',
    })

    onMounted(() => {
      getArticleList()
    })

    // methods
    // 搜索文章
    const handleSearch = () => {
      if (searchData.title !== '') {
        pageSetting.page = 1
        getArticleList()
      }
    }
    const resetSearch = () => {
      searchData.title = ''
      getArticleList()
    }
    const handleSizeChange = val => {
      pageSetting.size = val
      getArticleList()
    }
    const handleCurrentChange = val => {
      pageSetting.page = val
      getArticleList()
    }
    // 获取文章列表
    const getArticleList = async () => {
      console.log(1)
      loading.value = true
      const res = await getArticle({
        page: pageSetting.page,
        size: pageSetting.size,
        title: searchData.title,
      })
      if (res.code === 200) {
        articleList.value = res.data
        pageSetting.total = res.total
        pageSetting.hasMore = res.hasMore
        loading.value = false
      }
    }
    // 删除文章
    const removeArticle = ({ _id }) => {
      console.log(_id)
      ElMessageBox.confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 发送请求
          const res = await delArticle(_id)
          if (res.code === 200) {
            ElMessage({
              type: 'success',
              message: res.msg,
            })
          } else {
            ElMessage({
              type: 'warning',
              message: res.msg,
            })
          }
          getArticleList()
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除',
          })
        })
    }

    return {
      articleList,
      loading,
      pageSetting,
      searchData,
      handleSearch,
      resetSearch,
      handleSizeChange,
      handleCurrentChange,
      removeArticle,
    }
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
.pagination-container {
  float: right;
  margin-top: 10px;
  margin-bottom: 50px;
}
</style>
