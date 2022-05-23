<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">

        <el-descriptions class="margin-top" title="带边框列表" :column="3" :size="size" border>
          <template slot="extra">
            <el-button type="primary" size="small">操作</el-button>
          </template>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              用户名
            </template>
            kooriookami
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              手机号
            </template>
            18100000000
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              居住地
            </template>
            苏州市
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-tickets"></i>
              备注
            </template>
            <el-tag size="small">学校</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              联系地址
            </template>
            江苏省苏州市吴中区吴中大道 1188 号
          </el-descriptions-item>
        </el-descriptions>

        <!-- <div class="postInfo-container">
          <el-form ref="caseFieldData" :model="caseFieldData" class="form-container">
            <el-row>
              <h2 style="margin-left: 30px">{{ caseFieldData.name }}</h2>
              <el-col :span="24">
                <el-form-item label-width="100px" label="案場名稱:">
                  <el-input v-model="caseFieldData.name" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label-width="100px" label="客戶:">
                  <el-input v-model="caseFieldData.customer_id" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label-width="100px" label="包商:">
                  <el-input v-model="caseFieldData.contractor_id" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label-width="100px" label="地址:">
                  <el-input v-model="caseFieldData.address" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label-width="100px" label="備註:">
                  <el-input v-model="caseFieldData.notes" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div> -->
      </el-col>

      <el-col :span="16">
        <el-row>
          <!-- 報價單 -->
          <el-col :span="12" class="tab-block">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>報價單</span>
                <router-link :to="`../quotation/new?caseId=`+this.$route.params.pathMatch">
                  <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-edit">新增</el-button>
                </router-link>
              </div>
              <div class="component-item" style="height:420px;">
                <qutation-table :case-id="this.$route.params.pathMatch" />
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <!-- 規格表 -->
          <el-col :span="12" class="tab-block">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>石膏磚數量計算表</span>
                <router-link :to="`../brick/new?caseId=`+this.$route.params.pathMatch">
                  <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-edit">新增</el-button>
                </router-link>
              </div>
              <div class="component-item" style="height:420px;">
                <brick-table :case-id="this.$route.params.pathMatch" />
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <!-- 出貨單 -->
          <el-col :span="12" class="tab-block">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>出貨紀錄</span>
                <router-link :to="`../shipping/new?caseId=`+this.$route.params.pathMatch">
                  <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-s-promotion">出貨</el-button>
                </router-link>
              </div>
              <div class="component-item" style="height:420px;">
                <shipping-table :case-id="this.$route.params.pathMatch" />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import QutationTable from './components/QutationTable.vue'
import BrickTable from './components/BrickTable.vue'
import ShippingTable from './components/ShippingTable.vue'

import { getCustomerInfo } from '@/api/customer'
import { getInfo } from '@/api/caseField'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Info',
  components: { QutationTable, BrickTable, ShippingTable },
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
      caseFieldData: {}
    }
  },
  computed: {
    ...mapState({
      // CaseFieldData: state => state.caseField.CaseFieldData,
      // rules: state => state.caseField.rules
    }),
    ...mapGetters([
      'defaultData'
    ])
  },
  created() {
    // this.tableFormat = this.CaseFieldData
    // Add Button listener
    // this.tableFormat.CtrlBtn = { label: '操作', list: 99, width: '230px', button: [
    //   { label: '編輯', type: 'primary', size: 'mini', callMethod: this.editItemClick },
    //   { label: '查看', type: 'primary', size: 'mini', callMethod: this.jumpInfo }
    // ]
    // }
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      var paras = {}
      paras = Object.assign({}, this.listQuery)
      paras.case_id = this.$route.params.pathMatch
      getInfo(paras).then((response) => {
        this.caseFieldData = response.data
      //   this.list = response.data
      //   this.total = response.pages.total_records
      //   this.listLoading = false
      })
    },
    getCustomerInfo(customer_id) {
      var paras = {
        customer_id: customer_id
      }
      getCustomerInfo(paras).then((response) => {
        console.log('NS', response)
      })
      console.log('Psample', Psample)
      // console.log(n)
    },
    // newPersonnalClick() {
    //   var dialogData = {}
    //   dialogData.dialogName = '新增'
    //   dialogData.tableFormat = this.tableFormat
    //   dialogData.dialogFormVisible = true
    //   dialogData.temp = this.defaultData(this.CaseFieldData)
    //   dialogData.rules = this.rules
    //   dialogData.submitEvent = this.newData
    //   this.dialogData = dialogData
    // },
    // editItemClick(sope) {
    //   var dialogData = {}
    //   dialogData.dialogName = '編輯'
    //   dialogData.tableFormat = this.tableFormat
    //   dialogData.dialogFormVisible = true
    //   dialogData.temp = sope.row
    //   dialogData.rules = this.rules
    //   dialogData.submitEvent = this.updateData
    //   this.dialogData = dialogData
    // },
    // 新增資料
    // newData(paras) {
    //   this.$store.dispatch('caseField/newData', paras)
    //     .then(() => {
    //       // 重新取得清單
    //       this.getList()
    //       this.dialogData.dialogFormVisible = false
    //       this.$notify({ title: '成功', message: '資料新增成功', type: 'success', duration: 2000 })
    //     })
    //     .catch(() => {
    //       this.$notify({ title: '失敗', message: '資料新增失敗', type: 'error', duration: 2000 })
    //     })
    // },
    // 更新資料
    // updateData(paras) {
    //   this.$store.dispatch('caseField/updateData', paras)
    //     .then(() => {
    //       // 重新取得清單
    //       this.getList()
    //       this.dialogData.dialogFormVisible = false
    //       this.$notify({ title: '成功', message: '資料更新成功', type: 'success', duration: 2000 })
    //     })
    //     .catch(() => {
    //       this.$notify({ title: '失敗', message: '資料更新失敗', type: 'error', duration: 2000 })
    //     })
    // },
    // jumpInfo(paras) {
    //   this.$router.push('/info')
    // }
  }
}
</script>

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
}

</style>
