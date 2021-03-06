<template>
  <div class="friendlinksList-page">
    <div class="title-content">
      <h3 style="display: inline-block;">友链/图标管理</h3>
      <el-button
        style="margin: 10px 15px 0 15px;"
        size="small"
        type="primary"
        @click="createFriendlink"
      >
        添加友链
      </el-button>
      <el-button style="margin: 10px 15px 0 15px;" size="small" type="primary" @click="handleChild">
        添加图标
      </el-button>
    </div>

    <!-- 添加友链 -->
    <el-dialog :title="friendTitle" v-model="dialogVisible">
      <el-form ref="friendFormRef" :rules="rules" :model="friendForm" label-width="80px">
        <el-form-item label="友链名称" prop="blog_name">
          <el-input v-model="friendForm.blog_name"></el-input>
        </el-form-item>
        <el-form-item label="友链描述" prop="blog_desc">
          <el-input v-model="friendForm.blog_desc"></el-input>
        </el-form-item>
        <el-form-item label="友链地址" prop="blog_url">
          <el-input v-model="friendForm.blog_url"></el-input>
        </el-form-item>
        <el-form-item label="友链图标" prop="blog_imgurl">
          <el-input v-model="friendForm.blog_imgurl"></el-input>
          或
          <el-upload
            class="avatar-uploader"
            :action="$axios.defaults.baseURL + '/upload'"
            :show-file-list="false"
            :on-success="afterUpload"
            :headers="getAuthHeader()"
          >
            <img
              v-if="friendForm.blog_imgurl"
              :src="friendForm.blog_imgurl"
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
          <el-button type="primary" @click="handleFriendLink()">提 交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 表格数据列表 -->
    <el-table
      :data="friendLinkList"
      v-loading="loading"
      border
      height="280"
      style="margin: 0 auto; margin-top: 20px; width: 90%"
    >
      <el-table-column type="index" width="100" label="#"></el-table-column>
      <el-table-column prop="blog_name" label="友链名称"></el-table-column>
      <el-table-column
        prop="blog_desc"
        label="描述"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="blog_url" label="地址"></el-table-column>
      <el-table-column prop="blog_imgurl" label="图标">
        <template #default="scope">
          <img
            v-if="scope.row.blog_imgurl"
            :src="scope.row.blog_imgurl"
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

    <IocnLink ref="childRef" />
  </div>
</template>

<script>
import { defineComponent, inject, onMounted, reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { addFriendLink, delFriendLink, putFriendLink, getFriendLink } from '../../api/friend'
import IocnLink from './IconLink'

export default defineComponent({
  setup() {
    const dialogVisible = ref(false) // 弹窗
    const friendLinkList = ref([]) // 友链列表
    const loading = ref(false)
    const friendTitle = ref('添加友链')
    const friendForm = reactive({
      _id: null,
      blog_name: '',
      blog_desc: '',
      blog_url: '',
      blog_imgurl: '',
    })
    const rules = reactive({
      blog_name: [
        { required: true, message: '请输入友链名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
      ],
      blog_url: [
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
      blog_imgurl: [
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
    const friendFormRef = ref(null)
    const childRef = ref(null)

    onMounted(() => {
      getLinkList()
    })

    // methods
    // 增、改
    const handleFriendLink = () => {
      friendFormRef.value.validate(async valid => {
        if (valid) {
          if (friendForm._id !== null) {
            // 改
            const res = await putFriendLink(friendForm._id, friendForm)
            if (res.code === 200) {
              ElMessage({
                type: 'info',
                message: res.msg,
              })
            }
          } else {
            const res = await addFriendLink(friendForm)
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
      ElMessageBox.confirm('此操作将永久删除该友链, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 发送请求
          const res = await delFriendLink(_id)
          if (res.code === 200) {
            ElMessage({
              type: 'success',
              message: '删除友链成功!',
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
    const createFriendlink = () => {
      dialogVisible.value = true
      friendTitle.value = '添加友链'
      friendForm._id = null
      friendForm.blog_name = ''
      friendForm.blog_desc = ''
      friendForm.blog_url = ''
      friendForm.blog_imgurl = ''
    }
    // 改打开对话框并赋值
    const updateRow = row => {
      dialogVisible.value = true
      if (row && row._id) {
        const blogName = row.blog_name
        friendTitle.value = `编辑友链：${blogName || ''}`
        friendForm._id = row._id
        friendForm.blog_name = blogName
        friendForm.blog_desc = row.blog_desc
        friendForm.blog_url = row.blog_url
        friendForm.blog_imgurl = row.blog_imgurl
      }
    }
    // 获取友链列表
    const getLinkList = async () => {
      loading.value = true
      const res = await getFriendLink()
      if (res.code === 200) {
        friendLinkList.value = res.data
        loading.value = false
      }
    }

    // 调用子组件方法
    const handleChild = () => {
      if (childRef.value) {
        childRef.value.createIconlink()
      }
    }

    // 图片上传
    const afterUpload = res => {
      friendForm.blog_imgurl = res.filename
    }

    return {
      dialogVisible,
      friendLinkList,
      friendForm,
      rules,
      loading,
      friendFormRef,
      friendTitle,
      createFriendlink,
      handleFriendLink,
      deleteRow,
      updateRow,
      timeFormat: inject('timeFormat'),
      getAuthHeader: inject('getAuthHeader'),
      childRef,
      handleChild,
      afterUpload,
    }
  },
  components: { IocnLink },
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
