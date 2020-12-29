<template>
  <div class="article-edit-page">
    <!-- {{ id }} -->
    <el-form
      class="article-form"
      :model="articleForm"
      :rules="rules"
      ref="articleFormRef"
      label-width="80px"
    >
      <el-form-item label="标题" prop="title" required>
        <el-input v-model="articleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="avatar">
        <el-select v-model="articleForm.avatar" placeholder="请选择作者">
          <el-option label="独行" value="独行"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tags" v-if="tagList.length !== 0">
        <el-select v-model="articleForm.tags" multiple placeholder="请选择文章标签">
          <el-option
            v-for="item in tagList"
            :key="item._id"
            :label="item.tag_name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="封面" prop="img_url">
        <el-input v-model="articleForm.img_url"></el-input>
        或
        <!-- <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <img
            v-if="articleForm.img_url"
            :src="articleForm.img_url"
            alt="图片找不见！"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
      </el-form-item>

      <el-form-item label="简介" prop="desc">
        <el-input type="textarea" v-model="articleForm.desc"></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="articleForm.status" placeholder="请选择状态">
          <el-option label="草稿" :value="0"></el-option>
          <el-option label="发表" :value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <!-- <mavon-editor v-model="articleForm.content" ref="md" @imgAdd="imgAdd" /> -->
        <el-input v-model="articleForm.content"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateArticle">立即上传</el-button>
        <el-button style="margin-left: 200px;" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTag } from '../../api/tag'
import { getArticle, delArticle, putArticle, addArticle, getArticleItem } from '../../api/article'
import { useRouter } from 'vue-router'

export default defineComponent({
  props: { id: { type: String } },
  setup(props) {
    const tagList = ref([])
    const articleForm = reactive({
      title: '',
      img_url: '',
      avatar: '',
      desc: '',
      content: '',
      status: null,
      tags: [],
    })
    const rules = reactive({
      title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
      img_url: [
        {
          required: true,
          message: '请选择一张封面地址或图片',
          trigger: 'blur',
        },
        {
          pattern: /https?:\/{2}[^\s]*/,
          message: '地址请以http或https开头字母和数字',
        },
      ],
      status: [{ required: true, message: '请选择状态', trigger: 'change' }],
      content: [{ required: true, message: '请填写文章内容', trigger: 'blur' }],
    })
    const articleFormRef = ref(null)
    const router = useRouter()

    // onMounted
    onMounted(() => {
      props.id && getItem()
      getTagList()
    })

    // methods
    // 获取标签列表
    const getTagList = async () => {
      const res = await getTag()
      if (res.code === 200) {
        tagList.value = res.data
      }
    }
    // 重置表单
    const resetForm = () => {
      ElMessageBox.confirm(`是否重置？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          articleFormRef.value.resetFields()
          articleForm.tags = []
          ElMessage({
            type: 'success',
            message: '文章内容重置成功',
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消文章内容重置',
          })
        })
    }
    // 上传文章
    const updateArticle = () => {
      articleFormRef.value.validate(valid => {
        if (valid) {
          ElMessageBox.confirm(`是否上传文章 “${articleForm.title}“`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success',
          })
            .then(async () => {
              console.log(props.id)
              if (props.id) {
                const res = await putArticle(props.id, articleForm)
                if (res.code === 200) {
                  ElMessage({
                    type: 'success',
                    message: '文章修改成功！',
                  })
                }
              } else {
                const res = await addArticle(articleForm)
                if (res.code === 200) {
                  ElMessage({
                    type: 'success',
                    message: '文章上传成功!',
                  })
                }
              }
              router.push('/article/list')
            })
            .catch(() => {
              ElMessage({
                type: 'info',
                message: '已取消上传',
              })
            })
        } else {
          return false
        }
      })
    }
    // 获取文章详情列表
    const getItem = async () => {
      const res = await getArticleItem(props.id)
      articleForm.title = res.data.title
      articleForm.avatar = res.data.avatar
      articleForm.img_url = res.data.img_url
      articleForm.desc = res.data.desc
      articleForm.content = res.data.content
      articleForm.status = res.data.status
      articleForm.tags = res.data.tags
    }

    return {
      tagList,
      articleForm,
      rules,
      articleFormRef,
      resetForm,
      updateArticle,
    }
  },
})
</script>

<style lang="scss">
.article-edit-page {
  width: 94%;
  margin: 0 auto;
  .article-form {
    padding-top: 20px;
  }
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
  width: 356px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 356px;
  height: 178px;
  display: block;
}
</style>
