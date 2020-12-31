<template>
  <div class="article-edit-page">
    <h3>写文章</h3>
    <!-- {{ id }} -->
    <el-dialog title="文章设置" v-model="dialogFormVisible" width="40%">
      <el-form
        :model="articleForm"
        :rules="rules"
        ref="articleFormDialogRef"
        label-width="80px"
        size="mini"
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
          <el-upload
            class="avatar-uploader"
            :action="$axios.defaults.baseURL + '/upload'"
            :show-file-list="false"
            :on-success="afterUpload"
            :headers="getAuthHeader()"
          >
            <img
              v-if="articleForm.img_url"
              :src="articleForm.img_url"
              alt="图片找不见！"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleValidate">保 存</el-button>
        </span>
      </template>
    </el-dialog>
    <el-form :model="articleForm" size="mini">
      <el-form-item class="button-group">
        <el-button type="primary" @click="updateArticle">立即上传</el-button>
        <el-upload
          class="upload-demo"
          style="display: inline-block;"
          :action="$axios.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="mdUpload"
          list-type="picture"
          :headers="getAuthHeader()"
        >
          <el-button type="primary">
            <i class="el-icon-picture"></i>
            上传图片
          </el-button>
        </el-upload>
        <el-button type="primary" @click="dialogFormVisible = true">
          文章设置
        </el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
      <el-form-item prop="content">
        <div id="editor">
          <textarea :value="articleForm.content" @input="update"></textarea>
          <div v-html="compiledMarkdown"></div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, inject, ref, toRefs, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTag } from '../../api/tag'
import { getArticle, delArticle, putArticle, addArticle, getArticleItem } from '../../api/article'
import { useRouter } from 'vue-router'
import marked from 'marked'
import debounce from 'lodash.debounce'

export default defineComponent({
  props: { id: { type: String } },
  setup(props) {
    const tagList = ref([])
    const dialogFormVisible = ref(false)
    const articleForm = reactive({
      title: '',
      img_url: '',
      avatar: '',
      desc: '',
      content: '# Hello',
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
    })
    const articleFormDialogRef = ref(null)
    const mdImg = ref('')
    const router = useRouter()

    const compiledMarkdown = computed(() => {
      return marked(articleForm.content)
    })

    // onMounted
    onMounted(() => {
      props.id && getItem()
      getTagList()
    })

    watch(mdImg, () => {
      if (mdImg.value !== '') {
        update()
      }
    })

    // methods
    const update = debounce(e => {
      articleForm.content =
        mdImg.value !== '' ? e.target.value + `![](${mdImg.value})` : e.target.value
      mdImg.value = ''
    })
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
          if (articleFormDialogRef.value) {
            articleFormDialogRef.value.resetFields()
          }
          articleForm.title = ''
          articleForm.img_url = ''
          articleForm.avatar = ''
          articleForm.desc = ''
          articleForm.content = '# Hello'
          articleForm.status = null
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
    // 验证表单
    const handleValidate = () => {
      if (articleFormDialogRef.value) {
        articleFormDialogRef.value.validate(valid => {
          if (valid) {
            dialogFormVisible.value = false
          } else {
            ElMessage({
              type: 'warning',
              message: '请正确填写文章设置',
            })
            return false
          }
        })
      }
    }
    // 上传文章
    const updateArticle = () => {
      if (articleFormDialogRef.value) {
        articleFormDialogRef.value.validate(valid => {
          if (valid) {
            ElMessageBox.confirm(`是否上传文章 “${articleForm.title}“`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success',
            })
              .then(async () => {
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
            ElMessage({
              type: 'warning',
              message: '请正确填写文章设置',
            })
            return false
          }
        })
      } else {
        ElMessage({
          type: 'warning',
          message: '请填写文章设置',
        })
      }
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
    // 图片上传
    const afterUpload = res => {
      articleForm.img_url = res.filename
    }
    // md中图片上传
    const mdUpload = res => {
      mdImg.value = res.filename
      console.log(mdImg.value)
    }

    return {
      tagList,
      dialogFormVisible,
      articleForm,
      rules,
      articleFormDialogRef,
      resetForm,
      handleValidate,
      updateArticle,
      afterUpload,
      compiledMarkdown,
      update,
      mdUpload,
      getAuthHeader: inject('getAuthHeader'),
    }
  },
})
</script>

<style lang="scss">
.article-edit-page {
  width: 94%;
  margin: 0 auto;
  h3 {
    padding: 20px 0 10px 20px;
    // padding: 15px 15px 0 15px;
    border-bottom: 1px solid #ddd;
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
.button-group {
  .el-button {
    margin: 0 20px;
  }
}
#editor {
  margin: 0;
  height: 78vh;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}
textarea,
#editor div {
  display: inline-block;
  width: 49%;
  height: 100%;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px;
}

textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: 'Monaco', courier, monospace;
  padding: 20px;
}

code {
  color: #f66;
}
</style>
