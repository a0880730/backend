<template>
  <div class="app-container">

    <FilterContainer
      :table-format="tableFormat"
      :list-query.sync="listQuery"
      :nwe-btn="newSalaryClick"
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
import { getSalary, newSalary, patchSalary } from '@/api/user'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'SalaryList',
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
      dialogData: {},
      tableFormat: null
    }
  },
  computed: {
    ...mapState({
      salaryData: state => state.user.salaryData,
      // rules: state => state.user.rules
    }),
    ...mapGetters([
      'defaultData',
      'timeToFormat',
      'timeToRFC'
    ])
  },
  created() {
    this.tableFormat = this.salaryData
    const today = new Date()
    let month = today.getMonth()
    if (month === 0) month = 12
    const firstDay = new Date(today.getFullYear() + '-' + month + '-01 00:00:00')
    this.tableFormat.month.default = today.getFullYear() + '-' + (month)
    this.tableFormat.start_at.default = this.timeToFormat(firstDay)
    firstDay.setMonth(firstDay.getMonth() + 1)
    firstDay.setSeconds(firstDay.getSeconds() - 1)
    this.tableFormat.end_at.default = this.timeToFormat(firstDay)
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
      getSalary(paras).then((response) => {
        if (response.data === 'object') {
          this.total = this.list.length
          this.list = response.data
        } else {
          this.list = []
          this.total = 0
        }
        this.listLoading = false
      })
    },
    newSalaryClick() {
      const dialogData = {}
      dialogData.dialogName = '新增'
      dialogData.tableFormat = { ...this.tableFormat }
      dialogData.dialogFormVisible = true
      dialogData.temp = this.defaultData(this.salaryData)
      dialogData.rules = this.rules
      dialogData.submitEvent = this.newData
      this.dialogData = dialogData
    },
    editItemClick(sope) {
      const tbFormat = JSON.parse(JSON.stringify(this.tableFormat))
      if (sope.row.role === 'admin') {
        delete tbFormat['role']
      }
      tbFormat.username.edit = 4
      const dialogData = {}
      dialogData.dialogName = '編輯'
      dialogData.tableFormat = { ...tbFormat }
      dialogData.dialogFormVisible = true
      dialogData.temp = { ...sope.row }
      dialogData.rules = this.rules
      dialogData.submitEvent = this.updateData
      this.dialogData = dialogData
    },
    // 新增資料
    newData(paras) {
      paras.yesr = paras.month.split('-')[0]
      paras.month = paras.month.split('-')[1]
      paras.start_at = this.timeToRFC(paras.start_at)
      paras.end_at = this.timeToRFC(paras.end_at)
      console.log(paras)
      newSalary(paras)
        .then((response) => {
          console.log(response)
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
      patchSalary(paras)
        .then((response) => {
          console.log(response)
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
