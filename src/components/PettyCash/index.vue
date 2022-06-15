<template>
  <div class="header-coin" title="點擊查看紀錄" @click.stop="click">
    <svg-icon class-name="coin-icon" icon-class="coin" />
    零用金：<span class="petty-cash" :class="[{ danger_txt:pettyCash < 0 }]">{{ pettyCash }}</span>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'HeardPettyCash',
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      pettyCash: state => state.pettyCash.pettyCash
    })
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    click() {
      this.$router.replace('/pettyCash')
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
