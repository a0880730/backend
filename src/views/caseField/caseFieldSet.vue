<template>
  <div class="app-container">
    <FilterContainer
      :table-format="tableFormat"
      :list-query.sync="listQuery"
      :nwe-btn="newPersonnalClick"
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

// import { getCustomerInfo } from '@/api/customer'
import { getBrickRange } from '@/api/caseField'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'CaseFieldSet',
  components: {},
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20
      },
      tableFormat: {},
      dialogData: {}
    }
  },
  computed: {
    ...mapState({
      CaseFieldData: state => state.caseField.CaseBrickRange,
      rules: state => state.caseField.CaseBrickRangeRules
    }),
    ...mapGetters([
      'defaultData'
    ])
  },
  created() {
    this.tableFormat = this.CaseFieldData

    this.tableFormat.CtrlBtn = { label: '操作', list: 99, width: '230px', button: [
      { label: '編輯', type: 'primary', size: 'mini', callMethod: this.editItemClick },
      { label: '刪除', type: 'danger', size: 'mini', callMethod: this.removeItemClick }
    ]
    }
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      var paras = {}
      paras = Object.assign({}, this.listQuery)
      getBrickRange(paras).then((response) => {
        if (response.code === 200) {
          this.list = response.data
          this.total = this.list.length
        } else {
          this.list = []
          this.total = 0
        }
        this.listLoading = false
      })
    },
    newPersonnalClick() {
      var dialogData = {}
      dialogData.dialogName = '新增'
      dialogData.tableFormat = this.tableFormat
      dialogData.dialogFormVisible = true
      dialogData.temp = this.defaultData(this.CaseFieldData)
      dialogData.rules = this.rules
      dialogData.submitEvent = this.newData
      this.dialogData = dialogData
    },
    editItemClick(sope) {
      var dialogData = {}
      dialogData.dialogName = '編輯'
      dialogData.tableFormat = this.tableFormat
      dialogData.dialogFormVisible = true
      dialogData.temp = { ...sope.row }
      dialogData.rules = this.rules
      dialogData.submitEvent = this.updateData
      this.dialogData = dialogData
    },
    // 新增資料
    newData(paras) {
      this.$store.dispatch('caseField/newBrickRange', paras)
        .then((response) => {
          // 重新取得清單
          this.getList()
          if (typeof response.notify === 'object') {
            this.$notify(response.notify)
          }
          this.dialogData.dialogFormVisible = false
        })
        .catch(() => {
          this.$notify({ title: '失敗', message: '資料新增失敗', type: 'error', duration: 2000 })
        })
    },
    // 更新資料
    updateData(paras) {
      this.$store.dispatch('caseField/updateBrickRange', paras)
        .then(() => {
          // 重新取得清單
          this.getList()
          this.$notify({ title: '成功', message: '資料更新成功', type: 'success', duration: 2000 })
        })
        .catch(() => {
          this.$notify({ title: '失敗', message: '資料更新失敗', type: 'error', duration: 2000 })
        })
    },
    removeItemClick({ $index, row }) {
      this.$confirm('確定要刪除?', 'Warning', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.$store.dispatch('caseField/deleteBrickRange', row)
            .then(() => {
              // 重新取得清單
              this.getList()
              this.$notify({ title: '成功', message: '資料刪除成功', type: 'success', duration: 2000 })
            })
            .catch(() => {
              this.$notify({ title: '失敗', message: '資料刪除失敗', type: 'error', duration: 2000 })
            })
        })
        .catch(err => { console.error(err) })
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
