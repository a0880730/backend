<template>
  <div class="header-coin" title="點擊查看行事曆" @click.stop="click">
    <svg-icon class-name="calendar-icon" icon-class="calendar" />
    行事曆
  </div>
</template>

<script>

export default {
  name: 'Calendar',
  data() {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    click() {
      this.$router.replace('/calendar')
    }
  }
}
</script>

<style lang="scss" scoped>
.header-coin{
  cursor: pointer;
}
.petty-cash{
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
}
.danger_txt{
  color: #FF0000;
  font-size: 26px;
}
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
