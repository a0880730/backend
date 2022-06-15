<template>
  <el-dialog :title="dialogData.dialogName" class="dialog-rwd" :visible.sync="thisData.dialogFormVisible" :close-on-click-modal="false">

    <el-form
      ref="dataForm"
      :rules="dialogData.rules"
      :model="thisData.temp"
    >

      <el-row>
        <el-col :span="12" :xs="24" style="padding:0 20px">
          <el-form-item style="margin-bottom: 40px;" label="編號">
            <el-input v-model="thisData.temp.number" type="text" placeholder="請輸入編號" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24" style="padding:0 20px">
          <el-form-item style="margin-bottom: 40px;" label="施工內容">
            <el-autocomplete
              v-model="thisData.temp.name"
              popper-class="product-input"
              class="inline-input"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="handleSelect"
            >
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }} - {{ item.specification }}</div>
                <span class="specification">{{ item.notes }}</span>
              </template>
            </el-autocomplete>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="form-content">
      <el-col :span="24" class="_title">
        牆
      </el-col>
      <el-col :span="8" :xs="24" class="_item">
        寬(M²)<br>
        <input v-model="thisData.temp.width" class="el-input__inner" type="number">
      </el-col>
      <el-col :span="8" :xs="24" class="_item">
        高(M²)<br>
        <input v-model="thisData.temp.height" class="el-input__inner" type="number">
      </el-col>
      <el-col :span="8" :xs="24" class="symbol _total">
        <br>= {{ thisData.temp.quantity }}M²
      </el-col>
    </el-row>

    <el-row style="margin-top:20px">
      <el-col :span="24" class="_title">
        <el-checkbox v-model="door_checkbox" class="my-checkbox">扣門洞</el-checkbox>
      </el-col>
    </el-row>
    <el-row v-if="door_checkbox" class="form-content">
      <el-col :span="8" :xs="24" class="_item">
        寬(M²)<br>
        <input v-model="thisData.temp.door_width" class="el-input__inner" type="number">
      </el-col>
      <el-col :span="8" :xs="24" class="_item">
        高(M²)<br>
        <input v-model="thisData.temp.door_height" class="el-input__inner" type="number">
      </el-col>
      <el-col :span="8" :xs="24" class="_total _red">
        <br>= -{{ thisData.temp.door_quantity }} M²
      </el-col>
    </el-row>

    <el-row style="margin-top:20px">
      <el-col :span="24" class="_title">
        <el-checkbox v-model="window_checkbox" class="my-checkbox">扣窗洞</el-checkbox>
      </el-col>
    </el-row>
    <el-row v-if="window_checkbox" class="form-content">
      <el-col :span="8" :xs="24" class="_item">
        寬(M²)<br>
        <input v-model="thisData.temp.window_width" class="el-input__inner" type="number">
      </el-col>
      <el-col :span="8" :xs="24" class="_item">
        高(M²)<br>
        <input v-model="thisData.temp.window_height" class="el-input__inner" type="number">
      </el-col>
      <el-col :span="8" :xs="24" class="_total _red">
        <br>= -{{ thisData.temp.window_quantity }} M²
      </el-col>
    </el-row>
    <el-row class="form-content">
      <el-col :span="24" class="_total">
        總計: {{ thisData.temp.subtotal }} M²
      </el-col>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button @click="thisData.dialogFormVisible = false"> 取消 </el-button>
      <el-button
        type="primary"
        @click="createData()"
      >
        送出
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getProductInfo } from '@/api/product'

export default {
  name: 'EditDialog',
  filters: {
  },
  components: {},
  props: {
    dialogData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      labelWidth: '120px',
      thisData: {
        temp: {
          number: null
        }
      },
      productList: [],
      door_checkbox: false,
      window_checkbox: false
    }
  },
  computed: {
  },
  watch: {
    dialogData: {
      handler(value) {
        this.thisData = Object.assign({}, value)
      },
      deep: true
    },
    'thisData.temp.width'() {
      this.countWallQuantity()
    },
    'thisData.temp.height'() {
      this.countWallQuantity()
    },
    'thisData.temp.door_width'() {
      this.countDoorQuantity()
    },
    'thisData.temp.door_height'() {
      this.countDoorQuantity()
    },
    'thisData.temp.window_width'() {
      this.countwindowQuantity()
    },
    'thisData.temp.window_height'() {
      this.countwindowQuantity()
    },
    door_checkbox(value) {
      if (value === false) {
        this.thisData.temp.door_width = '0'
        this.thisData.temp.door_height = '0'
        this.countDoorQuantity()
      }
    },
    window_checkbox(value) {
      if (value === false) {
        this.thisData.temp.window_width = '0'
        this.thisData.temp.window_height = '0'
        this.countwindowQuantity()
      }
    }
  },
  created() {
    this.getProductInfo()
  },
  methods: {
    // 新增
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogData.submitEvent(this.thisData.temp)
        }
      })
    },
    countWallQuantity() {
      this.thisData.temp.quantity = parseFloat((this.thisData.temp.width * this.thisData.temp.height).toPrecision(12))
      this.countSubtotal()
    },
    countDoorQuantity() {
      this.thisData.temp.door_quantity = parseFloat((this.thisData.temp.door_width * this.thisData.temp.door_height).toPrecision(12))
      this.countSubtotal()
    },
    countwindowQuantity() {
      this.thisData.temp.window_quantity = parseFloat((this.thisData.temp.window_width * this.thisData.temp.window_height).toPrecision(12))
      this.countSubtotal()
    },
    countSubtotal() {
      this.thisData.temp.subtotal = this.thisData.temp.quantity - this.thisData.temp.door_quantity - this.thisData.temp.window_quantity
      this.thisData.temp.subtotal = parseFloat(this.thisData.temp.subtotal.toPrecision(12))
    },
    querySearch(queryString, cb) {
      var productList = this.productList
      var results = queryString !== '' ? productList.filter(this.createFilter(queryString)) : productList
      cb(results)
    },
    createFilter(queryString) {
      return (product) => {
        return (product.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) || (product.specification.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    getProductInfo() {
      this.listLoading = true
      var paras = {}
      getProductInfo(paras).then((response) => {
        this.productList = response.data
      })
    },
    handleSelect(item) {
      this.thisData.temp.name = item.name + ' - ' + item.specification
    }
  }
}
</script>

<style lang="scss">
.form-content{
  .el-input__inner{
    font-size: 22px;
  }
}

.inline-input{
  width: 100%;
  font-size: 22px;
}

.product-input{
  li{
    line-height: normal;
    padding-top: 7px;
    padding-bottom: 7px;

    .specification{
      font-size: 12px;
      color: #b4b4b4;
    }
  }
}

.my-checkbox{
  .el-checkbox__input,.el-checkbox__label{
    font-size: 28px;
  }
  .el-checkbox__inner{
    width: 30px;
    height: 30px;
  }
  .el-checkbox__inner::after{
    width: 10px;
    height: 19px;
    left: 8px;
  }
}
</style>

<style lang="sass" scoped>
.el-form-item__label
  width: 120px

.form-content
  margin-top: 25px
  padding-bottom: 25px
  border-bottom: 1px solid #cccccc4a

  ._title
    font-size: 22px
    display: flex
    justify-content: flex-start
    align-items: center

  ._item
    font-size: 20px
    text-align: center
    line-height: 35px
    padding: 0 10px

    &.align-right
      text-align: right

  ._total
    font-size: 30px
    text-align: center

    &._red
      color: #FF0000

</style>
