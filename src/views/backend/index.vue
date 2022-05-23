<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="postInfo-container">
          <el-form ref="companyInfo" :model="companyInfo" class="form-container">
            <el-row>
              <el-col :lg="12" :sm="24">
                <el-row>
                  <h2>公司基本資料</h2>
                  <el-col :lg="24" :sm="24">
                    <el-form-item prop="title">
                      <MDinput v-model="companyInfo.company_name" :maxlength="100" name="name" required>
                        公司名稱
                      </MDinput>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="24" :sm="24">
                    <el-form-item prop="title">
                      <MDinput v-model="companyInfo.person_in_charge" :maxlength="100" name="name" required>
                        負責人
                      </MDinput>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="24" :sm="24">
                    <el-form-item prop="title">
                      <MDinput v-model="companyInfo.contact_person" :maxlength="100" name="name" required>
                        聯絡人
                      </MDinput>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="24" :sm="24">
                    <el-form-item prop="title">
                      <MDinput v-model="companyInfo.phone_number" :maxlength="100" name="name" required>
                        電話
                      </MDinput>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="24" :sm="24">
                    <el-form-item prop="title">
                      <MDinput v-model="companyInfo.fax" :maxlength="100" name="name" required>
                        傳真
                      </MDinput>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="24" :sm="24">
                    <el-form-item prop="title">
                      <MDinput v-model="companyInfo.tax_id_number" :maxlength="100" name="name" required>
                        統一編號
                      </MDinput>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="24" :sm="24">
                    <el-form-item prop="title">
                      <MDinput v-model="companyInfo.address" :maxlength="100" name="name" required>
                        地址
                      </MDinput>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="24" :sm="24">
                    <el-form-item prop="title">
                      <MDinput v-model="companyInfo.email" :maxlength="100" name="name" required>
                        信箱
                      </MDinput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :lg="24" style="text-align:center">
                    <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="updateBtn()">更新資料</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getCompanyInfo } from '@/api/company'
import { mapState, mapGetters } from 'vuex'
import MDinput from '@/components/MDinput'

export default {
  name: 'BackendSet',
  components: { MDinput },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      companyInfo: {}
    }
  },
  computed: {
    ...mapState({
      CompanyData: state => state.company.companyData,
      rules: state => state.company.rules
    }),
    ...mapGetters([
      'defaultData'
    ])
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.listLoading = true
      getCompanyInfo(this.listQuery).then(response => {
        this.companyInfo = response.data
        this.listLoading = false
      })
    },
    updateBtn() {
      this.$store.dispatch('company/updateData', this.companyInfo)
        .then(() => {
          // 重新取得清單
          this.getInfo()
          this.$notify({ title: '成功', message: '資料更新成功', type: 'success', duration: 2000 })
        })
        .catch(() => {
          this.$notify({ title: '失敗', message: '資料更新失敗', type: 'error', duration: 2000 })
        })
    }
  }
}
</script>

<style scoped>
.postInfo-container{
  margin-left: 30px;
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.el-input--medium{
  font-size: 14px;
}
</style>
