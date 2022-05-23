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
    <el-table-column label="填表人" min-width="10%" align="center">
      <template slot-scope="scope">
        {{ getUserInfo(scope.row.applicant).username }}
      </template>
    </el-table-column>
    <el-table-column label="總計(M²)" min-width="10%" align="center">
      <template slot-scope="scope">
        {{ scope.row.total }}
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="20%" align="center">
      <template slot-scope="scope">
        <el-button circle @click="toBrickInfo(scope)">
          <svg-icon icon-class="eye-open" />
        </el-button>
        <el-button type="danger" icon="el-icon-delete" circle @click="deleteBrick(scope)" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getBrick } from '@/api/caseField'

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
      getBrick(paras).then(response => {
        this.list = response.data
      })
    },
    toBrickInfo(scope) {
      this.$router.replace('/caseField/brick/' + scope.row.brick_id + '?caseId=' + this.caseId)
    },
    deleteBrick(scope) {
      this.$confirm('此操作將永久刪除該筆資料，確定繼續?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const paras = {}
        paras.brick_id = scope.row.brick_id
        paras.case_id = this.caseId
        this.$store.dispatch('caseField/deleteBrick', paras)
          .then(() => {
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
