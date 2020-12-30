<template>
  <div class="tagsList-page">
    <div class="title-content">
      <h3>标签管理</h3>
      <el-button size="small" style="" type="primary" @click="createTag">
        添加标签
      </el-button>
    </div>

    <!-- dialog对话框 -->
    <el-dialog :title="tagTitle" v-model="dialogVisible" width="30%">
      <el-form ref="tagFormRef" status-icon :rules="rules" :model="tagForm" label-width="100px">
        <el-form-item label="标签ID" prop="_id">
          <el-input v-model="tagForm._id" disabled></el-input>
        </el-form-item>
        <el-form-item label="标签名称" prop="tag_name">
          <el-input v-model="tagForm.tag_name"></el-input>
        </el-form-item>
        <el-form-item label="标签描述" prop="tag_desc">
          <el-input v-model="tagForm.tag_desc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleTag()">提 交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 表格数据列表 -->
    <el-table
      :data="tagsList"
      v-loading="loading"
      border
      style="width: 90%; margin: 0 auto; margin-top: 20px"
    >
      <el-table-column type="index" width="100" label="#"></el-table-column>
      <el-table-column prop="tag_name" label="标签名称">
        <template #default="scope">
          <el-tag style="margin: 0 3px; font-size: 14px" effect="dark">
            {{ scope.row.tag_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tag_desc" label="描述"></el-table-column>
      <el-table-column prop="numList" label="文章数量"></el-table-column>
      <el-table-column prop="created" label="创建时间">
        <template #default="scope">
          <span>{{ timeFormat(scope.row.created) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updated" label="更新时间">
        <template #default="scope">
          <span>{{ timeFormat(scope.row.updated) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button type="primary" size="small" @click="updateRow(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="deleteRow(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, toRefs, inject } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { addTag, delTag, putTag, getTag } from '../../api/tag'

export default defineComponent({
  setup() {
    // init
    const dialogVisible = ref(false) // 弹窗
    const loading = ref(false)
    const tagTitle = ref('添加标签')
    const tagsList = ref([]) // 返回带文章数目的标签列表
    const tagForm = reactive({
      _id: null,
      tag_name: '',
      tag_desc: '',
    }) // tag表单项
    const rules = reactive({
      tag_name: [
        { required: true, message: '请输入标签名称', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
      ],
      tag_desc: [
        { required: true, message: '请输入标签描述信息', trigger: 'blur' },
        { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
      ],
    })
    const tagFormRef = ref(null)

    // 格式化日期
    const timeFormat = inject('timeFormat')

    onMounted(() => {
      getTagList()
    })

    // methods
    // 增、改
    const handleTag = () => {
      tagFormRef.value.validate(async valid => {
        if (valid) {
          if (tagForm._id !== null) {
            // 改
            const res = await putTag(tagForm._id, tagForm)
            if (res.code === 200) {
              ElMessage({
                type: 'info',
                message: res.msg,
              })
            }
          } else {
            // 增
            const res = await addTag(tagForm)
            if (res.code === 200) {
              ElMessage({
                type: 'success',
                message: res.msg,
              })
            }
          }
          // 关闭对话框
          dialogVisible.value = false
          // 重新获取标签列表
          getTagList()
        }
      })
    }
    // 删
    const deleteRow = ({ _id }) => {
      ElMessageBox.confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 发送请求
          const res = await delTag(_id)
          if (res.code === 200) {
            ElMessage({
              type: 'success',
              message: '删除成功!',
            })
          }
          getTagList()
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除',
          })
        })
    }
    // 增打开对话框并重置
    const createTag = () => {
      dialogVisible.value = true
      tagTitle.value = '添加标签'
      tagForm._id = null
      tagForm.tag_name = ''
      tagForm.tag_desc = ''
    }
    // 改打开对话框并赋值
    const updateRow = row => {
      dialogVisible.value = true
      if (row && row._id) {
        const tagName = row.tag_name
        tagTitle.value = `编辑标签：${tagName || ''}`
        tagForm._id = row._id
        tagForm.tag_name = tagName
        tagForm.tag_desc = row.tag_desc
      }
    }
    // 查
    const getTagList = async () => {
      loading.value = true
      const res = await getTag()
      if (res.code === 200) {
        const tagsListData = res.data
        const numList = res.articlenumlist
        tagsListData.forEach(item => {
          let temp = numList.find(i => {
            return i._id === item._id
          })
          item.numList = temp == null ? 0 : temp.count
        })
        res.data = tagsListData.sort((a, b) => {
          return a.numList < b.numList
        })
        tagsList.value = tagsListData
        loading.value = false
      }
    }

    return {
      dialogVisible,
      tagTitle,
      tagsList,
      tagForm,
      rules,
      loading,
      tagFormRef,
      handleTag,
      createTag,
      updateRow,
      deleteRow,
      timeFormat,
    }
  },
})
</script>

<style>
.el-table td,
.el-table th {
  text-align: center !important;
}
</style>
