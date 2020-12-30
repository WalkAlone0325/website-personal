<template>
  <div class="adminlinksList-page">
    <div class="title-content">
      <h3>账号管理</h3>
      <el-button size="small" type="primary" @click="createToollink">
        添加账号
      </el-button>
    </div>

    <!-- 添加账号 -->
    <el-dialog :title="adminTitle" v-model="dialogVisible">
      <el-form ref="adminFormRef" :rules="rules" :model="adminForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="adminForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="adminForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="adminForm.password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdmin()">提 交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 表格数据列表 -->
    <el-table
      :data="adminLinkList"
      v-loading="loading"
      border
      style="margin: 0 auto; margin-top: 20px; width: 90%;"
    >
      <el-table-column type="index" width="100" label="#"></el-table-column>
      <el-table-column prop="username" label="账号名称"></el-table-column>
      <el-table-column prop="email" label="账号邮箱"></el-table-column>
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
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="scope">
          <el-button type="primary" size="small" @click="updateRow(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, inject, onMounted, reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { addAdmin, delAdmin, putAdmin, getAdmin } from '../../api/user'

export default defineComponent({
  setup() {
    const dialogVisible = ref(false) // 弹窗
    const adminLinkList = ref([]) // 账号列表
    const loading = ref(false) // 是否显示加载中
    const adminTitle = ref('添加账号')
    const adminForm = reactive({
      _id: null,
      username: '',
      email: '',
      password: '',
    })
    const rules = reactive({
      username: [
        { required: true, message: '请输入账户名', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符' },
        {
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
          message: '请正确使用邮箱账号',
        },
      ],
      password: [
        { required: true, message: '请输入账户密码', trigger: 'blur' },
        { min: 3, max: 16, message: '长度在 3 到 16 个字符' },
      ],
    })
    const adminFormRef = ref(null)

    onMounted(() => {
      getAdminList()
    })

    // methods
    // 增、改
    const handleAdmin = () => {
      adminFormRef.value.validate(async valid => {
        if (valid) {
          if (adminForm._id !== null) {
            // 改
            const res = await putAdmin(adminForm._id, adminForm)
            if (res.code === 200) {
              ElMessage({
                type: 'info',
                message: res.msg,
              })
            }
          } else {
            const res = await addAdmin(adminForm)
            if (res.code === 200) {
              ElMessage({
                type: 'success',
                message: res.msg,
              })
            }
          }
          // 关闭对话框
          dialogVisible.value = false
          getAdminList()
        } else {
          return false
        }
      })
    }
    // 删
    const deleteRow = ({ _id }) => {
      ElMessageBox.confirm('此操作将永久删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 发送请求
          const res = await delAdmin(_id)
          if (res.code === 200) {
            ElMessage({
              type: 'success',
              message: '删除账号成功!',
            })
          }
          getAdminList()
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除',
          })
        })
    }
    // 增打开对话框并重置
    const createToollink = () => {
      dialogVisible.value = true
      adminTitle.value = '添加账号'
      adminForm._id = null
      adminForm.username = ''
      adminForm.password = ''
    }
    // 改打开对话框并赋值
    const updateRow = row => {
      dialogVisible.value = true
      if (row && row._id) {
        const adminName = row.username
        adminTitle.value = `编辑账号：${adminName || ''}`
        adminForm._id = row._id
        adminForm.username = adminName
        adminForm.password = row.password
      }
    }
    // 获取账号列表
    const getAdminList = async () => {
      loading.value = true
      const res = await getAdmin()
      if (res.code === 200) {
        adminLinkList.value = res.data
        loading.value = false
      }
    }

    return {
      dialogVisible,
      adminLinkList,
      adminForm,
      rules,
      loading,
      adminFormRef,
      adminTitle,
      createToollink,
      handleAdmin,
      deleteRow,
      updateRow,
      timeFormat: inject('timeFormat'),
    }
  },
})
</script>

<style>
.el-table td,
.el-table th {
  text-align: center !important;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
