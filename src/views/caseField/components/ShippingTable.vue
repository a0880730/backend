<template>
  <el-table :data="list" style="width: 100%" height="100%">
    <!-- <el-table-column label="#" min-width="5%" align="center">
      <template slot-scope="scope">
        {{ scope.$index + 1 }}
      </template>
    </el-table-column> -->
    <el-table-column label="填表時間" min-width="20%" align="center">
      <template slot-scope="scope">
        {{ scope.row.created_at | dateFormat }}
      </template>
    </el-table-column>
    <el-table-column label="出貨人" min-width="10%" align="center">
      <template slot-scope="scope">
        {{ getUserInfo(scope.row.applicant).username }}
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="20%" align="center">
      <template slot-scope="scope">
        <el-button circle @click="toShippingInfo(scope)">
          <svg-icon icon-class="eye-open" />
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getCaseShipping } from '@/api/caseField'

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
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      var paras = {}
      paras.case_id = this.caseId
      getCaseShipping(paras).then(response => {
        this.list = response.data
      })
    },
    toShippingInfo(scope) {
      this.$router.replace('/caseField/shipping/' + scope.row.batch_id + '?caseId=' + this.caseId)
    }
  }
}
</script>
