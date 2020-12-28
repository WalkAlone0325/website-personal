<template>
  <div class="myheader">
    <section class="logo" :class="{ minWidth: isCollapse }">
      <a target="_blank" href="xx" class="logoLink">
        <img src="./images/logo.png" alt="logo" />
        <span v-if="!isCollapse">独行的博客</span>
      </a>
    </section>
    <section class="header-content">
      <section class="collspan dc cursor" @click="collspan">
        <img src="./images/close.png" alt="logo" v-if="!isCollapse" />
        <img src="./images/open.png" alt="logo" v-if="isCollapse" />
      </section>
      <div class="bread">
        <BreadCrumb></BreadCrumb>
      </div>
      <!-- 全屏 -->
      <section class="fullscreen cursor dc" @click="toggleFull">
        <img src="./images/fullscreen.png" alt="logo" />
      </section>
      <!-- 右侧菜单 -->
      <section class="cursor dc">
        <el-dropdown @command="handleDropLink" trigger="click">
          <span class="el-dropdown-link">
            {{ userInfo.account }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="1">安全退出</el-dropdown-item>
              <el-dropdown-item command="2">我的博客</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </section>
    </section>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import screenfull from 'screenfull'
import { ElMessage } from 'element-plus'
import BreadCrumb from './BreadCrumb'
import Utils from '@/utils/utils'

export default defineComponent({
  name: 'myheader',
  setup() {
    const userInfo = ref({})
    const store = useStore()
    const router = useRouter()

    const isCollapse = computed(() => store.getters['app/isCollapse'])

    // 获取用户信息
    userInfo.value = Utils.getCookie('DEFAULT_TOKEN')
      ? JSON.parse(Utils.getCookie('DEFAULT_TOKEN'))
      : {}

    function collspan() {
      store.commit('app/updateCollapse', !isCollapse.value)
    }

    function handleDropLink(index) {
      if (index == 1) {
        Utils.delCookie('DEFAULT_TOKEN')
        router.push('/login')
      } else if (index == 2) {
        window.open('https://www.baidu.com', '_blank')
      }
    }

    // 全屏操作
    function toggleFull() {
      if (screenfull.isEnabled) {
        screenfull.toggle()
      } else {
        ElMessage({
          type: 'warning',
          message: '你的浏览器不支持全屏',
        })
        return false
      }
    }

    return {
      userInfo,
      isCollapse,
      collspan,
      handleDropLink,
      toggleFull,
    }
  },
  components: {
    BreadCrumb,
  },
})
</script>

<style scoped lang="scss">
.myheader {
  position: relative;
  z-index: 10;
  display: flex;
  width: 100%;
  height: 50px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .logo {
    overflow: hidden;
    width: 200px;
    border-bottom: 1px solid #454b61;
    background-color: #3a3f51;
    transition: width 0.3s;
    &.minWidth {
      width: 64px !important;
    }
  }
  .logoLink {
    display: inline-block;
    margin-left: 18px;
    height: 100%;
    color: #fff;
    font-weight: bold;
    font-size: 15px;
    line-height: 50px;
    img {
      position: relative;
      top: -3px;
      margin-right: 8px;
      height: 28px;
      vertical-align: middle;
    }
  }
  .header-content {
    display: flex;
    flex: 1;
    padding: 0 20px;
    align-items: center;
    .collspan {
      img {
        display: block;
      }
    }
    .bread {
      display: flex;
      align-items: center;
      flex: 1;
      padding-left: 15px;
    }
    .fullscreen {
      margin-right: 30px;
      img {
        display: block;
      }
    }
  }
}
</style>
