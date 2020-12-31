<template>
  <div class="adminlinksList-page">
    <div class="title-content">
      <h3>用户管理</h3>
      <el-button size="small" type="primary" @click="createToollink">
        添加用户
      </el-button>
    </div>

    <!-- 添加用户 -->
    <el-dialog :title="adminTitle" v-model="dialogVisible">
      <el-form ref="adminFormRef" :rules="rules" :model="adminForm" label-width="80px">
        <el-form-item label="邮箱" prop="email">
          <el-input
            :disabled="isDisabled"
            v-model="adminForm.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="adminForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="adminForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="user_img">
          <el-input v-model="adminForm.user_img" placeholder="请上传头像"></el-input>
          或
          <el-upload
            class="avatar-uploader"
            :action="$axios.defaults.baseURL + '/upload'"
            :show-file-list="false"
            :on-success="afterUpload"
            :headers="getAuthHeader()"
          >
            <img
              v-if="adminForm.user_img"
              :src="adminForm.user_img"
              alt="图片找不见！"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdmin">提 交</el-button>
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
      <el-table-column prop="username" label="用户名称"></el-table-column>
      <el-table-column prop="user_img" label="头像">
        <template #default="scope">
          <img
            v-if="scope.row.user_img"
            :src="scope.row.user_img"
            alt="图标不见了"
            style="width: 50px; height: 50px;"
          />
          <span v-else>没有图标</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="用户邮箱"></el-table-column>
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
import { computed, defineComponent, inject, onMounted, reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { addAdmin, delAdmin, putAdmin, getAdmin } from '../../api/user'

export default defineComponent({
  setup() {
    const dialogVisible = ref(false) // 弹窗
    const adminLinkList = ref([]) // 用户列表
    const loading = ref(false) // 是否显示加载中
    const adminTitle = ref('添加用户')
    const isDisabled = ref(false)
    const adminForm = reactive({
      _id: null,
      username: '',
      email: '',
      password: '',
      user_img: '',
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
          message: '请正确使用邮箱用户',
        },
      ],
      password: [
        { required: true, message: '请输入账户密码', trigger: 'blur' },
        { min: 3, max: 16, message: '长度在 3 到 16 个字符' },
      ],
      user_img: [
        {
          required: false,
          message: '请上传头像',
          trigger: 'blur',
        },
        {
          pattern: /https?:\/{2}[^\s]*/,
          message: '地址请以http或https开头字母和数字',
        },
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
                type: 'success',
                message: res.msg,
              })
            }
          } else {
            try {
              const res = await addAdmin(adminForm)
              if (res.code === 200) {
                ElMessage({
                  type: 'success',
                  message: res.msg,
                })
              }
            } catch (error) {
              ElMessage({
                type: 'warning',
                message: '用户已存在',
              })
              return false
            }
          }
          adminFormRef.value.resetFields()
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
      ElMessageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
              message: '删除用户成功!',
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
      if (adminFormRef.value) {
        adminFormRef.value.resetFields()
      }
      dialogVisible.value = true
      adminTitle.value = '添加用户'
      adminForm._id = null
      adminForm.email = ''
      adminForm.username = ''
      adminForm.password = ''
      adminForm.user_img = ''
    }
    // 改打开对话框并赋值
    const updateRow = row => {
      dialogVisible.value = true
      if (row && row._id) {
        const adminName = row.username
        adminTitle.value = `编辑用户：${adminName || ''}`
        adminForm._id = row._id
        adminForm.username = adminName
        adminForm.email = row.email
        adminForm.password = row.password
        adminForm.user_img = row.user_img
      }
    }
    // 获取用户列表
    const getAdminList = async () => {
      loading.value = true
      const res = await getAdmin()
      if (res.code === 200) {
        adminLinkList.value = res.data
        loading.value = false
      }
    }

    // 图片上传
    const afterUpload = res => {
      adminForm.user_img = res.filename
    }

    return {
      dialogVisible,
      adminLinkList,
      adminForm,
      rules,
      loading,
      isDisabled: computed(() => (adminForm._id === null ? false : true)),
      adminFormRef,
      adminTitle,
      createToollink,
      handleAdmin,
      deleteRow,
      updateRow,
      timeFormat: inject('timeFormat'),
      afterUpload,
      getAuthHeader: inject('getAuthHeader'),
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
