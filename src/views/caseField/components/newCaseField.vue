<template>
  <el-dialog :title="dialogData.dialogName" class="dialog-rwd" :visible.sync="thisData.dialogFormVisible" :close-on-click-modal="false">
    <el-form
      ref="dataForm"
      :rules="dialogData.rules"
      :model="thisData.temp"
      label-position="left"
    >

      <el-form-item :label="thisData.tableFormat['name'].label" prop="name" :label-width="labelWidth">
        <el-input v-model="thisData.temp['name']" />
      </el-form-item>

      <el-form-item :label-width="labelWidth">
        <el-radio v-model="customer_id_type" label="0">現有客戶</el-radio>
        <el-radio v-model="customer_id_type" label="1">新增客戶</el-radio>
      </el-form-item>

      <el-form-item v-if="customer_id_type == 0" :label="thisData.tableFormat['customer_id'].label" prop="customer_id" :label-width="labelWidth">
        <el-select v-model="thisData.temp['customer_id']" filterable placeholder="請選擇" style="display:block;">
          <el-option
            v-for="selectitem in thisData.tableFormat['customer_id'].selectData"
            :key="selectitem.value"
            :label="selectitem.label"
            :value="selectitem.value"
          >
            <span style="float: left">{{ selectitem.label }}</span>
            <span v-if="selectitem.note" style="float: right; color: #8492a6; font-size: 13px">{{ selectitem.note }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="customer_id_type == 1" :label="thisData.tableFormat['customer_id'].label" :label-width="labelWidth">
        <el-input v-model="customerData['company_name']" placeholder="客戶名稱" />
        <el-input v-model="customerData['phone_number']" placeholder="客戶電話" />
        <el-input v-model="customerData['address']" placeholder="客戶地址" />
        <el-input v-model="customerData['contact_person']" placeholder="聯絡人" />
      </el-form-item>

      <el-form-item :label="thisData.tableFormat['contractor_id'].label" :label-width="labelWidth">
        <el-radio v-model="contractor_id_type" label="0">同上</el-radio>
        <el-radio v-model="contractor_id_type" label="1">現有客戶</el-radio>
        <el-radio v-model="contractor_id_type" label="2">新增客戶</el-radio>
      </el-form-item>

      <el-form-item v-if="contractor_id_type == 1" prop="contractor_id" :label-width="labelWidth">
        <el-select v-model="thisData.temp['contractor_id']" filterable placeholder="請選擇" style="display:block;">
          <el-option
            v-for="selectitem in thisData.tableFormat['contractor_id'].selectData"
            :key="selectitem.value"
            :label="selectitem.label"
            :value="selectitem.value"
          >
            <span style="float: left">{{ selectitem.label }}</span>
            <span v-if="selectitem.note" style="float: right; color: #8492a6; font-size: 13px">{{ selectitem.note }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="contractor_id_type == 2" :label-width="labelWidth">
        <el-input v-model="contractorData['company_name']" placeholder="客戶名稱" />
        <el-input v-model="contractorData['phone_number']" placeholder="客戶電話" />
        <el-input v-model="contractorData['address']" placeholder="客戶地址" />
        <el-input v-model="contractorData['contact_person']" placeholder="聯絡人" />
      </el-form-item>

      <el-form-item :label="thisData.tableFormat['address'].label" prop="address" :label-width="labelWidth">
        <el-input v-model="thisData.temp['address']" />
      </el-form-item>

      <el-form-item :label="thisData.tableFormat['notes'].label" prop="notes" :label-width="labelWidth">
        <el-input v-model="thisData.temp['notes']" />
      </el-form-item>

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
  name: 'NewCaseField',
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
      labelWidth: '80px',
      thisData: {},
      // 客戶ID類型: 0:選擇、1:手key
      customer_id_type: '0',
      customerData: {},
      // 承包商ID類型: 0:同上、1:選擇、2:手key
      contractor_id_type: '0',
      contractorData: {}
    }
  },
  watch: {
    dialogData: {
      handler(value) {
        this.thisData = JSON.parse(JSON.stringify(value))
        this.formatCheck()
        this.customerData = {}
        this.contractorData = {}
        this.customer_id_type = '0'
        this.contractor_id_type = '0'
      },
      deep: true
    }
  },
  created() {
  },
  methods: {
    // 新增
    createData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          // 檢查是否有自訂欄位沒填
          if (!this.checkForm()) return
          // 新增客戶資料
          if (this.customer_id_type === '1') {
            this.thisData.temp.customer_id = await this.newCustomerData(this.customerData)
          }
          if (this.contractor_id_type === '2') {
            this.thisData.temp.contractor_id = await this.newCustomerData(this.contractorData)
          } else if (this.contractor_id_type === '0') {
            this.thisData.temp.contractor_id = this.thisData.temp.customer_id
          }
          const temp = { ...this.thisData.temp }
          this.dialogData.submitEvent(temp)
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
        const temp = this.thisData.temp
        this.dialogData.deleteEvent(temp)
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
    checkForm() { // 檢查必填
      if (this.customer_id_type === '1') {
        if (!this.checkFormData(this.customerData)) {
          return false
        }
      }
      if (this.contractor_id_type === '2') {
        if (!this.checkFormData(this.contractorData)) {
          return false
        }
      }
      return true
    },
    checkFormData(checkCustom) { // 欄位檢查
      if (checkCustom['company_name'] === '' || typeof checkCustom['company_name'] === 'undefined') {
        this.$notify({ title: '錯誤', message: '客戶名稱為必填', type: 'error', duration: 2000 })
        return false
      }
      if (checkCustom['address'] === '' || typeof checkCustom['address'] === 'undefined') {
        this.$notify({ title: '錯誤', message: '客戶地址為必填', type: 'error', duration: 2000 })
        return false
      }
      if (checkCustom['phone_number'] === '' || typeof checkCustom['phone_number'] === 'undefined') {
        this.$notify({ title: '錯誤', message: '客戶電話為必填', type: 'error', duration: 2000 })
        return false
      }
      if (checkCustom['contact_person'] === '' || typeof checkCustom['contact_person'] === 'undefined') {
        this.$notify({ title: '錯誤', message: '聯絡人為必填', type: 'error', duration: 2000 })
        return false
      }
      return true
    },
    // 新增客戶資料
    async newCustomerData(paras) {
      let customer_id = ''
      await this.$store.dispatch('customer/newData', paras)
        .then((response) => {
          console.log('newCustomerData', response)
          customer_id = response.data.customer_id
        })
        .catch(() => {
          this.$notify({ title: '失敗', message: '資料新增失敗', type: 'error', duration: 2000 })
        })
      return customer_id
    }
  }
}
</script>

<style lang="sass">
.el-input--prefix .el-input__inner
  padding-left: 40px

</style>

<style lang="sass" scoped>
.color_block
  width: 50px
  height: 50px

.el-select .el-tag
  margin: 4px 0 2px 6px

.filter-item
  display: block
</style>
