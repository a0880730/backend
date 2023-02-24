<template>
  <div class="app-container">

    <div v-if="!isQREnter" class="casefield_name">
      {{ caseFieldData.name }} - 施工填表
    </div>

    <FilterContainer
      :table-format="BrickItem"
      :list-query.sync="listQuery"
      :nwe-btn=" (mode == 'creat')?newItemClick:null"
    />
  
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style=""
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

    <el-row>
      <el-col class="tab-block">
        <div class="total-div">
          <label>總計</label>
          <span class="total-amount">{{ countTotal | toThousandFilter }}</span>
          <label>M²</label>
        </div>
        <el-button v-if="mode == 'creat'" class="filter-item" type="primary" @click="submitQuotation()">
          送出
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="tab-block">
        <el-button v-if="brickData.status == 2 && isQREnter" class="filter-item" type="success" @click="submitReview()">
          審核
        </el-button>
      </el-col>
    </el-row>

    <BrickEditDialog :dialog-data="dialogData" />

  </div>
</template>

<script>
import { getBrick,getInfo } from '@/api/caseField'
import { mapState, mapGetters } from 'vuex'
import BrickEditDialog from './components/BrickEditDialog.vue'

export default {
  name: 'Brick',
  components: {
    BrickEditDialog
  },
  data() {
    return {
      list: [],
      caseFieldData: {
        customer: {
          company_name: ''
        },
        contractor: {
          company_name: ''
        }
      },
      tableKey: true,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20
      },
      dialogData: {},
      editRowIndex: null,
      brickData: {},
      rules: {},
      mode: 'creat', // creat: 新增,read 查看,update 更新(目前沒有)
      isQREnter: false
    }
  },
  computed: {
    ...mapState({
      BrickItem: state => state.caseField.BrickItem
    }),
    ...mapGetters([
      'defaultData'
    ]),
    countTotal() {
      var count = 0
      for (var i in this.list) {
        count += this.list[i].subtotal * 1
      }
      count = parseFloat(count.toPrecision(12))
      count = Math.trunc(count * 1000) / 1000
      return count
    }
  },
  created() {
    const thisRouter = this.$route.path.split('/')
    if (!thisRouter.find(item => item === 'qrbrick')) {
      this.isQREnter = true
    }

    this.list = []
    // if (this.$route.params.pathMatch !== 'new') {
    this.mode = 'read'
    this.getList()
    this.geCaseField()
    this.BrickItem.CtrlBtn = {}
    // } else {
    // Add Button listener
    this.BrickItem.CtrlBtn = { label: '操作', list: 99, width: '230px', button: [
      { label: '編輯', type: 'primary', size: 'mini', callMethod: this.editItemClick }
    ]
    }
    this.mode = 'creat'
    this.listLoading = false
    // }
  },
  methods: {
    getList() {
      this.listLoading = true
      var paras = {}
      paras = Object.assign({}, this.listQuery)
      paras.case_id = this.$route.query.caseId
      paras.brick_id = this.$route.params.pathMatch
      getBrick(paras).then((response) => {
        this.list = []
        if (response.code === 200) {
          this.brickData = response.data
          this.list = [...this.brickData.items]
        }
        this.listLoading = false
      })
    },
    geCaseField() {
      this.listLoading = true
      var paras = {}
      paras = Object.assign({}, this.listQuery)
      paras.case_id = this.$route.query.caseId
      getInfo(paras).then((response) => {
        this.caseFieldData = response.data
      })
    },
    newItemClick() {
      var dialogData = {}
      dialogData.dialogName = '新增'
      dialogData.tableFormat = this.BrickItem
      dialogData.dialogFormVisible = true
      dialogData.temp = this.defaultData(this.BrickItem)
      dialogData.rules = this.rules
      dialogData.submitEvent = this.newData
      this.dialogData = dialogData
    },
    editItemClick(sope) {
      this.editRowIndex = sope.$index
      var dialogData = {}
      dialogData.dialogName = '編輯'
      dialogData.tableFormat = this.BrickItem
      dialogData.dialogFormVisible = true
      dialogData.temp = Object.assign({}, sope.row)
      dialogData.rules = this.rules
      dialogData.submitEvent = this.updateData
      this.dialogData = dialogData
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
    submitQuotation() {
      if (this.list.length === 0) {
        this.$notify({
          title: '無資料',
          message: '請填入牆面規格資料!',
          type: 'warning',
          duration: 2000
        })
        return false
      }
      // 全部轉字串
      this.list = this.list.map(data => {
        for (let i in data) {
          data[i] += ''
        }
        return data
      })
      var paras = {}
      paras.case_id = this.$route.query.caseId
      paras.items = [...this.list]
      paras.total = this.countTotal + ''
      let postUrl = 'caseField/newBrick'
      if (this.$route.params.pathMatch !== 'new') {
        paras.brick_id = this.$route.params.pathMatch
        postUrl = 'caseField/updateBrick'
        if (!this.isQREnter) {
          paras.status = 2
        }
      }
      this.$store.dispatch(postUrl, paras)
        .then(() => {
          if (this.isQREnter) {
            // 回到案場
            this.$router.replace('/caseField/info/' + this.$route.query.caseId)
          }
          this.$notify({
            title: '成功',
            message: '資料更新成功',
            type: 'success',
            duration: 2000
          })
        })
    },
    // 審核通過
    submitReview() {
      this.$confirm('確定將此計算表審核通過嗎?，確定繼續?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var paras = {}
        paras.case_id = this.$route.query.caseId
        paras.brick_id = this.$route.params.pathMatch
        paras.status = 3
        this.$store.dispatch('caseField/updateBrick', paras)
          .then(() => {
            if (this.isQREnter) {
              // 回到案場
              this.$router.replace('/caseField/info/' + this.$route.query.caseId)
            }
          })
      })
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

.casefield_name{
  text-align: center;
  font-size: 30px;
  color: #2c2c2c;
}
</style>
