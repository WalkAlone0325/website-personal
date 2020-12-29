<template>
  <div class="toollinksList-page">
    <h2>工链管理</h2>
    <el-button style="margin-left: 20px;" type="primary" @click="createToollink">
      添加工链
    </el-button>

    <!-- 添加工链 -->
    <el-dialog :title="toolTitle" v-model="dialogVisible">
      <el-form ref="toolFormRef" :rules="rules" :model="toolForm" label-width="80px">
        <el-form-item label="工链名称" prop="tool_name">
          <el-input v-model="toolForm.tool_name"></el-input>
        </el-form-item>
        <el-form-item label="工链描述" prop="tool_desc">
          <el-input v-model="toolForm.tool_desc"></el-input>
        </el-form-item>
        <el-form-item label="工链地址" prop="tool_url">
          <el-input v-model="toolForm.tool_url"></el-input>
        </el-form-item>
        <el-form-item label="工链图标" prop="tool_imgurl">
          <el-input v-model="toolForm.tool_imgurl"></el-input>
          或
          <!-- <el-upload
            class="avatar-uploader"
            :action="$http.defaults.baseURL + '/upload'"
            :show-file-list="false"
            :on-success="afterUpload"
          >
            <img
              v-if="create.tool_imgurl"
              :src="create.tool_imgurl"
              alt="图片找不见！"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleToolLink()">提 交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 表格数据列表 -->
    <el-table :data="toolLinkList" border style="margin: 0 auto; margin-top: 20px">
      <el-table-column type="index" width="100" label="#"></el-table-column>
      <el-table-column prop="tool_name" label="工链名称"></el-table-column>
      <el-table-column
        prop="tool_desc"
        label="描述"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="tool_url" label="地址"></el-table-column>
      <el-table-column prop="tool_imgurl" label="图标">
        <template #default="scope">
          <img
            v-if="scope.row.tool_imgurl"
            :src="scope.row.tool_imgurl"
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
import { addToolLink, delToolLink, putToolLink, getToolLink } from '../../api/tool'

export default defineComponent({
  setup() {
    const dialogVisible = ref(false) // 弹窗
    const toolLinkList = ref([]) // 工链列表
    const toolTitle = ref('添加工链')
    const toolForm = reactive({
      _id: null,
      tool_name: '',
      tool_desc: '',
      tool_url: '',
      tool_imgurl: '',
    })
    const rules = reactive({
      tool_name: [
        { required: true, message: '请输入工链名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
      ],
      tool_url: [
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
      tool_imgurl: [
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
    const toolFormRef = ref(null)

    onMounted(() => {
      getLinkList()
    })

    // methods
    // 增、改
    const handleToolLink = () => {
      toolFormRef.value.validate(async valid => {
        if (valid) {
          if (toolForm._id !== null) {
            // 改
            const res = await putToolLink(toolForm._id, toolForm)
            if (res.code === 200) {
              ElMessage({
                type: 'info',
                message: res.msg,
              })
            }
          } else {
            const res = await addToolLink(toolForm)
            console.log(res)
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
      ElMessageBox.confirm('此操作将永久删除该工链, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 发送请求
          const res = await delToolLink(_id)
          if (res.code === 200) {
            ElMessage({
              type: 'success',
              message: '删除工链成功!',
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
    const createToollink = () => {
      dialogVisible.value = true
      toolTitle.value = '添加工链'
      toolForm._id = null
      toolForm.tool_name = ''
      toolForm.tool_desc = ''
      toolForm.tool_url = ''
      toolForm.tool_imgurl = ''
    }
    // 改打开对话框并赋值
    const updateRow = row => {
      dialogVisible.value = true
      if (row && row._id) {
        const toolName = row.tool_name
        toolTitle.value = `编辑工链：${toolName || ''}`
        toolForm._id = row._id
        toolForm.tool_name = toolName
        toolForm.tool_desc = row.tool_desc
      }
    }
    // 获取工链列表
    const getLinkList = async () => {
      const res = await getToolLink()
      if (res.code === 200) {
        toolLinkList.value = res.data
      }
    }

    return {
      dialogVisible,
      toolLinkList,
      toolForm,
      rules,
      toolFormRef,
      toolTitle,
      createToollink,
      handleToolLink,
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
