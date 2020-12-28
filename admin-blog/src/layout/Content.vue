<template>
  <div class="mycontent" :class="{ minWidth: isCollapse }">
    <el-scrollbar>
      <div class="main" :style="{ minHeight: pageheight + 'px' }">
        <!-- <transition name="fade-page" mode="out-in">
          <router-view></router-view>
        </transition> -->
        <router-view v-slot="{ Component }">
          <transition name="fade-page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import Utils from '@/utils/utils'

export default defineComponent({
  name: 'mycontent',
  setup() {
    // init
    const pageheight = ref(window.innerHeight - 50 - 20 - 1)
    const store = useStore()

    // computed
    const isCollapse = computed(() => store.getters['app/isCollapse'])

    // onMounted
    onMounted(() => {
      /**
       *  50 header 高度
       *  1  mycontent margin-top: 1px;
       *  20 mycontent padding:20 0;
       */
      window.addEventListener(
        'resize',
        Utils.throttle(() => {
          pageheight.value = window.innerHeight - 50 - 20 - 1
        }, 500),
        false,
      )
    })

    return { pageheight, isCollapse }
  },
})
</script>

<style lang="scss" scoped>
.mycontent {
  position: fixed;
  top: 50px;
  right: 0;
  bottom: 0;
  left: 200px;
  z-index: 11 !important;
  overflow: hidden;
  box-sizing: border-box;
  margin-top: 1px;
  padding: 0 10px;
  background: #f0f3f4;
  -webkit-transition: all 0.3s;
  transition: left 0.3s;
  &.minWidth {
    left: 64px !important;
  }
  .main {
    box-sizing: border-box;
    margin-top: 10px;
    padding-bottom: 20px;
    background: #fff;
  }
  .el-scrollbar {
    height: 100%;
    .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }
  }
}
</style>
