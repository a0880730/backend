<template>
  <el-dialog :title="dialogData.dialogName" class="dialog-rwd" :visible.sync="thisData.dialogFormVisible" :close-on-click-modal="false">
    <el-form
      ref="dataForm"
      :rules="dialogData.rules"
      :model="thisData.temp"
      label-position="left"
    >
      <el-form-item label="待辦事項" :label-width="labelWidth">
        <div style="text-align:left">{{ thisData.temp.name || '' }}</div>
      </el-form-item>
      <el-form-item label="時間" :label-width="labelWidth">
        <div style="text-align:left">{{ thisData.temp.start_at | dateFormat }}</div>
      </el-form-item>
      <el-form-item label="備註" :label-width="labelWidth">
        <div style="text-align:left">{{ thisData.temp.notes || '' }}</div>
      </el-form-item>

      <el-form-item label="狀態" :label-width="labelWidth" style="text-align:left">
        <el-switch
          v-model="finishSw"
          active-color="#13ce66"
          inactive-color="#b3b3b3"
          active-text="已完成"
          inactive-text="待辦">
        </el-switch>
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
  name: 'EditDialog',
  components: {},
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
      thisData: {
        temp: {
          name: "",
          notes: "",
          status: 1
        }
      },
      finishSw: false
    }
  },
  watch: {
    dialogData: {
      handler(value) {
        this.thisData = Object.assign({}, value)
        this.finishSw = this.thisData.temp.status === 2
        this.formatCheck()
      },
      deep: true
    },
    finishSw: {
      handler(value) {
        if (value) {
          this.thisData.temp.status = 2
        } else {
          this.thisData.temp.status = 1
        }
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
