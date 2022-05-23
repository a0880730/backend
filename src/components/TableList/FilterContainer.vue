<template>
  <div class="filter-container">
    <template v-for="(item, index) in tableFormat">

      <!--1:基本文字框-->
      <el-input v-if="item.search === 1" :key="index" v-model="listQuery[index]" :placeholder="item['label']" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <!--2:單選陣列-->
      <el-select
        v-if="item.search === 2"
        :key="index"
        v-model="listQuery[index]"
        class="filter-item"
        :placeholder="item['label']"
      >
        <el-option
          v-for="(value, dataKey) in item.colType.data"
          :key="dataKey"
          :label="value"
          :value="dataKey"
        />
      </el-select>

      <!--6:時間類型-->
      <el-date-picker v-if="item.search === 6" :key="index" v-model="listQuery[index + '_start']" type="datetime" :placeholder="item['label']" class="filter-item" />
      <span v-if="item.search === 6" :key="index"> ~ </span>
      <el-date-picker v-if="item.search === 6" :key="index" v-model="listQuery[index + '_end']" type="datetime" :placeholder="item['label']" class="filter-item" />

    </template>
    <el-button v-if="searchBtnShow" class="filter-item" type="primary" icon="el-icon-search" @click="$emit('get-list')">
      搜尋
    </el-button>
    <el-button v-if="nweBtn !== null" class="filter-item" type="primary" icon="el-icon-edit" @click="nweBtn()">新增</el-button>
  </div>
</template>

<script>
export default {
  name: 'EditDialog',
  filters: {
  },
  props: {
    nweBtn: {
      type: Function,
      default: null
    },
    listQuery: {
      type: Object,
      default() {
        return {}
      }
    },
    tableFormat: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      searchBtnShow: false
    }
  },
  watch: {
  },
  created() {
    for (var i in this.tableFormat) {
      if (this.tableFormat[i].search >= 0) {
        this.searchBtnShow = true
      }
    }
  },
  methods: {
    handleFilter(val) {
      this.$emit('listQuery', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
