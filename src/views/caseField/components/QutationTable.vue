<template>
  <el-table :data="list" style="width: 100%" height="100%">
    <!-- <el-table-column label="#" min-width="10%" align="center">
      <template slot-scope="scope">
        {{ scope.$index + 1 }}
      </template>
    </el-table-column> -->
    <el-table-column label="時間" min-width="20%" align="center">
      <template slot-scope="scope">
        {{ scope.row.created_at | dateFormat }}
      </template>
    </el-table-column>
    <el-table-column label="金額" min-width="30%" align="center">
      <template slot-scope="scope">
        {{ countAmount(scope.row.items) | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="15%" align="center">
      <template slot-scope="scope">
        <el-button circle @click="toQuotationInfo(scope)">
          <svg-icon icon-class="eye-open" />
        </el-button>
        <el-button type="info" icon="el-icon-printer" circle @click="toQuotationPrint(scope)" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getQuotation } from '@/api/caseField'

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
    sumQutation: {
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
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const paras = {}
      paras.case_id = this.caseId
      getQuotation(paras).then(response => {
        this.list = response.data
        // 加總
        let sum = 0
        if (this.list != null) {
          for (const i in this.list) {
            sum += this.countAmount(this.list[i].items) * 1
          }
        }
        this.$emit('update:sumQutation', sum)
      })
    },
    countAmount(data) {
      var sum = 0
      for (var i in data) {
        if (typeof data[i].amount !== 'undefined') sum += data[i].amount * 1
      }
      return sum
    },
    toQuotationInfo(scope) {
      this.$router.replace('/caseField/quotation/' + scope.row.quotation_id + '?caseId=' + this.caseId)
    },
    toQuotationPrint(scope) {
      window.open('#/printQuotation/' + scope.row.quotation_id + '?caseId=' + this.caseId, '_blank')
    }
  }
}
</script>
