<template>
  <el-dialog :title="dialogData.dialogName" :visible.sync="thisData.dialogFormVisible">
    <el-form
      ref="dataForm"
      :rules="dialogData.rules"
      :model="thisData.temp"
      label-position="left"
      label-width="70px"
      style="width: 400px; margin-left: 50px"
    >
      <template v-for="(item, index) in thisData.tableFormat">
        <template v-if="item.edit >= 0">
          <!--1:單選物件-->
          <el-form-item v-if="item.edit === 1" :key="index" :label="item.label" :prop="index" :label-width="labelWidth">
            <el-select
              v-model="thisData.temp[index]"
              class="filter-item"
              placeholder="Please select"
            >
              <el-option
                v-for="(value, dataKey) in item.colType.data"
                :key="dataKey"
                :label="value"
                :value="dataKey * 1"
              />
            </el-select>
          </el-form-item>
          <!--2:單選陣列-->
          <el-form-item v-else-if="item.edit === 2" :key="index" :label="item.label" :prop="index" :label-width="labelWidth">
            <el-select
              v-model="thisData.temp[index]"
              class="filter-item"
              placeholder="Please select"
            >
              <el-option
                v-for="(value, dataKey) in item.colType.data"
                :key="dataKey"
                :label="value"
                :value="value"
              />
            </el-select>
          </el-form-item>
          <!--3:多選陣列-->
          <el-form-item v-else-if="item.edit === 3" :key="index" :label="item.label" :prop="index" :label-width="labelWidth">
            <el-select
              v-model="thisData.temp[index]"
              class="filter-item"
              placeholder="Please select"
              multiple
            >
              <el-option
                v-for="(value, dataKey) in item.colType.data"
                :key="dataKey"
                :label="value"
                :value="value"
              />
            </el-select>
          </el-form-item>

          <!--5:跟隨選項類型-->
          <el-form-item v-else-if="item.edit === 5" :key="index" :label="item.label" :prop="index" :label-width="labelWidth">
            <el-select
              v-model="thisData.temp[index]"
              class="filter-item"
              placeholder=""
            >
              <el-option
                v-for="(value, dataKey) in item.colType.data[thisData.temp[item.colType.followKey]]"
                :key="dataKey"
                :label="value"
                :value="value"
              />
            </el-select>
          </el-form-item>

          <!--6:可搜尋下拉選擇框-->
          <el-form-item v-else-if="item.edit === 6" :key="index" :label="item.label" :prop="index" :label-width="labelWidth">
            <el-select v-model="thisData.temp[index]" filterable placeholder="">
              <el-option
                v-for="selectitem in item.selectData"
                :key="selectitem.value"
                :label="selectitem.label"
                :value="selectitem.value"
              />
            </el-select>
          </el-form-item>

          <!--基本input-->
          <el-form-item v-else :key="index" :label="item.label" :prop="index" :label-width="labelWidth">
            <el-input v-if="item.type === 'number'" v-model.number="thisData.temp[index]" />
            <el-input v-else-if="item.type === 'password'" v-model="thisData.temp[index]" type="password" />
            <el-input v-else v-model="thisData.temp[index]" />
          </el-form-item>
        </template>
      </template>
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
    formatCheck() {
      // 表格格式撿查
      console.log(this.thisData.tableFormat)
      for (const i in this.thisData.tableFormat) {
        if (this.thisData.tableFormat[i].edit === 6 && typeof this.thisData.tableFormat[i].selectData !== 'object') {
          console.error(`'${i}'未給予陣列項目{selectData}!`)
          this.thisData.tableFormat[i].selectData = [
            { value: null, label: '無' }
          ]
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.el-form-item__label
  width: 120px

</style>
