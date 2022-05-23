<template>
  <div class="app-container">

    <FilterContainer
      :table-format="tableFormat"
      :list-query.sync="listQuery"
      @get-list="getList"
    />

    <TableList
      :list="list"
      :list-loading="listLoading"
      :table-format="tableFormat"
    />
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_size"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getProductRecord } from '@/api/product'
import Pagination from '@/components/Pagination'
import TableList from '@/components/TableList'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ProductList',
  components: { Pagination, TableList },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20
      },
      dialogData: {},
      defaultInfo: {}
    }
  },
  computed: {
    ...mapState({
      RecordData: state => state.product.RecordData
    }),
    ...mapGetters([
      'defaultData'
    ])
  },
  created() {
    this.tableFormat = this.RecordData
    this.defaultInfo = this.defaultData(this.RecordData)
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      var paras = {}
      paras = Object.assign({}, this.listQuery)
      getProductRecord(paras).then((response) => {
        this.list = response.data
        this.total = response.pages.total_records
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
