<template>
  <el-table
    :key="tableKey"
    v-loading="listLoading"
    :data="list"
    border
    fit
    highlight-current-row
    class="my-table"
  >
    <template v-for="(item, index) in tableFormat">
      <template v-if="item.list >= 0">
        <!--1:陣列帶值-->
        <el-table-column v-if="item.list === 1" :key="index" class-name="status-col" :label="item.label">
          <template slot-scope="{row}">
            <el-tag v-if="item.colType.typeColor != null" :type="item.colType.typeColor[row[index]]">
              {{ item.colType.data[row[index]] }}
            </el-tag>
            <span v-else>{{ item.colType.data[row[index]] }}</span>
          </template>
        </el-table-column>

        <!--4:Tag類型-->
        <el-table-column v-else-if="item.list === 4" :key="index" class-name="status-col" :label="item.label">
          <template slot-scope="{row}">
            <el-tag v-for="(value,key) in row[index]" :key="key" size="medium" :type="`info`">
              {{ value[item.colType.nameKey] }}
            </el-tag>
          </template>
        </el-table-column>

        <!--6:時間類型-->
        <el-table-column v-else-if="item.list === 6" :key="index" align="center" :label="item.label">
          <template slot-scope="scope">
            <span>{{ scope.row[index] | dateFormat }}</span>
          </template>
        </el-table-column>

        <!--7:千分號類型-->
        <el-table-column v-else-if="item.list === 7" :key="index" align="center" :label="item.label" :width="item.width">
          <template slot-scope="scope">
            <span>{{ scope.row[index] | toThousandFilter }}</span>
          </template>
        </el-table-column>

        <!--9:自寫方法類型-->
        <el-table-column v-else-if="item.list === 9" :key="index" align="center" :label="item.label">
          <template slot-scope="scope">
            <span>{{ item.showMethod(scope.row) }}</span>
          </template>
        </el-table-column>

        <!--99:操作按鈕-->
        <el-table-column v-else-if="item.list === 99" :key="index" align="center" :label="item.label" :width="item.width">
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
</template>

<script>

export default {
  name: 'TableList',
  props: {
    listLoading: Boolean,
    tableKey: {
      type: Boolean,
      default() {
        return true
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    colType: {
      type: Object,
      default() {
        return {}
      }
    },
    tableFormat: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  created() {
    // 表格格式撿查
    for (const i in this.tableFormat) {
      if (this.tableFormat[i].list === 9 && typeof this.tableFormat[i].showMethod !== 'function') {
        console.error(`'${i}'未定義顯示方法!`)
      }
    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
</style>
