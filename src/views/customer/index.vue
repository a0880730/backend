<template>
  <div class="app-container">

    <FilterContainer
      :table-format="tableFormat"
      :list-query.sync="listQuery"
      :nwe-btn="newItemClick"
      @get-list="getList"
    />

    <TableList
      :list="list"
      :list-loading="listLoading"
      :table-format="tableFormat"
      @editItemClick="editItemClick"
    />
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_size"
      @pagination="getList"
    />
    <EditDialog :dialog-data="dialogData" />
  </div>
</template>

<script>
import { getCustomerInfo } from '@/api/customer'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'CustomerList',
  components: {},
  filters: {
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20
      },
      dialogData: {}
    }
  },
  computed: {
    ...mapState({
      CustomerData: state => state.customer.CustomerData,
      rules: state => state.customer.rules
    }),
    ...mapGetters([
      'defaultData'
    ])
  },
  created() {
    this.tableFormat = this.CustomerData
    // Add Button listener
    this.tableFormat.CtrlBtn = { label: '操作', list: 99, width: '230px', button: [
      { label: '編輯', type: 'primary', size: 'mini', callMethod: this.editItemClick }
    ]
    }
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      var paras = {}
      paras = Object.assign({}, this.listQuery)
      getCustomerInfo(paras).then((response) => {
        this.list = response.data
        this.total = response.pages.total_records
        this.listLoading = false
      })
    },
    newItemClick() {
      var dialogData = {}
      dialogData.dialogName = '新增'
      dialogData.tableFormat = this.tableFormat
      dialogData.dialogFormVisible = true
      dialogData.temp = this.defaultData(this.CustomerData)
      dialogData.rules = this.rules
      dialogData.submitEvent = this.newData
      this.dialogData = dialogData
    },
    editItemClick(sope) {
      var dialogData = {}
      dialogData.dialogName = '編輯'
      dialogData.tableFormat = this.tableFormat
      dialogData.dialogFormVisible = true
      dialogData.temp = sope.row
      dialogData.rules = this.rules
      dialogData.submitEvent = this.updateData
      this.dialogData = dialogData
    },
    // 新增資料
    newData(paras) {
      this.$store.dispatch('customer/newData', paras)
        .then(() => {
          // 重新取得清單
          this.getList()
          this.dialogData.dialogFormVisible = false
          this.$notify({ title: '成功', message: '資料新增成功', type: 'success', duration: 2000 })
        })
        .catch(() => {
          this.$notify({ title: '失敗', message: '資料新增失敗', type: 'error', duration: 2000 })
        })
    },
    // 更新資料
    updateData(paras) {
      this.$store.dispatch('customer/updateData', paras)
        .then(() => {
          // 重新取得清單
          this.getList()
          this.dialogData.dialogFormVisible = false
          this.$notify({ title: '成功', message: '資料更新成功', type: 'success', duration: 2000 })
        })
        .catch(() => {
          this.$notify({ title: '失敗', message: '資料更新失敗', type: 'error', duration: 2000 })
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
