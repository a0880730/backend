<template>
  <el-table :data="list" style="width: 100%" height="100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="right" inline class="demo-table-expand">
          <template v-for="(item,index) in props.row.shippingDetail">
            <el-form-item :key="index" :label="`#`+(index+1)">
              <span style="font-size:18px">{{ item.product_name }}</span>
              <span style="font-size:22px"> × {{ item.quantity }}</span>
            </el-form-item>
          </template>
        </el-form>
      </template>
    </el-table-column>
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
    <el-table-column label="備註" min-width="20%" align="center">
      <template slot-scope="scope">
        {{ scope.row.notes }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getProductRecord } from '@/api/product'
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
      getCaseShipping(paras).then(async(response) => {
        for (const i in response.data) {
          response.data[i].shippingDetail = []
        }
        this.list = [...response.data]
        for (const i in this.list) {
          const paras = {}
          paras.page_size = 200
          paras.page = 1
          paras.batch_id = this.list[i].batch_id
          // 詳細資料查詢
          const shippingDetail = await getProductRecord(paras)
          this.list[i].shippingDetail = shippingDetail.data
        }
      })
    },
    show(a) {
      console.log(a)
    }
    // toShippingInfo(scope) {
    //   this.$router.replace('/caseField/shipping/' + scope.row.batch_id + '?caseId=' + this.caseId)
    // }
  }
}
</script>

<style lang="scss" scoped>
.demo-table-expand{
  padding: 0 20px;
}

</style>

