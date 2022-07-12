<template>
  <el-table :data="list" style="width: 100%" height="100%">
    <el-table-column label="時間" min-width="20%" align="center">
      <template slot-scope="scope">
        {{ scope.row.created_at | dateFormat }}
      </template>
    </el-table-column>
    <el-table-column label="收款金額" min-width="20%" align="center">
      <template slot-scope="scope">
        {{ scope.row.receipts | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="備註" min-width="10%" align="center">
      <template slot-scope="scope">
        {{ scope.row.notes }}
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="10%" align="center">
      <template slot-scope="scope">
        <el-button type="danger" icon="el-icon-delete" circle @click="deleteReceipt(scope.row)" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getReceipts, deleteReceipt } from '@/api/caseField'
import { mapGetters } from 'vuex'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  props: {
    caseId: {
      type: String,
      default() {
        return ''
      }
    },
    reloadSw: {
      type: Boolean,
      default() {
        return false
      }
    },
    sumReceipts: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      list: null
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  },
  watch: {
    reloadSw: {
      handler: function(val, oldVal) {
        this.fetchData()
      },
      deep: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      var paras = {}
      paras.case_id = this.caseId
      paras.page_size = 200
      paras.page = 1
      getReceipts(paras).then(response => {
        this.list = response.data
        // 加總
        let sum = 0
        if (this.list != null) {
          for (const i in this.list) {
            sum += this.list[i].receipts * 1
          }
        }
        this.$emit('update:sumReceipts', sum)
      })
    },
    deleteReceipt(scope) {
      this.$confirm('此操作將永久刪除該筆資料，確定繼續?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const paras = {}
        paras.receipts_id = scope.record_id
        paras.case_id = this.caseId
        deleteReceipt(paras).then(() => {
          // 重新取得清單
          this.fetchData()
          this.$notify({
            title: '成功',
            message: '資料刪除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    }
  }
}
</script>
