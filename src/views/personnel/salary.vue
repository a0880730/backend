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
import { getSalary, newSalary, deleteSalary } from '@/api/user'
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
      PersonnelDataList: state => state.user.PersonnelDataList
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
    const LastDay = new Date(today.getFullYear() + '-' + month + '-01 00:00:00')
    this.tableFormat.month.default = firstDay
    this.tableFormat.start_at.default = firstDay
    LastDay.setMonth(LastDay.getMonth() + 1)
    LastDay.setSeconds(LastDay.getSeconds() - 1)
    this.tableFormat.end_at.default = LastDay

    // 自定義的顯示方法
    this.tableFormat.user_id.showMethod = this.userIdToAdmin
    // Add Button listener
    this.tableFormat.CtrlBtn = { label: '操作', list: 99, width: '230px', button: [
      { label: '查看', type: 'primary', size: 'mini', callMethod: this.jumpInfo },
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
      getSalary(paras).then((response) => {
        if (response.pages.total_records > 0) {
          this.list = response.data
          this.total = this.list.length
        } else {
          this.list = []
          this.total = 0
        }
        this.listLoading = false
      })
    },
    newSalaryClick() {
      const tbFormat = JSON.parse(JSON.stringify(this.tableFormat))
      tbFormat.salary.edit = -1

      const dialogData = {}
      dialogData.dialogName = '新增'
      dialogData.tableFormat = tbFormat
      dialogData.dialogFormVisible = true
      dialogData.temp = this.defaultData(this.salaryData)
      dialogData.rules = this.rules
      dialogData.submitEvent = this.newData
      this.dialogData = dialogData
    },
    // 新增資料
    newData(paras) {
      paras.month = this.timeToFormat(paras.month)
      // paras.yesr = paras.month.split('-')[0]
      paras.month = paras.month.split('-')[1] * 1
      paras.start_at = this.timeToRFC(paras.start_at)
      paras.end_at = this.timeToRFC(paras.end_at)
      newSalary(paras)
        .then((response) => {
          // 重新取得清單
          this.getList()
          this.dialogData.dialogFormVisible = false
          this.$notify({ title: '成功', message: '資料新增成功', type: 'success', duration: 2000 })
        })
        .catch(() => {
          this.$notify({ title: '失敗', message: '資料新增失敗', type: 'error', duration: 2000 })
        })
    },
    removeItemClick({ $index, row }) {
      this.$confirm('確定要刪除?', 'Warning', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deleteSalary(row).then((response) => {
            console.log(response)
            // 重新取得清單
            this.getList()
            this.$notify({ title: '成功', message: '資料刪除成功', type: 'success', duration: 2000 })
          })
            .catch(() => {
              this.$notify({ title: '失敗', message: '資料刪除失敗', type: 'error', duration: 2000 })
            })
        })
        .catch(err => { console.error(err) })
    },
    jumpInfo(sope) {
      this.$router.push({ path: 'salaryDetail/' + sope.row.salary_trial_balance_id })
    },
    userIdToAdmin(scope) {
      if (this.PersonnelDataList[scope.user_id] != null) {
        return this.PersonnelDataList[scope.user_id].username
      }
      return ''
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
