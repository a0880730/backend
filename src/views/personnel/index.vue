<template>
  <div class="app-container">

    <FilterContainer
      :table-format="tableFormat"
      :list-query.sync="listQuery"
      :nwe-btn="newPersonnalClick"
      @get-list="getList"
    />

    <TableList
      :list="list"
      :list-loading="listLoading"
      :table-format="tableFormat"
      @editItemClick="editItemClick"
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
import { getInfo, newUser, updateUser, getUserSalary, patchUserSalary } from '@/api/user'
import { mapState, mapGetters } from 'vuex'
import { getRole } from '@/api/role'

export default {
  name: 'PersonnelList',
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
      dialogData: {},
      tableFormat: null
    }
  },
  computed: {
    ...mapState({
      PersonnelData: state => state.user.PersonnelData,
      rules: state => state.user.rules
    }),
    ...mapGetters([
      'defaultData',
      'toThousandFilter'
    ])
  },
  created() {
    this.tableFormat = this.PersonnelData
    // custom show
    const _this = this
    this.tableFormat.salary.showMethod = function(scop){
      if (scop.salaryStatus == 1) {
        return _this.toThousandFilter(scop.salary)
      } 
      return "<i class='el-icon-error'></i>"
    }

    // Add Button listener
    this.tableFormat.CtrlBtn = { label: '操作', list: 99, width: '230px', button: [
      { label: '編輯', type: 'primary', size: 'mini', callMethod: this.editItemClick }
    ]
    }
    this.getRole()
    this.getList()
  },
  methods: {
    getRole() {
      getRole().then((response) => {
        this.tableFormat.role.colType.data = []
        for (const item of response.data) {
          if (item.role_tag === 'admin') continue
          this.tableFormat.role.colType.data.push(item.role_tag)
        }
      })
    },
    async getList() {
      this.listLoading = true
      var paras = {}
      paras = Object.assign({}, this.listQuery)
      await getInfo(paras).then(async(response) => {
        for(let i in response.data){
          const salaryParas = {}
          salaryParas.user_id = response.data[i].user_id
          await getUserSalary(salaryParas).then(salaryData => {
            response.data[i].salary = 0
            response.data[i].salaryStatus = 0
            if (salaryData.code === 200) {
              const userSalary = salaryData.data
              response.data[i].salary = userSalary.salary
              response.data[i].salaryStatus = userSalary.status
            }
          })
        }
        return response
      }).then(response => {
        this.list = response.data
        this.total = response.pages.total_records
        this.listLoading = false
      }).catch(error => {
        console.error(error)
      })
    },
    newPersonnalClick() {
      const dialogData = {}
      dialogData.dialogName = '新增'
      dialogData.tableFormat = { ...this.tableFormat }
      dialogData.dialogFormVisible = true
      dialogData.temp = this.defaultData(this.PersonnelData)
      dialogData.rules = this.rules
      dialogData.submitEvent = this.newData
      this.dialogData = dialogData
    },
    editItemClick(sope) {
      const tbFormat = JSON.parse(JSON.stringify(this.tableFormat))
      if (sope.row.role === 'admin') {
        delete tbFormat['role']
      }
      tbFormat.username.edit = 4
      const dialogData = {}
      dialogData.dialogName = '編輯'
      dialogData.tableFormat = { ...tbFormat }
      dialogData.dialogFormVisible = true
      dialogData.temp = { ...sope.row }
      dialogData.rules = this.rules
      dialogData.submitEvent = this.updateData
      this.dialogData = dialogData
    },
    // 新增資料
    newData(paras) {
      newUser(paras)
        .then(() => {
          // 重新取得清單
          this.getList()
          this.dialogData.dialogFormVisible = false
          this.$notify({ title: '成功', message: '資料新增成功', type: 'success', duration: 2000 })
        })
        .catch(() => {
          this.$notify({ title: '失敗', message: '資料新增失敗', type: 'error', duration: 2000 })
        })
    },
    // 更新資料
    updateData(paras) {
      new Promise((resolve, reject) => {
        const updateParas = {...paras}
        updateUser(updateParas)
        .then(() => {
          // 重新取得清單
          this.getList()
          this.dialogData.dialogFormVisible = false
          resolve(resolve, reject)
        })
      }).then((resolve, reject)=>{
        // 薪水更新
        const salaryParas = {}
        salaryParas.user_id = paras.user_id
        salaryParas.status = paras.salaryStatus
        salaryParas.salary = paras.salary
        patchUserSalary(salaryParas).then(() => {
          resolve()
        })  
      }).then(()=>{
        this.$notify({ title: '成功', message: '資料更新成功', type: 'success', duration: 2000 })
      }).catch(error=>{
        this.$notify({ title: '失敗', message: '資料更新失敗', type: 'error', duration: 2000 })
        console.log('err',error)
      })      
    }
  }
}
</script>

<style>
  .el-icon-error{
    color: rgb(231, 0, 0);
    font-size: 20px;
  }
</style>

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
