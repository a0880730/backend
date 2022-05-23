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

import { getCustomerInfo } from '@/api/customer'
import { getInfo } from '@/api/caseField'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'CaseField',
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
      CaseFieldData: state => state.caseField.CaseFieldData,
      rules: state => state.caseField.rules
    }),
    ...mapGetters([
      'defaultData'
    ])
  },
  created() {
    this.tableFormat = this.CaseFieldData

    // 設定特殊項目顯示方式
    this.tableFormat.customer_id.showMethod = (data) => {
      return data.customer.company_name
    }
    this.tableFormat.contractor_id.showMethod = (data) => {
      return data.contractor.company_name
    }
    // 設定特殊項目編輯方式
    this.getCustomerInfo()
    // Add Button listener
    this.tableFormat.CtrlBtn = { label: '操作', list: 99, width: '230px', button: [
      { label: '編輯', type: 'primary', size: 'mini', callMethod: this.editItemClick },
      { label: '查看', type: 'primary', size: 'mini', callMethod: this.jumpInfo }
    ]
    }
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      var paras = {}
      paras = Object.assign({}, this.listQuery)
      getInfo(paras).then((response) => {
        this.list = response.data
        this.total = response.pages.total_records
        this.listLoading = false
      })
    },
    getCustomerInfo() {
      var paras = {
        page: 1,
        page_size: 99999
      }
      getCustomerInfo(paras).then((response) => {
        const companyData = []
        for (const i in response.data) {
          var item = {}
          item.value = response.data[i].customer_id
          item.label = response.data[i].company_name
          companyData.push(item)
        }

        this.tableFormat.customer_id.selectData = { ...companyData }
        this.tableFormat.contractor_id.selectData = { ...companyData }
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
      dialogData.temp = sope.row
      dialogData.rules = this.rules
      dialogData.submitEvent = this.updateData
      this.dialogData = dialogData
    },
    // 新增資料
    newData(paras) {
      this.$store.dispatch('caseField/newData', paras)
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
      this.$store.dispatch('caseField/updateData', paras)
        .then(() => {
          // 重新取得清單
          this.getList()
          this.dialogData.dialogFormVisible = false
          this.$notify({ title: '成功', message: '資料更新成功', type: 'success', duration: 2000 })
        })
        .catch(() => {
          this.$notify({ title: '失敗', message: '資料更新失敗', type: 'error', duration: 2000 })
        })
    },
    jumpInfo(sope) {
      this.$router.push({ path: 'info/' + sope.row.case_id })
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
