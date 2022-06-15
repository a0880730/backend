<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <FilterContainer
          :table-format="ShippingItem"
          :nwe-btn=" (mode == 'creat')?newItemClick:null"
        />
        <el-row>
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column align="center" :label="`商品`">
              <template slot-scope="scope">
                <span>{{ getSroreProductInfo(scope.row['product_id']).name + " - " + getSroreProductInfo(scope.row['product_id']).specification }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="`出貨數量`">
              <template slot-scope="scope">
                <span :class="[{ danger_txt: scope.row['quantity'] > getSroreProductInfo(scope.row['product_id']).quantity && getSroreProductInfo(scope.row['product_id']).quantity_minimum != -1 }]">{{ scope.row["quantity"] }}<br>
                  <span v-if="getSroreProductInfo(scope.row['product_id']).quantity_minimum != -1" class="stock_txt">(庫存:{{ getSroreProductInfo(scope.row["product_id"]).quantity }})</span>
                </span>
              </template>
            </el-table-column>

            <template v-for="(item, index) in ShippingItem">
              <template v-if="item.list >= 0">
                <!--99:操作按鈕-->
                <el-table-column v-if="item.list === 99" :key="index" align="center" :label="item.label" :width="item.width">
                  <template slot-scope="scope">
                    <template v-for="(btnData,btnKey) in item.button">
                      <el-button :key="btnKey" :type="btnData.type" :size="btnData.size" :icon="btnData.icon" @click="btnData.callMethod(scope)">
                        <span>{{ btnData.label }}</span>
                      </el-button>
                    </template>
                  </template>
                </el-table-column>
              </template>
            </template>
          </el-table>
        </el-row>
        <el-row style="margin-top:20px">
          <label class="el-form-item__label">備註</label>
          <el-input v-model="notes" :rows="1" type="textarea" class="article-textarea" autosize placeholder="出貨備註" />
        </el-row>
        <el-row style="text-align:center;margin-top:30px;">
          <el-button v-if="mode == 'creat'" class="filter-item" type="primary" @click="submitShipping()">
            確定出貨
          </el-button>
        </el-row>
      </el-col>
      <el-col :span="16" style="padding-left:20px">
        <el-row>
          <el-col :span="24" style="text-align:center;font-size:24px;margin-bottom:30px;">
            查看石膏磚數量計算表
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-radio-group v-model="birckIndex">
            <template v-for="(item,index) in BrickList">
              <el-radio-button v-if="getUserInfo(item.applicant)" :key="index" :label="index">
                {{ "填表人："+getUserInfo(item.applicant).username }}
                <div class="brick-date">{{ item.created_at | dateFormat }}</div>
              </el-radio-button>
            </template>
          </el-radio-group>
        </el-row>
        <el-row v-if="birckIndex !== null">
          <div class="total-div tab-block">
            總計：<span class="total-amount">{{ countTotal | toThousandFilter }} M²</span>
          </div>
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="BrickItemList"
            border
            fit
            highlight-current-row
            style="width: 100%;margin-top:10px;"
          >
            <template v-for="(item, index) in BrickItem">
              <template v-if="item.list >= 0 && ['width','height','door_width','door_height','window_width','window_height'].indexOf(index) == -1">
                <!--99:操作按鈕-->
                <el-table-column v-if="item.list === 99" :key="index" align="center" :label="item.label" :width="item.width">
                  <template slot-scope="scope">
                    <template v-for="(btnData,btnKey) in item.button">
                      <el-button :key="btnKey" :type="btnData.type" :size="btnData.size" :icon="btnData.icon" @click="btnData.callMethod(scope)">
                        <span>{{ btnData.label }}</span>
                      </el-button>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column v-else :key="index" align="center" :label="item.label">
                  <template slot-scope="scope">
                    <span>{{ scope.row[index] }}</span>
                  </template>
                </el-table-column>
              </template>
            </template>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
    <EditDialog :dialog-data="dialogData" />
  </div>
</template>

<script>
import { getProductInfo } from '@/api/product'
import { getBrick } from '@/api/caseField'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Shipping',
  components: {},
  data() {
    return {
      list: [],
      tableKey: true,
      listLoading: true,
      dialogData: {},
      editRowIndex: null,
      ShippingData: {},
      rules: {},
      mode: 'creat', // creat: 新增,read 查看,update 更新(目前沒有)
      birckIndex: null,
      BrickList: [],
      BrickItemList: [],
      notes: ''
    }
  },
  computed: {
    ...mapState({
      ShippingItem: state => state.caseField.ShippingItem,
      ShippingItemRules: state => state.caseField.ShippingItemRules,
      BrickItem: state => state.caseField.BrickItem
    }),
    ...mapGetters([
      'defaultData', 'getUserInfo', 'getSroreProductInfo'
    ]),
    countTotal() {
      var count = 0
      for (var i in this.BrickItemList) {
        count += this.BrickItemList[i].subtotal * 1
      }
      return count
    }
  },
  watch: {
    birckIndex: {
      handler: function(val) {
        this.getBrick(this.BrickList[val].brick_id)
      },
      deep: true
    }
  },
  created() {
    this.list = []
    this.BrickItem.CtrlBtn = {}
    this.getProductInfo()
    // 取得石膏專計算表
    this.getBrick()
    if (this.$route.params.pathMatch !== 'new') { // 編輯
      this.mode = 'read'
      this.ShippingItem.CtrlBtn = {}
    } else { // 新增
      this.getShipping()
      // Add Button listener
      this.ShippingItem.CtrlBtn = { label: '操作', list: 99, width: '230px', button: [
        { label: '編輯', type: 'primary', size: 'mini', callMethod: this.editItemClick },
        { label: '刪除', type: 'danger', size: 'mini', callMethod: this.removeItemClick }
      ]
      }
      this.mode = 'creat'
      this.listLoading = false
    }
  },
  methods: {
    getBrick(brick_id = null) {
      this.listLoading = true
      var paras = {}
      paras.case_id = this.$route.query.caseId
      paras.brick_id = brick_id
      getBrick(paras).then((response) => {
        if (brick_id == null) {
          this.BrickList = response.data
        } else {
          this.BrickItemList = response.data.items
        }
        this.listLoading = false
      })
    },
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
          // if (response.data[i].quantity_minimum === -1) {
          //   item.note = '不扣庫存'
          // } else {
          item.note = '庫存:' + response.data[i].quantity
          // }
          productData.push(item)
        }
        this.ShippingItem.product_id.selectData = productData
      })
    },
    newItemClick() {
      var dialogData = {}
      dialogData.dialogName = '新增'
      dialogData.tableFormat = this.ShippingItem
      dialogData.dialogFormVisible = true
      dialogData.temp = this.defaultData(this.ShippingItem)
      dialogData.rules = this.ShippingItemRules
      dialogData.submitEvent = this.newData
      this.dialogData = dialogData
    },
    editItemClick(sope) {
      this.editRowIndex = sope.$index
      var dialogData = {}
      dialogData.dialogName = '編輯'
      dialogData.tableFormat = this.ShippingItem
      dialogData.dialogFormVisible = true
      dialogData.temp = Object.assign({}, sope.row)
      dialogData.rules = this.ShippingItemRules
      dialogData.submitEvent = this.updateData
      this.dialogData = dialogData
    },
    removeItemClick(sope) {
      const index = sope.$index
      this.list.splice(index, 1)
    },
    newData(paras) {
      for (const i in paras) {
        paras[i] = paras[i] + ''
      }
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
    submitShipping() {
      if (this.list.length === 0) {
        this.$notify({
          title: '無資料',
          message: '請填入出貨項目資料!',
          type: 'warning',
          duration: 2000
        })
        return false
      }
      var paras = {}
      paras.case_id = this.$route.query.caseId
      paras.items = [...this.list]
      paras.notes = this.notes
      this.$store.dispatch('caseField/newCaseShipping', paras).then((response) => {
        if (typeof response.notify === 'object') {
          this.$notify(response.notify)
        }
        if (response.code === 201) {
          // 回到案場
          this.$router.replace('/caseField/info/' + this.$route.query.caseId)
        }
      }).catch(() => {
        this.$notify({ title: '失敗', message: '資料新增失敗', type: 'error', duration: 2000 })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-block{
    display: flex;
    text-align: center;
    flex-direction: row;
    justify-content:  flex-end;

    margin-right: 10px;
    color: rgb(129, 129, 129);

    label{
      font-size: 22px;
    }

    .total-amount{
      display: inline-block;
      min-width:150px;
      border-bottom: 1px solid #000;
      font-size: 28px;
    }
}

.brick-date{
  margin-top: 5px;
  font-size: 14px;
  color: #AAA;
}

.stock_txt{
  color: rgb(98, 98, 98);
}
.danger_txt{
  color: #FF0000;
  font-weight: bold;
}
</style>
