<template>
  <el-dialog :title="dialogData.dialogName" class="dialog-rwd" :visible.sync="thisData.dialogFormVisible" :close-on-click-modal="false">
    <el-form
      ref="dataForm"
      :rules="dialogData.rules"
      :model="thisData.temp"
      label-position="left"
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

          <!--4:單純顯示項目-->
          <el-form-item v-else-if="item.edit === 4" :key="index" :label="item.label" :prop="index" :label-width="labelWidth">
            <div style="text-align:left">{{ thisData.temp[index] }}</div>
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

          <!--6:時間選擇器-->
          <el-form-item v-else-if="item.edit === 6" :key="index" :label="item.label" :prop="index" :label-width="labelWidth">
            <el-date-picker v-model="thisData.temp[index]" :type="item.dateType?item.dateType:'datetime'" :placeholder="item.label" class="filter-item" />
            <!-- <v-date-picker v-model="thisData.temp[index]" :mode="item.dateType?item.dateType:'dateTime'" is24hr>
              <template v-slot="{ inputValue, inputEvents }">
                <input type="text" :value="inputValue" autocomplete="off" class="el-input__inner" v-on="inputEvents">
              </template>
            </v-date-picker> -->
          </el-form-item>

          <!--7:可搜尋下拉選擇框-->
          <el-form-item v-else-if="item.edit === 7" :key="index" :label="item.label" :prop="index" :label-width="labelWidth">
            <el-select v-model="thisData.temp[index]" filterable placeholder="請選擇" style="display:block;">
              <el-option
                v-for="selectitem in item.selectData"
                :key="selectitem.value"
                :label="selectitem.label"
                :value="selectitem.value"
              >
                <span style="float: left">{{ selectitem.label }}</span>
                <span v-if="selectitem.note" style="float: right; color: #8492a6; font-size: 13px">{{ selectitem.note }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <!--8:顏色下拉選單-->
          <el-form-item v-else-if="item.edit === 8" :key="index" :label="item.label" :prop="index" :label-width="labelWidth">
            <el-select
              v-model="thisData.temp[index]"
              class="filter-item"
              placeholder=""
            >
              <template slot="prefix">
                <el-tag class="prefix" :style="`background-color: ${thisData.temp[index]}`" />
              </template>
              <el-option
                v-for="(value, dataKey) in item.colType.data"
                :key="dataKey"
                :label="dataKey"
                :value="dataKey"
                :style="`background-color:${dataKey};margin:5px 2px;color:#fff`"
              />
            </el-select>
            <span class="color_block" />
          </el-form-item>

          <!--9:Tag增減-->
          <el-form-item v-else-if="item.edit === 9" :key="index" :label="item.label" :prop="index" :label-width="labelWidth">
            <tag-input
              new-button-name="新增規格"
              :tag-data.sync="thisData.temp[index]"
            />
          </el-form-item>

          <!--基本input-->
          <el-form-item v-else :key="index" :label="item.label" :prop="index" :label-width="labelWidth">
            <el-input v-if="item.type === 'number'" v-model="thisData.temp[index]" @blur="thisData.temp[index] = thisData.temp[index] * 1" />
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
import tagInput from './editComponent/tagInput.vue'
export default {
  name: 'EditDialog',
  components: { tagInput },
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
