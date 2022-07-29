<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-descriptions class="margin-top" :title="caseFieldData.name" :column="3" border>
          <template slot="extra">
            <el-button type="info" @click="recycleBrick()">餘料回收</el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteCaseField()" />
          </template>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user" />
              客戶
            </template>
            {{ caseFieldData.customer.company_name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user" />
              包商
            </template>
            {{ caseFieldData.contractor.company_name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-alarm-clock" />
              新增時間
            </template>
            {{ caseFieldData.created_at | dateFormat }}
          </el-descriptions-item>
          <el-descriptions-item :span="2">
            <template slot="label">
              <i class="el-icon-location-outline" />
              地址
            </template>
            {{ caseFieldData.address }}
          </el-descriptions-item>
          <el-descriptions-item :span="2">
            <template slot="label">
              <i class="el-icon-tickets" />
              備註
            </template>
            {{ caseFieldData.notes }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:50px;">
      <el-card class="box-card simple_info" style="text-align: center;">
        <el-col :span="4" class="col-item">
          <span>計算表</span>
          <div class="component-item">
            {{ brickCount | toThousandFilter }}
          </div>
          <div class="unit_txt">張</div>
          <el-button class="filter-item" type="primary" @click="changeShowTable(2)">查看</el-button>
        </el-col>
        <el-col :span="4" class="col-item">
          <span>出貨</span>
          <div class="component-item">
            {{ shippingCount | toThousandFilter }}
          </div>
          <div class="unit_txt">次</div>
          <el-button class="filter-item" type="primary" @click="changeShowTable(3)">查看</el-button>
        </el-col>
        <el-col :span="4" class="col-item">
          <span>雜支</span>
          <div class="component-item">
            {{ sumPettyCash | toThousandFilter }}
          </div>
          <div class="unit_txt">元</div>
          <el-button class="filter-item" type="primary" @click="changeShowTable(4)">查看</el-button>
        </el-col>
        <el-col :span="6" class="col-item">
          <span>報價單金額</span>
          <div class="component-item">
            {{ sumQutation | toThousandFilter }}
          </div>
          <div class="unit_txt">元</div>
          <el-button class="filter-item" type="primary" @click="changeShowTable(1)">查看</el-button>
        </el-col>
        <el-col :span="6" class="col-item">
          <span>收款金額總計</span>
          <div class="component-item">
            {{ sumReceipts | toThousandFilter }}
          </div>
          <div class="unit_txt">元</div>
          <el-button class="filter-item" type="primary" @click="changeShowTable(5)">查看</el-button>
        </el-col>
      </el-card>
    </el-row>
    <el-row style="margin-top:20px;flex-wrap: wrap" type="flex" justify="center">
      <!-- 報價單 -->
      <transition name="el-fade-in-linear">
        <el-col v-show="showTableIndex == 1" :span="12" :xs="24" class="tab-block">
          <el-card class="box-card" body-style="padding:0px;">
            <div slot="header" class="clearfix">
              <span>報價單</span>
              <router-link :to="`../quotation/new?caseId=`+this.$route.params.pathMatch">
                <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-edit">新增</el-button>
              </router-link>
            </div>
            <div class="component-item" style="height:350px;">
              <qutation-table
                :case-id="this.$route.params.pathMatch"
                :sum-qutation.sync="sumQutation"
              />
            </div>
          </el-card>
        </el-col>
      </transition>
      <!-- 規格表 -->
      <transition name="el-fade-in-linear">
        <el-col v-show="showTableIndex == 2" :span="12" :xs="24" class="tab-block">
          <el-card class="box-card" body-style="padding:0px;">
            <div slot="header" class="clearfix">
              <span>石膏磚數量計算表</span>
              <router-link :to="`../brick/new?caseId=`+this.$route.params.pathMatch">
                <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-edit">新增</el-button>
              </router-link>
            </div>
            <div class="component-item" style="height:350px;">
              <brick-table
                :case-id="this.$route.params.pathMatch"
                :brick-count.sync="brickCount"
              />
            </div>
          </el-card>
        </el-col>
      </transition>
      <!-- 出貨單 -->
      <transition name="el-fade-in-linear">
        <el-col v-show="showTableIndex == 3" :span="12" :xs="24" class="tab-block">
          <el-card class="box-card" body-style="padding:0px;">
            <div slot="header" class="clearfix">
              <span>出貨紀錄</span>
              <router-link :to="`../shipping/new?caseId=`+this.$route.params.pathMatch">
                <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-s-promotion">出貨</el-button>
              </router-link>
            </div>
            <div class="component-item" style="height:350px;">
              <shipping-table
                :case-id="this.$route.params.pathMatch"
                :shipping-count.sync="shippingCount"
              />
            </div>
          </el-card>
        </el-col>
      </transition>
      <!-- 零用金使用紀錄 -->
      <transition name="el-fade-in-linear">
        <el-col v-show="showTableIndex == 4" :span="12" :xs="24" class="tab-block">
          <el-card class="box-card" body-style="padding:0px;">
            <div slot="header" class="clearfix">
              <span>雜支費用</span>
              <span class="petty_cash_span">目前零用金餘額：{{ pettyCash }}</span>
              <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-edit" @click="newMiscData()">新增</el-button>
            </div>
            <div class="component-item" style="height:350px;">
              <misc-table
                :case-id="this.$route.params.pathMatch"
                :reload-sw="miscReloadSw"
                :sum-petty-cash.sync="sumPettyCash"
              />
            </div>
          </el-card>
        </el-col>
      </transition>
      <!--收款紀錄 -->
      <transition name="el-fade-in-linear">
        <el-col v-show="showTableIndex == 5" :span="12" :xs="24" class="tab-block">
          <el-card class="box-card" body-style="padding:0px;">
            <div slot="header" class="clearfix">
              <span>收款記錄</span>
              <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-edit" @click="newReceipts()">新增</el-button>
            </div>
            <div class="component-item" style="height:350px;">
              <receipts-table
                :case-id="this.$route.params.pathMatch"
                :sum-receipts.sync="sumReceipts"
                :reload-sw="receiptsReloadSw"
              />
            </div>
          </el-card>
        </el-col>
      </transition>
    </el-row>
    <EditDialog :dialog-data="dialogData" />
  </div>
</template>

<script>
import { getProductInfo, postProductPurchase } from '@/api/product'
import { newReceipts } from '@/api/caseField'
import QutationTable from './components/QutationTable.vue'
import BrickTable from './components/BrickTable.vue'
import ShippingTable from './components/ShippingTable.vue'
import MiscTable from './components/MiscTable.vue'
import ReceiptsTable from './components/ReceiptsTable.vue'

import { getInfo } from '@/api/caseField'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Info',
  components: { QutationTable, BrickTable, ShippingTable, MiscTable, ReceiptsTable },
  data() {
    return {
      // list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20
      },
      dialogData: {},
      caseFieldData: {
        customer: {
          company_name: ''
        },
        contractor: {
          company_name: ''
        }
      },
      miscReloadSw: false,
      receiptsReloadSw: false,
      sumQutation: 0,
      shippingCount: 0,
      brickCount: 0,
      sumPettyCash: 0,
      sumReceipts: 0,
      showTableIndex: 0
    }
  },
  computed: {
    ...mapState({
      MiscData: state => state.caseField.MiscData,
      MiscDataRules: state => state.caseField.MiscDataRules,
      pettyCash: state => state.pettyCash.pettyCash,
      PurchaseData: state => state.caseField.PurchaseData,
      PurchaseDataRules: state => state.caseField.PurchaseDataRules,
      ReceiptsData: state => state.caseField.ReceiptsData,
      ReceiptsDataRules: state => state.caseField.ReceiptsDataRules
    }),
    ...mapGetters([
      'defaultData'
    ])
  },
  created() {
    this.getList()
    this.getProductInfo()
  },
  methods: {
    getList() {
      this.listLoading = true
      var paras = {}
      paras = Object.assign({}, this.listQuery)
      paras.case_id = this.$route.params.pathMatch
      getInfo(paras).then((response) => {
        this.caseFieldData = response.data
      })
    },
    // 取得商品列表
    getProductInfo() {
      this.listLoading = true
      var paras = {}
      getProductInfo(paras).then((response) => {
        const productData = []
        for (const i in response.data) {
          if (response.data[i].quantity_minimum === -1) continue
          var item = {}
          item.value = response.data[i].product_id
          item.label = response.data[i].name + ' - ' + response.data[i].specification
          item.note = '庫存:' + response.data[i].quantity
          productData.push(item)
        }
        this.PurchaseData.product_id.selectData = productData
      })
    },
    newMiscData() {
      var dialogData = {}
      dialogData.dialogName = '新增'
      dialogData.tableFormat = { ...this.MiscData }
      dialogData.dialogFormVisible = true
      dialogData.temp = this.defaultData(this.MiscData)
      dialogData.rules = this.MiscDataRules
      dialogData.submitEvent = this.newMiscSubmit
      this.dialogData = dialogData
    },
    // 送出資料
    newMiscSubmit(paras) {
      const sendParas = { ...paras }
      sendParas.petty_cash = (sendParas.petty_cash === 1)
      sendParas.apply_for = ''
      const data = {}
      data.case_id = this.$route.params.pathMatch
      data.items = []
      data.items.push(sendParas)
      this.$store.dispatch('caseField/newCaseMisc', data).then((response) => {
        if (typeof response.notify === 'object') {
          this.$notify(response.notify)
        }
        if (response.code === 201) {
          this.dialogData.dialogFormVisible = false
          this.miscReloadSw = !this.miscReloadSw
          this.$store.dispatch('pettyCash/getPettyCash')
        }
      }).catch(() => {
        this.$notify({ title: '失敗', message: '資料新增失敗', type: 'error', duration: 2000 })
      })
    },
    // 回收磚
    recycleBrick() {
      var dialogData = {}
      dialogData.dialogName = '餘料回收'
      dialogData.tableFormat = { ...this.PurchaseData }
      dialogData.dialogFormVisible = true
      dialogData.temp = this.defaultData(this.PurchaseData)
      dialogData.rules = this.PurchaseDataRules
      dialogData.submitEvent = this.recycleBrickSubmit
      this.dialogData = dialogData
    },
    recycleBrickSubmit(paras) {
      const sendParas = { ...paras }
      sendParas.cost_price += ''
      sendParas.quantity += ''
      const data = {}
      data.items = []
      data.items.push(sendParas)
      postProductPurchase(data).then((response) => {
        this.dialogData.dialogFormVisible = false
        this.getProductInfo()
        this.$notify({ title: '成功', message: '餘料回收紀錄成功', type: 'success', duration: 2000 })
      }).catch(() => {
        this.$notify({ title: '失敗', message: '操作失敗', type: 'error', duration: 2000 })
      })
    },
    newReceipts() {
      var dialogData = {}
      dialogData.dialogName = '新增'
      dialogData.tableFormat = { ...this.ReceiptsData }
      dialogData.dialogFormVisible = true
      dialogData.temp = this.defaultData(this.ReceiptsData)
      dialogData.rules = this.ReceiptsDataRules
      dialogData.submitEvent = this.newReceiptsSubmit
      this.dialogData = dialogData
    },
    newReceiptsSubmit(paras) {
      paras.case_id = this.$route.params.pathMatch
      paras.receipts = paras.receipts + ''
      newReceipts(paras).then((response) => {
        this.dialogData.dialogFormVisible = false
        // this.getProductInfo()
        this.receiptsReloadSw = !this.receiptsReloadSw
        this.$notify({ title: '成功', message: '餘料回收紀錄成功', type: 'success', duration: 2000 })
      }).catch(() => {
        this.$notify({ title: '失敗', message: '操作失敗', type: 'error', duration: 2000 })
      })
    },
    changeShowTable(index) {
      if (this.showTableIndex === 0 || this.showTableIndex === index) {
        this.showTableIndex = index
      } else {
        this.showTableIndex = -1
        const _this = this
        setTimeout(() => {
          _this.showTableIndex = index
        }, 500)
      }
    },
    // 刪除案場
    deleteCaseField() {
      this.$confirm('此操作將永久刪除該筆資料，確定繼續?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const paras = {}
        paras.case_id = this.$route.params.pathMatch
        this.$store.dispatch('caseField/deleteCaseField', paras)
          .then(() => {
            // 重新取得清單
            this.$notify({
              title: '成功',
              message: '資料刪除成功',
              type: 'success',
              duration: 2000
            })
            this.$router.replace('/caseField/list')
          })
      })
    }
  }
}
</script>

<style lang="scss">
.simple_info .el-card__body{
  display: flex;
}

.el-table__header-wrapper {
  height: 44px !important;
}

.el-table__body-wrapper{
  height: calc(100% - 44px) !important;
}
</style>

<style lang="scss" scoped>
.el-form-item{
  margin-bottom: 40px;
}

.clearfix{
  span{
    float: left;
    line-height: 36px;
  }
}
.tab-block{
  padding: 0 10px;
  text-align: center;
  margin-top: 20px;
}
.el-table__body-wrapper{
  overflow-x: hidden;
}

.petty_cash_span{
  color: #7a7a7a;
  margin-left: 20px;
}

.el-card {
  .col-item {
    &:not(:last-child){
      border-right: 1px solid #CCC;
    }
    .component-item{
      padding: 10px 0 0;
      font-size: 32px;
    }

    .unit_txt{
      color: #808080;
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
}

</style>
