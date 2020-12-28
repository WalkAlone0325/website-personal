<template>
  <div class="home">
    <header-comp></header-comp>
    <sider-bar></sider-bar>
    <content-comp></content-comp>
  </div>
</template>

<script>
import HeaderComp from '@/layout/Header'
import SiderBar from '@/layout/Siderbar'
import ContentComp from '@/layout/Content'

export default {
  name: 'home',
  components: {
    HeaderComp,
    SiderBar,
    ContentComp,
  },
}
</script>
