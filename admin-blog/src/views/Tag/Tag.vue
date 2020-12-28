<template>
  <div class="tagsList-page">
    <h2>标签管理</h2>
    <el-button style="margin-left: 20px;" type="primary" @click="dialogVisible = true">
      添加标签
    </el-button>

    <!-- dialog对话框 -->
    <el-dialog :title="tagTitle" v-model="dialogVisible" width="30%">
      <el-form ref="tagFormRef" :rules="rules" :model="tagForm" label-width="80px">
        <!-- <el-form-item label="标签ID" prop="_id">
          <el-input v-model="tagForm._id" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="标签名称" prop="tag">
          <el-input v-model="tagForm.tag_name"></el-input>
        </el-form-item>
        <el-form-item label="标签描述" prop="desc">
          <el-input v-model="tagForm.tag_desc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleTag">提 交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 表格数据列表 -->
    <el-table :data="tagsList" border style="width: 90%; margin: 0 auto; margin-top: 20px">
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
          <span>{{ scope.row.created }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updated" label="更新时间">
        <template #default="scope">
          <span>{{ scope.row.updated }}</span>
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
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

export default defineComponent({
  setup() {
    // init
    const dialogVisible = ref(false) // 弹窗
    const tagTitle = ref('添加标签')
    // const updateDialog = ref(false) // 编辑是否显示弹窗
    const tagsList = ref([
      {
        _id: 1,
        tag_name: 'vuejs',
        tag_desc: 'vuejs',
        numList: 1,
        created: 'xx-xx',
        updated: '20-11-11',
      },
      {
        _id: 2,
        tag_name: 'nodejs',
        tag_desc: 'vuejs',
        numList: 1,
        created: 'xx-xx',
        updated: '20-11-11',
      },
      {
        _id: 3,
        tag_name: 'reactjs',
        tag_desc: 'vuejs',
        numList: 1,
        created: 'xx-xx',
        updated: '20-11-11',
      },
    ]) // 返回带文章数目的标签列表
    const tagForm = reactive({
      _id: '',
      tag_name: '',
      tag_desc: '',
    }) // tag表单项
    const rules = reactive({
      name: [
        { required: true, message: '请输入标签名称', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符' },
      ],
    })
    const tagFormRef = ref(null)

    onMounted(() => {})

    // methods
    // 重置表单
    const reset = () => {
      if (tagFormRef.value) {
        console.log(tagFormRef.value)
        tagFormRef.value.resetFields()
      }
    }

    // 增、改
    const handleTag = () => {
      console.log(tagForm._id)
      if (tagForm._id !== '') {
        // 改
      } else {
        // 增
      }
    }

    // 删
    const deleteRow = ({ _id }) => {
      console.log(_id)
      ElMessageBox.confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 发送请求
          ElMessage({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除',
          })
        })
    }
    // 改打开对话框并赋值
    const updateRow = row => {
      dialogVisible.value = true
      if (row && row._id) {
        const tagName = row.tag_name
        tagTitle.value = `编辑标签：${tagName}`
        tagForm._id = row._id
        tagForm.tag_name = tagName
        tagForm.tag_desc = row.tag_desc
      }
    }
    // 查
    const getTagList = () => {}

    return {
      dialogVisible,
      tagTitle,
      tagsList,
      tagForm,
      rules,
      tagFormRef,
      handleTag,
      updateRow,
      deleteRow,
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