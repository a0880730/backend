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
import { getProductInfo, getTypeInfo } from '@/api/product'
import { mapState, mapGetters } from 'vuex'
import router from '@/router'

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
      dialogData: {},
      // 商品類型規格
      typeList: {}
    }
  },
  computed: {
    ...mapState({
      ProductData: state => state.product.ProductData,
      PurchaseData: state => state.product.PurchaseData,
      rules: state => state.product.ProductRules,
      PurchaseDataRules: state => state.product.PurchaseDataRules
    }),
    ...mapGetters([
      'defaultData'
    ])
  },
  created() {
    this.tableFormat = this.ProductData
    // Add Button listener
    this.tableFormat.CtrlBtn = { label: '操作', list: 99, width: '230px', button: [
      { label: '編輯', type: 'primary', size: 'mini', callMethod: this.editItemClick },
      { label: '進出貨', type: 'success', size: 'mini', callMethod: this.purchaseClick }
    ]
    }
    this.getTypeInfo()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      var paras = {}
      paras = Object.assign({}, this.listQuery)
      getProductInfo(paras).then((response) => {
        this.list = response.data
        this.total = response.pages.total_records
        this.listLoading = false
      })
    },
    getTypeInfo() {
      var paras = {}
      paras = Object.assign({}, this.listQuery)
      getTypeInfo(paras).then((response) => {
        // 判斷有沒有商品類型
        if (response.data === null) {
          this.$notify({
            title: '尚未設定商品類型',
            type: 'warning',
            message: '請先前往設定類型！',
            duration: 3000,
            showClose: true,
            onClose: function() {
              router.push('./productType')
            }
          })
        }

        this.typeList = response.data
        var typeItem = {}
        var specificationItem = {}
        for (var i in this.typeList) {
          typeItem[this.typeList[i].type_id] = this.typeList[i].name
          specificationItem[this.typeList[i].type_id] = {}
          for (var j in this.typeList[i].specification) {
            specificationItem[this.typeList[i].type_id][this.typeList[i].specification[j].name] = this.typeList[i].specification[j].name
          }
        }
        this.$store.dispatch('product/setSpecification', specificationItem)
        this.$store.dispatch('product/setProductType', typeItem)
      })
    },
    newPersonnalClick() {
      var dialogData = {}
      dialogData.dialogName = '新增'
      dialogData.tableFormat = this.tableFormat
      dialogData.dialogFormVisible = true
      dialogData.temp = this.defaultData(this.ProductData)
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
    // 手動進出貨
    purchaseClick(sope) {
      var purchaseDefault = this.defaultData(this.PurchaseData)
      purchaseDefault.product_id = sope.row.product_id
      var dialogData = {}
      dialogData.dialogName = '手動進出貨'
      dialogData.tableFormat = this.PurchaseData
      dialogData.dialogFormVisible = true
      dialogData.temp = Object.assign({}, purchaseDefault)
      dialogData.rules = this.PurchaseDataRules
      dialogData.submitEvent = this.purchaseProduct
      this.dialogData = dialogData
    },
    // 新增資料
    newData(paras) {
      paras = this.sendBeforProcess(paras)
      this.$store.dispatch('product/newData', paras)
        .then((response) => {
          if (typeof response.notify === 'object') {
            this.$notify(response.notify)
          }
          if (response.code === 201) {
            // 重新取得清單
            this.getList()
            this.dialogData.dialogFormVisible = false
          }
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
      this.$store.dispatch('product/updateData', paras)
        .then((response) => {
          if (typeof response.notify === 'object') {
            this.$notify(response.notify)
          }
          if (response.code === 200) {
            this.getList()
            this.dialogData.dialogFormVisible = false
          }
        })
    },
    // 進出貨
    purchaseProduct(paras) {
      paras.quantity = paras.quantity + ''
      paras.cost_price = paras.cost_price + ''
      this.$store.dispatch('product/purchaseProduct', paras)
        .then((response) => {
          if (typeof response.notify === 'object') {
            this.$notify(response.notify)
            this.getList()
          }
          if (response.code === 201) {
            this.dialogData.dialogFormVisible = false
          }
        })
    },
    sendBeforProcess(paras) {
      paras.quantity_minimum = paras.quantity_minimum * 1
      paras.unit_price = paras.unit_price + ''
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
