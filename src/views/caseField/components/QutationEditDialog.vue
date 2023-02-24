<template>
  <el-dialog :title="dialogData.dialogName" :visible.sync="thisData.dialogFormVisible" :close-on-click-modal="false">
    <el-form
      ref="dataForm"
      :rules="dialogData.rules"
      :model="thisData.temp"
      label-position="left"
      label-width="70px"
      style="margin:0 50px"
    >
      <template v-for="(item, index) in thisData.tableFormat">
        <template v-if="item.edit >= 0">
          <!--9:自動建議輸入框-->
          <el-form-item v-if="item.edit === 9" :key="index" :label="item.label" :prop="index" :label-width="labelWidth">
            <el-autocomplete
              v-model="thisData.temp[index]"
              class="inline-input"
              :fetch-suggestions="item.querySearch"
              placeholder="请输入内容"
              style="display:block"
              @select="handleSelect"
            >
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
              </template>
            </el-autocomplete>
          </el-form-item>

          <!--基本input-->
          <el-form-item v-else :key="index" :label="item.label" :prop="index" :label-width="labelWidth">
            <el-input v-if="item.type === 'number'" v-model.number="thisData.temp[index]" />
            <el-input v-else-if="item.type === 'password'" v-model="thisData.temp[index]" type="password" />
            <el-input v-else-if="item.type === 'textarea'" v-model="thisData.temp[index]" type="textarea" />
            <el-input v-else v-model="thisData.temp[index]" />
          </el-form-item>
        </template>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="typeof dialogData.deleteEvent !== 'undefined'" style="float:left" type="danger" @click="removeCheck()"> 刪除 </el-button>
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
export default {
  name: 'EditDialog',
  filters: {
  },
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
      thisData: {}
    }
  },
  watch: {
    dialogData: {
      handler(value) {
        this.thisData = Object.assign({}, value)
        this.formatCheck()
      },
      deep: true
    },
    'dialogData.temp.quantity': {
      handler(value) {
        this.countAmount()
      }
    },
    'dialogData.temp.unit_price': {
      handler(value) {
        this.countAmount()
      }
    }
  },
  created() {
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
    // 刪除確認視窗
    removeCheck() {
      this.$confirm('此操作將永久刪除此資料，是否繼續?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogData.deleteEvent(this.thisData.temp)
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // })
      })
    },
    formatCheck() {
      // 表格格式撿查
      for (const i in this.thisData.tableFormat) {
        if (this.thisData.tableFormat[i].edit === 7 && typeof this.thisData.tableFormat[i].selectData !== 'object') {
          console.error(`'${i}'未給予陣列項目{selectData}!`)
          this.thisData.tableFormat[i].selectData = [
            { value: null, label: '無' }
          ]
        }
      }
    },
    countAmount() {
      if (this.thisData.temp['quantity'] != null && this.thisData.temp['unit_price'] != null) {
        let amount = this.thisData.temp['quantity'] * this.thisData.temp['unit_price']
        amount = parseFloat(amount.toPrecision(12))
        amount = Math.round(amount)
        this.thisData.temp['amount'] = amount
      }
    },
    handleSelect(item) {
      this.thisData.temp['name'] = item['name']
    }
  }
}
</script>

<style lang="sass">
.el-input--prefix .el-input__inner
  padding-left: 40px

</style>

<style lang="sass" scoped>
.el-form-item__label
  width: 120px

.color_block
  width: 50px
  height: 50px

.el-select .el-tag
  margin: 4px 0 2px 6px

.filter-item
  display: block
</style>
