<template>
  <el-dialog :title="dialogData.dialogName" class="dialog-rwd" :visible.sync="thisData.dialogFormVisible">

    <el-form
      ref="dataForm"
      :rules="dialogData.rules"
      :model="thisData.temp"
    >

      <el-row>
        <el-col :span="12" :xs="24" style="padding:0 20px">
          <el-form-item style="margin-bottom: 40px;" label="施工內容">
            <el-autocomplete
              v-model="productName"
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
        <el-col :span="12" :xs="24" style="padding:0 20px">
          <el-form-item style="margin-bottom: 40px;" label="數量">
            <el-input v-model="thisData.temp.quantity" type="text" placeholder="請輸入數量" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

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
      productName: ''
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
    querySearch(queryString, cb) {
      var productList = this.productList
      var results = queryString !== '' ? productList.filter(this.createFilter(queryString)) : productList
      cb(results)
    },
    createFilter(queryString) {
      return (product) => {
        console.log(queryString, product)
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
      this.productName = item.name + ' - ' + item.specification
      this.thisData.temp.product_id = item.product_id
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
