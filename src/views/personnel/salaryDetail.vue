<template>
  <div class="app-container">
    <TableList
      :list="list"
      :list-loading="listLoading"
      :table-format="tableFormat"
    />
    <el-row :gutter="20">
      <el-col :offset="19" :span="3" class="total_number">
        {{ totalCount | toThousandFilter }}
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24" style="text-align:center">
        <el-button type="primary" @click="newSalaryClick">新增項目</el-button>
        <el-button type="success" @click="saveData">儲存</el-button>
      </el-col>
    </el-row>
    <EditDialog :dialog-data="dialogData" />
  </div>
</template>

<script>
import { getSalaryDetail, patchSalary } from '@/api/user'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'SalaryDetail',
  components: {},
  data() {
    return {
      detailData: null,
      list: null,
      total: 0,
      listLoading: true,
      dialogData: {},
      tableFormat: null,
      totalCount: 0
    }
  },
  computed: {
    ...mapState({
      salaryDetail: state => state.user.salaryDetail,
      rules: state => state.user.salaryDetailRules
    }),
    ...mapGetters([
      'defaultData',
      'timeToFormat',
      'timeToRFC'
    ])
  },
  watch: {
    list: {
      handler: function (data) {
        this.totalCount = 0
        for(let item of this.list) {
          this.totalCount += item.subtotal * 1
        }
      },
      deep: true
    }
  },
  created() {
    this.tableFormat = this.salaryDetail
    // Add Button listener
    this.tableFormat.CtrlBtn = { label: '操作', list: 99, width: '230px', button: [
      { label: '修改', type: 'primary', size: 'mini', callMethod: this.editItemClick },
      { label: '刪除', type: 'danger', size: 'mini', callMethod: this.removeItemClick }
    ]
    }
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      var paras = {}
      paras.salary_trial_balance_id = this.$route.params.pathMatch
      getSalaryDetail(paras).then((response) => {
        if (typeof response.data === 'object') {
          this.detailData = response.data
          this.list = response.data.salary_detail
        } else {
          this.detailData = null
          this.list = []
        }
        this.listLoading = false
      })
    },
    newSalaryClick() {
      const tbFormat = JSON.parse(JSON.stringify(this.tableFormat))

      const dialogData = {}
      dialogData.dialogName = '新增'
      dialogData.tableFormat = tbFormat
      dialogData.dialogFormVisible = true
      dialogData.temp = this.defaultData(this.salaryDetail)
      dialogData.rules = this.rules
      dialogData.submitEvent = this.newData
      this.dialogData = dialogData
    },
    editItemClick(sope) {
      const tbFormat = JSON.parse(JSON.stringify(this.tableFormat))
      const dialogData = {}
      dialogData.dialogName = '編輯'
      dialogData.tableFormat = { ...tbFormat }
      dialogData.dialogFormVisible = true
      dialogData.temp = sope.row
      dialogData.rules = this.rules
      dialogData.submitEvent = this.updateData
      this.dialogData = dialogData
    },
    // 新增資料
    newData(paras) {
      paras.created_at = this.timeToRFC(new Date())
      this.list.push(paras)
      this.dialogData.dialogFormVisible = false
      this.$alert('編輯完畢請按"儲存"鈕保存變更。', '提示', {
        confirmButtonText: '確定'
      })
    },
    // 更新資料
    updateData(paras) {
      this.dialogData.dialogFormVisible = false
      this.$alert('編輯完畢請按"儲存"鈕保存變更。', '提示', {
        confirmButtonText: '確定'
      })
    },
    removeItemClick({ $index, row }) {
      const _this = this
      this.$confirm('確定要刪除?', 'Warning', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const newList = []
          _this.list.forEach((element, index) => {
            if ($index !== index)newList.push(element)
          })
          _this.list = newList
          this.$alert('編輯完畢請按"儲存"鈕保存變更。', '提示', {
            confirmButtonText: '確定'
          })
        })
        .catch(err => { console.error(err) })
    },
    saveData() {
      const paras = {}
      paras.trialbalance_id = this.$route.params.pathMatch
      paras.salary_detail = this.list
      patchSalary(paras)
        .then((response) => {
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

<style scoped lang="scss">
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.el-row {
  margin: 20px 0;
}

.total_number {
  font-weight: 600;
  text-align:center;
  font-size: 22px;
  color: #cf0000;
  border-bottom: #000 1px solid;

  &::before{
    content: "總計：";
    font-size: 22px;
  }
}
</style>
