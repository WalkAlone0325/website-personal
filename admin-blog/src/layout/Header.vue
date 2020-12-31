<template>
  <div class="myheader">
    <section class="logo" :class="{ minWidth: isCollapse }">
      <a target="_blank" :href="urlHref" class="logoLink">
        <img :src="imgLogo" alt="logo" />
        <span v-if="!isCollapse">{{ adminTitle }}</span>
      </a>
    </section>
    <section class="header-content">
      <section class="collspan dc cursor" @click="collspan">
        <i class="el-icon-s-unfold" v-if="isCollapse" title="展开"></i>
        <i class="el-icon-s-fold" v-if="!isCollapse" title="收起"></i>
      </section>
      <div class="bread">
        <BreadCrumb></BreadCrumb>
      </div>
      <!-- 全屏 -->
      <section class="fullscreen cursor dc" @click="toggleFull">
        <i class="el-icon-full-screen" title="全屏"></i>
      </section>
      <!-- 右侧菜单 -->
      <section class="cursor dc">
        <el-dropdown @command="handleDropLink" trigger="click">
          <span class="el-dropdown-link" :title="userInfo.username">
            <img :src="userInfo.user_img" />
            <i class="el-icon-caret-bottom"></i>
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
import { getToken, removeToken, getStorage } from '../utils/auth'
import setting from '../setting'

export default defineComponent({
  name: 'myheader',
  setup() {
    const userInfo = ref({})
    const store = useStore()
    const router = useRouter()
    const { adminTitle, imgLogo, urlHref } = setting

    const isCollapse = computed(() => store.getters['app/isCollapse'])

    function collspan() {
      store.commit('app/updateCollapse', !isCollapse.value)
    }

    function handleDropLink(index) {
      if (index == 1) {
        removeToken()
        router.push('/login')
      } else if (index == 2) {
        window.open(urlHref, '_blank')
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
      userInfo: JSON.parse(getStorage('info')),
      isCollapse,
      collspan,
      handleDropLink,
      toggleFull,
      adminTitle,
      imgLogo,
      urlHref,
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
      border-radius: 50%;
    }
  }
  .header-content {
    display: flex;
    flex: 1;
    padding: 0 20px 0 0;
    align-items: center;
    .collspan {
      i {
        font-size: 24px;
        color: #333;
        padding: 20px;
        &:hover {
          background-color: #eee;
        }
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
      i {
        font-size: 24px;
        color: #333;
        padding: 20px;
        &:hover {
          background-color: #eee;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.el-dropdown {
  .el-dropdown-link {
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 6px;
    }
  }
}
</style>
