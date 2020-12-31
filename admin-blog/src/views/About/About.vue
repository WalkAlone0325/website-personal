<template>
  <div>
    <h3>关于</h3>
    <el-form ref="tagFormRef" status-icon :rules="rules" :model="tagForm" label-width="100px">
      <el-form-item label="作者">
        <el-input v-model="setting.avator"></el-input>
      </el-form-item>
      <el-form-item label="信息">
        <el-input v-model="setting.info"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-input v-model="setting.about.avator_img"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="setting.about.content_info"></el-input>
      </el-form-item>
      <el-form-item label="首页背景">
        <el-input v-model="setting.home.bg_img"></el-input>
      </el-form-item>
      <el-form-item label="首页描述">
        <el-input v-model="setting.home.desc"></el-input>
      </el-form-item>
      <el-form-item label="首页图片">
        <el-input v-model="setting.home.img_url"></el-input>
      </el-form-item>
    </el-form>
    {{ setting.avator }}
    {{ setting.info }}
    <!-- {{ setting.about }} -->
    {{ setting.home.bg_img }}
    {{ setting.info }}
    <div v-for="item in iconList" :key="item._id">
      {{ item.icon }}-{{ item.name }}-{{ item.link }}
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, getCurrentInstance, reactive, toRefs } from 'vue'

export default defineComponent({
  setup() {
    const settingList = reactive({
      iconList: [],
      setting: {
        avator: '',
        info: '',
        about: {
          avator_img: '',
          content_info: '',
        },
        home: {
          bg_img: '',
          desc: '',
          img_url: '',
        },
      },
    })
    const { ctx } = getCurrentInstance()
    console.log(getCurrentInstance())
    onMounted(() => {
      ctx.$axios.get('/setting').then(res => {
        // console.log(res)
        settingList.iconList = res.data.iconList
        settingList.setting = res.data.setting[0]
        console.log(settingList.iconList)
        console.log(settingList.setting)
      })
    })

    return { ...toRefs(settingList) }
  },
})
</script>

<style></style>
