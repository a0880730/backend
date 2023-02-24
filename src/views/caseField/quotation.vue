<template>
  <div class="app-container">
    <FilterContainer
      :table-format="QuotationItem"
      :list-query.sync="listQuery"
      :nwe-btn=" (mode == 'creat')?newItemClick:null"
    />
    <TableList
      :list="list"
      :table-key="tableKey"
      :list-loading="listLoading"
      :table-format="QuotationItem"
    />
    <el-row>
      <el-col class="tab-block">
        <div class="total-div">
          <label>小計</label>
          <span class="total-amount">{{ countAmount | toThousandFilter }}</span>
        </div>
        <el-button v-if="mode == 'creat'" class="filter-item" type="primary" @click="submitQuotation()">
          送出報價單
        </el-button>
      </el-col>
    </el-row>
    <QutationEditDialog :dialog-data="dialogData" />
  </div>
</template>

<script>
import QutationEditDialog from './components/QutationEditDialog.vue'
import { getQuotation } from '@/api/caseField'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Quatation',
  components: {
    QutationEditDialog
  },
  data() {
    return {
      list: [],
      tableKey: true,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20
      },
      dialogData: {},
      editRowIndex: null,
      quotationData: {},
      productData: [],
      mode: 'creat' // creat: 新增,read 查看,update 更新(目前沒有)
    }
  },
  computed: {
    ...mapState({
      QuotationItem: state => state.caseField.QuotationItem,
      rules: state => state.caseField.QuotationItemRules,
      ProductInfo: state => state.product.productDataList
    }),
    ...mapGetters([
      'defaultData'
    ]),
    countAmount() {
      var count = 0
      for (var i in this.list) {
        if (typeof this.list[i].amount === 'number'){
          count += this.list[i].amount
        } else {
          count += this.list[i].amount * 1
        }
      }
      count = parseFloat(count.toPrecision(12))
      count = Math.trunc(count * 1000) / 1000
      return count
    }
  },
  watch: {
    ProductInfo: {
      handler(value) {
        this.getProductData()
      },
      deep: true
    }
  },
  created() {
    this.list = []
    this.getProductData()
    this.QuotationItem.name.querySearch = this.querySearch
    if (this.$route.params.pathMatch !== 'new') {
      this.mode = 'read'
      this.getList()
      this.QuotationItem.CtrlBtn = {}
    } else {
      // Add Button listener
      this.QuotationItem.CtrlBtn = { label: '操作', list: 99, width: '230px', button: [
        { label: '編輯', type: 'primary', size: 'mini', callMethod: this.editItemClick }
      ]
      }
      this.mode = 'creat'
      this.listLoading = false
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      var paras = {}
      paras = Object.assign({}, this.listQuery)
      paras.case_id = this.$route.query.caseId
      paras.quotation_id = this.$route.params.pathMatch
      getQuotation(paras).then((response) => {
        this.quotationData = response.data
        this.list = [...this.quotationData.items]
        //   this.total = response.pages.total_records
        this.listLoading = false
      })
    },
    getProductData() {
      this.productData = []
      for (const i in this.ProductInfo) {
        this.productData.push(this.ProductInfo[i])
      }
    },
    newItemClick() {
      var dialogData = {}
      dialogData.dialogName = '新增'
      dialogData.tableFormat = this.QuotationItem
      dialogData.dialogFormVisible = true
      dialogData.temp = this.defaultData(this.QuotationItem)
      dialogData.rules = this.rules
      dialogData.submitEvent = this.newData
      this.dialogData = dialogData
    },
    editItemClick(sope) {
      this.editRowIndex = sope.$index
      var dialogData = {}
      dialogData.dialogName = '編輯'
      dialogData.tableFormat = this.QuotationItem
      dialogData.dialogFormVisible = true
      dialogData.temp = Object.assign({}, sope.row)
      dialogData.rules = this.rules
      dialogData.submitEvent = this.updateData
      this.dialogData = dialogData
    },
    newData(paras) {
      this.list.push(Object.assign({}, paras))
      this.dialogData.dialogFormVisible = false
    },
    updateData(paras) {
      const list = [...this.list]
      list[this.editRowIndex] = paras
      this.list = [...list]
      this.tableKey = !this.tableKey
      this.dialogData.dialogFormVisible = false
    },
    submitQuotation() {
      if (this.list.length === 0) {
        this.$notify({
          title: '錯誤',
          message: '請填入施工內容!',
          type: 'error',
          duration: 2000
        })
        return false
      }
      var paras = {}
      paras.case_id = this.$route.query.caseId
      paras.items = [...this.list]
      for (const i in paras.items) {
        if (typeof paras.items[i].amount === 'number')paras.items[i].amount += ''
      }
      paras.total_amount = this.countAmount + ''
      this.$store.dispatch('caseField/newQuotation', paras)
        .then(() => {
          // 回到案場
          this.$router.replace('/caseField/info/' + this.$route.query.caseId)
          this.$notify({
            title: '成功',
            message: '資料新增成功',
            type: 'success',
            duration: 2000
          })
        })
    },
    querySearch(queryString, cb) {
      // const results = this.productData
      var results = queryString ? this.productData.filter(this.createFilter(queryString)) : this.productData
      console.log(results)
      cb(results)
    },
    createFilter(queryString) {
      return (data) => {
        return (data.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-block{
    display: flex;
    text-align: center;
    margin-top: 20px;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .total-div{
      margin-right: 10px;
      color: rgb(129, 129, 129);

      label{
        font-size: 22px;
      }

      .total-amount{
        display: inline-block;
        min-width:150px;
        border-bottom: 1px solid #000;
        font-size: 20px;
      }
    }
}
</style>
