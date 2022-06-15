<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="newPettyCashClick()">儲值</el-button>
    </div>

    <TableList
      :list="list"
      :list-loading="listLoading"
      :table-format="tableFormat"
    />
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_size"
      @pagination="getList"
    />
    <EditDialog :dialog-data="dialogData" />
  </div>
</template>

<script>

import { getPettyCashList } from '@/api/pettyCash'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'CaseField',
  components: {},
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20
      },
      tableFormat: {},
      dialogData: {}
    }
  },
  computed: {
    ...mapState({
      PettyCashData: state => state.pettyCash.PettyCashData
    }),
    ...mapGetters([
      'defaultData',
      'getUserInfo'
    ])
  },
  created() {
    this.tableFormat = this.PettyCashData
    this.tableFormat.applicant.showMethod = (data) => {
      if (data.applicant != null) {
        return this.getUserInfo(data.applicant).username
      } else {
        return ''
      }
    }
    this.tableFormat.case_id.showMethod = (data) => {
      return data.caseName
    }
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      var paras = {}
      paras = Object.assign({}, this.listQuery)
      getPettyCashList(paras).then(async(response) => {
        for (const i in response.data) {
          response.data[i].caseName = ''
        }

        this.list = response.data
        this.total = response.pages.total_records

        const caseFieldParas = {
          page: 1,
          page_size: 20
        }

        for (const i in this.list) {
          if (this.list[i].case_id === '') continue
          caseFieldParas.case_id = this.list[i].case_id
          const accessRoutes = await this.$store.dispatch('caseField/getInfo', caseFieldParas)
          this.list[i].caseName = accessRoutes.data.name
        }
        this.listLoading = false
      })
    },
    newPettyCashClick() {
      var dialogData = {}
      dialogData.dialogName = '新增'
      dialogData.tableFormat = this.tableFormat
      dialogData.dialogFormVisible = true
      dialogData.temp = this.defaultData(this.PettyCashData)
      dialogData.rules = this.rules
      dialogData.submitEvent = this.newData
      this.dialogData = dialogData
    },
    // 新增資料
    newData(paras) {
      this.$store.dispatch('pettyCash/newPettyCash', paras)
        .then(() => {
          // 重新取得
          this.getList()
          this.dialogData.dialogFormVisible = false
          this.$notify({ title: '成功', message: '資料新增成功', type: 'success', duration: 2000 })
        })
        .catch(() => {
          this.$notify({ title: '失敗', message: '資料新增失敗', type: 'error', duration: 2000 })
        })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
