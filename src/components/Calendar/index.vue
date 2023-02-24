<template>
  <div
    v-if="
      router.indexOf('*') !== -1 ||
      router.some((pageName) => permissionArray.indexOf(pageName) !== -1)
    "
    class="header-coin"
    title="點擊查看行事曆"
    @click.stop="click"
  >
    <svg-icon class-name="calendar-icon" icon-class="calendar" />
    <!-- <el-badge :value="12" class="item"> 行事曆 </el-badge> -->
    行事曆
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Calendar",
  data() {
    return {
      permissionArray: ["Calendar", "Todo"],
    };
  },
  computed: {
    ...mapState({
      router: (state) => state.permission.permissions,
    }),
  },
  watch: {},
  mounted() {},
  methods: {
    click() {
      if (this.router.some((pageName) => pageName === "Calendar")) {
        this.$router.replace("/calendar");
      } else if (this.router.some((pageName) => pageName === "Todo")) {
        this.$router.replace("/calendar/todo");
      } else {
        this.$router.replace("/calendar");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header-coin {
  cursor: pointer;
}
.petty-cash {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
}
.danger_txt {
  color: #ff0000;
  font-size: 26px;
}
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
