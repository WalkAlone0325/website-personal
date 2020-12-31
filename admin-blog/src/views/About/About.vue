<template>
  <div class="about-page">
    <div class="title-container">
      <h3>关于</h3>
      <el-button class="about-btn" size="small" type="primary" @click="handleSaveSetting">
        保 存
      </el-button>
    </div>

    <el-form
      ref="settingFormRef"
      status-icon
      :rules="rules"
      :model="settingForm"
      label-width="100px"
    >
      <el-form-item label="作者" prop="avator">
        <el-input v-model="settingForm.avator"></el-input>
      </el-form-item>
      <el-form-item label="信息" prop="info">
        <el-input v-model="settingForm.info"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avator_img">
        <el-input v-model="settingForm.avator_img"></el-input>
        或
        <el-upload
          class="img-uploader"
          :action="$axios.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="avatorImgUpload"
          :headers="getAuthHeader()"
        >
          <div class="avator-img">
            <img v-if="settingForm.avator_img" :src="settingForm.avator_img" alt="图片找不见！" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="内容" prop="content_info">
        <el-input v-model="settingForm.content_info"></el-input>
      </el-form-item>
      <el-form-item label="首页背景" prop="bg_img">
        <el-input v-model="settingForm.bg_img"></el-input>
        或
        <el-upload
          class="avatar-uploader"
          :action="$axios.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="bgImgUpload"
          :headers="getAuthHeader()"
        >
          <img
            v-if="settingForm.bg_img"
            :src="settingForm.bg_img"
            alt="图片找不见！"
            class="avatar-bg-img"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="首页描述" prop="desc">
        <el-input v-model="settingForm.desc"></el-input>
      </el-form-item>
      <el-form-item label="首页图片" prop="img_url">
        <el-input v-model="settingForm.img_url"></el-input>
        或
        <el-upload
          class="home-url-uploader"
          :action="$axios.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="imgUrlUpload"
          :headers="getAuthHeader()"
        >
          <img
            v-if="settingForm.img_url"
            :src="settingForm.img_url"
            alt="图片找不见！"
            class="avatar-imgurl"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent, onMounted, ref, reactive, toRefs, nextTick, inject } from 'vue'
import { getSetting, putSetting } from '../../api/setting'

export default defineComponent({
  setup() {
    const settingList = ref({})
    const settingForm = reactive({
      _id: null,
      avator: '',
      info: '',
      avator_img: '',
      content_info: '',
      bg_img: '',
      desc: '',
      img_url: '',
    })
    const rules = reactive({
      avator: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
      ],
      info: [
        { required: true, message: '请输入信息', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符' },
      ],
      avator_img: [
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
      avator_imgurl: [
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
      content_info: [{ required: true, message: '请输入简介', trigger: 'blur' }],
      bg_img: [
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
      desc: [{ required: true, message: '请输入描述信息', trigger: 'blur' }],
      img_url: [
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
    })
    const settingFormRef = ref(null)

    onMounted(() => {
      getSettingList()
    })

    const getSettingList = async () => {
      const res = await getSetting()
      if (res.code === 200) {
        settingList.value = res.data[0]
        const {
          _id,
          avator,
          info,
          avator_img,
          content_info,
          bg_img,
          desc,
          img_url,
        } = settingList.value
        settingForm._id = _id
        settingForm.avator = avator
        settingForm.info = info
        settingForm.avator_img = avator_img
        settingForm.content_info = content_info
        settingForm.bg_img = bg_img
        settingForm.desc = desc
        settingForm.img_url = img_url
      }
    }

    const handleSaveSetting = () => {
      if (settingFormRef.value) {
        settingFormRef.value.validate(async valid => {
          if (valid && settingForm._id !== null) {
            ElMessageBox.confirm('正在保存设置内容, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success',
            })
              .then(async () => {
                // 发送请求
                const res = await putSetting(settingForm._id, settingForm)
                if (res.code === 200) {
                  ElMessage({
                    type: 'success',
                    message: res.msg,
                  })
                }
                getSettingList()
              })
              .catch(() => {
                ElMessage({
                  type: 'info',
                  message: '已取消保存',
                })
              })
          } else {
            ElMessage({
              type: 'warning',
              message: '请输入正确的信息',
            })
            return false
          }
        })
      }
    }

    // 图片上传
    const imgUrlUpload = res => {
      settingForm.img_url = res.filename
    }
    const bgImgUpload = res => {
      settingForm.bg_img = res.filename
    }
    const avatorImgUpload = res => {
      settingForm.avator_img = res.filename
    }

    return {
      settingList,
      settingForm,
      rules,
      settingFormRef,
      handleSaveSetting,
      imgUrlUpload,
      bgImgUpload,
      avatorImgUpload,
      getAuthHeader: inject('getAuthHeader'),
    }
  },
})
</script>

<style lang="scss">
.about-page {
  width: 94%;
  margin: 0 auto;
  .title-container {
    border-bottom: 1px solid #ddd;
    margin-bottom: 16px;
    h3 {
      display: inline-block;
      margin-right: 60px;
      padding: 6px 0 4px 20px;
    }
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.img-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-upload:hover {
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
.avatar-imgurl {
  width: 200px;
  height: 200px;
}
.avator-img {
  width: 100px;
  height: 100px;
  img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
}
.avatar-bg-img {
  width: 356px;
  height: 178px;
  display: block;
}
</style>
