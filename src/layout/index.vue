<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <div v-if="showTitle()" class="page_title">
        <span class="strip" />
        {{ $route.meta.title }}</div>
      <app-main />
    </div>
  </div>
</template>

<script>
// import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      listQuery: {
        page: 1,
        page_size: 99999
      }
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  async created() {
    // 取得管理員放在全域store
    await this.getUserDataToStore()
    // 取得商品放在全域store
    await this.getPorductDataToStore()
    // 零用金餘額
    this.$store.dispatch('pettyCash/getPettyCash')
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    async getPorductDataToStore() {
      const paras = { ...this.listQuery }
      await this.$store.dispatch('product/getProductInfo', paras)
    },
    async getUserDataToStore() {
      const paras = { ...this.listQuery }
      await this.$store.dispatch('user/getUserList', paras)
    },
    showTitle() {
      if (this.$route.path === '/dashboard') {
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .page_title{
    padding: 20px 20px 0 20px;
    font-size: 25px;

    .strip{
      width: 3px;
      display: inline-block;
      height: 22px;
      background: #4b6381;
      position: relative;
      top: 4px;
      margin-right: 5px;
    }
  }
</style>
