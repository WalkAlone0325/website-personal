<template>
  <div class="iconlinksList-page">
    <!-- 添加图标 -->
    <el-dialog :title="iconTitle" v-model="dialogVisible">
      <el-form ref="iconFormRef" :rules="rules" :model="iconForm" label-width="80px">
        <el-form-item label="图标名称" prop="name">
          <el-input v-model="iconForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图标地址" prop="link">
          <el-input v-model="iconForm.link"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="iconForm.icon"></el-input>
          或
          <el-upload
            class="avatar-uploader"
            :action="$axios.defaults.baseURL + '/upload'"
            :show-file-list="false"
            :on-success="afterUpload"
            :headers="getAuthHeader()"
          >
            <img v-if="iconForm.icon" :src="iconForm.icon" alt="图片找不见！" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleIconLink()">提 交</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加图标链接 -->
    <el-table
      :data="iconList"
      v-loading="loading"
      border
      height="290"
      style="margin: 0 auto; margin-top: 20px; width: 90%"
    >
      <el-table-column type="index" width="100" label="#"></el-table-column>
      <el-table-column prop="name" label="图标名称"></el-table-column>
      <el-table-column prop="link" label="地址链接"></el-table-column>
      <el-table-column prop="icon" label="图标">
        <template #default="scope">
          <img
            v-if="scope.row.icon"
            :src="scope.row.icon"
            alt="图标不见了"
            style="width: 50px; height: 50px;"
          />
          <span v-else>没有图标</span>
        </template>
      </el-table-column>
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
import { addIconLink, delIconLink, putIconLink, getIconLink } from '../../api/icon'

export default defineComponent({
  setup() {
    const dialogVisible = ref(false) // 弹窗
    const iconList = ref([]) // 图标列表
    const loading = ref(false)
    const iconTitle = ref('添加图标')
    const iconForm = reactive({
      _id: null,
      name: '',
      link: '',
      icon: '',
    })
    const rules = reactive({
      name: [
        { required: true, message: '请输入图标名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
      ],
      link: [
        {
          required: true,
          message: '请输入正确的地址',
          trigger: 'blur',
        },
        {
          pattern: /https?:\/{2}[^\s]*/,
          message: '地址请以http或https开头字母和数字',
        },
      ],
      icon: [
        {
          required: false,
          message: '请上传一个地址或图标',
          trigger: 'blur',
        },
        {
          pattern: /https?:\/{2}[^\s]*/,
          message: '地址请以http或https开头字母和数字',
        },
      ],
    })
    const iconFormRef = ref(null)

    onMounted(() => {
      getLinkList()
    })

    // methods
    // 增、改
    const handleIconLink = () => {
      iconFormRef.value.validate(async valid => {
        if (valid) {
          if (iconForm._id !== null) {
            // 改
            const res = await putIconLink(iconForm._id, iconForm)
            if (res.code === 200) {
              ElMessage({
                type: 'info',
                message: res.msg,
              })
            }
          } else {
            const res = await addIconLink(iconForm)
            if (res.code === 200) {
              ElMessage({
                type: 'success',
                message: res.msg,
              })
            }
          }
          // 关闭对话框
          dialogVisible.value = false
          getLinkList()
        } else {
          return false
        }
      })
    }
    // 删
    const deleteRow = ({ _id }) => {
      ElMessageBox.confirm('此操作将永久删除该图标, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 发送请求
          const res = await delIconLink(_id)
          if (res.code === 200) {
            ElMessage({
              type: 'success',
              message: '删除图标成功!',
            })
          }
          getLinkList()
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除',
          })
        })
    }
    // 增打开对话框并重置
    const createIconlink = () => {
      dialogVisible.value = true
      iconTitle.value = '添加图标'
      iconForm._id = null
      iconForm.name = ''
      iconForm.link = ''
      iconForm.icon = ''
    }
    // 改打开对话框并赋值
    const updateRow = row => {
      dialogVisible.value = true
      if (row && row._id) {
        const blogName = row.name
        iconTitle.value = `编辑图标：${blogName || ''}`
        iconForm._id = row._id
        iconForm.name = blogName
        iconForm.icon = row.icon
        iconForm.link = row.link
      }
    }
    // 获取图标列表
    const getLinkList = async () => {
      loading.value = true
      const res = await getIconLink()
      if (res.code === 200) {
        iconList.value = res.data
        loading.value = false
      }
    }

    // 图片上传
    const afterUpload = res => {
      iconForm.icon = res.filename
    }

    return {
      dialogVisible,
      iconList,
      iconForm,
      rules,
      loading,
      iconFormRef,
      iconTitle,
      createIconlink,
      handleIconLink,
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
