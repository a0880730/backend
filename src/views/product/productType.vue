<template>
  <div class="app-container">
    <FilterContainer
      :table-format="tableFormat"
      :list-query.sync="listQuery"
      :nwe-btn="newPersonnalClick"
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
import { getTypeInfo } from '@/api/product'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ProductList',
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
      dialogData: {}
    }
  },
  computed: {
    ...mapState({
      ProductTypeData: state => state.product.ProductTypeData,
      rules: state => state.product.ProductTypeRules
    }),
    ...mapGetters([
      'defaultData'
    ])
  },
  created() {
    this.tableFormat = this.ProductTypeData
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
      getTypeInfo(paras).then((response) => {
        var resData = Object.assign({}, response.data)
        for (var i in resData) {
          var spec = resData[i].specification
          var strArr = []
          for (var j in spec) {
            strArr.push(spec[j].name)
          }
          response.data[i].specName = strArr.join(',')
        }
        this.list = response.data
        this.total = response.pages.total_records
        this.listLoading = false
      })
    },
    newPersonnalClick() {
      var dialogData = {}
      dialogData.dialogName = '新增'
      dialogData.tableFormat = this.tableFormat
      dialogData.dialogFormVisible = true
      dialogData.temp = this.defaultData(this.ProductTypeData)
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
      paras = this.sendBeforProcess(paras)
      this.$store.dispatch('product/newTypeData', paras)
        .then(() => {
          this.getList()
          this.dialogData.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '資料新增成功',
            type: 'success',
            duration: 2000
          })
        })
        .catch(() => {
          this.$notify({
            title: '失敗',
            message: '資料新增失敗',
            type: 'error',
            duration: 2000
          })
        })
    },
    // 更新資料
    updateData(paras) {
      paras = this.sendBeforProcess(paras)
      this.$store.dispatch('product/updateTypeData', paras)
        .then(() => {
          // 重新取得清單
          this.getList()
          this.dialogData.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '資料更新成功',
            type: 'success',
            duration: 2000
          })
        })
        .catch(() => {
          this.$notify({
            title: '失敗',
            message: '資料更新失敗',
            type: 'error',
            duration: 2000
          })
        })
    },
    sendBeforProcess(paras) {
      var specName = paras.specName
      specName = specName.split(',')
      var specObj = []
      for (var i in specName) {
        specObj.push({ 'id': i * 1, 'name': specName[i] })
      }
      paras.specification = [...specObj]
      delete paras.specName
      return paras
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
