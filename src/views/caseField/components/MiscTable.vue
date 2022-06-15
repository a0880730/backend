<template>
  <el-table :data="list" style="width: 100%" height="100%">
    <el-table-column label="申請時間" min-width="20%" align="center">
      <template slot-scope="scope">
        {{ scope.row.created_at | dateFormat }}
      </template>
    </el-table-column>
    <el-table-column label="項目" min-width="20%" align="center">
      <template slot-scope="scope">
        {{ scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column label="金額" min-width="20%" align="center">
      <template slot-scope="scope">
        {{ scope.row.amount | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="零用金支出" min-width="20%" align="center">
      <template slot-scope="scope">
        <i v-if="scope.row.petty_cash" class="el-icon-check" style="font-size: 22px;" />
      </template>
    </el-table-column>
    <el-table-column label="申請人" min-width="10%" align="center">
      <template slot-scope="scope">
        {{ getUserInfo(scope.row.applicant).username }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getMiscList } from '@/api/caseField'
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
      getMiscList(paras).then(response => {
        this.list = response.data
      })
    }
  }
}
</script>
