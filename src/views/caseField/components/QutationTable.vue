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
        {{ countAmount(scope.row.items) }}
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
      this.$router.replace('/caseField/quotation/' + scope.row.quotation_id + '?caseId=01737bab-2ad5-4c69-811b-61d941f4e518')
    },
    toQuotationPrint(scope) {
      // this.$router.replace('/printQuotation/' + scope.row.quotation_id + '?caseId=01737bab-2ad5-4c69-811b-61d941f4e518')
      window.open('#/printQuotation/' + scope.row.quotation_id + '?caseId=01737bab-2ad5-4c69-811b-61d941f4e518', '_blank')
    }
  }
}
</script>
