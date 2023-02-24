<template>
  <el-table :data="list" style="width: 100%" height="100%">
    <!-- <el-table-column label="#" min-width="5%" align="center">
      <template slot-scope="scope">
        {{ scope.$index + 1 }}
      </template>
    </el-table-column> -->
    <el-table-column label="類型" min-width="20%" align="center">
      <template slot-scope="scope">
        <template v-if="scope.row.assign_for === ''">{{ '場勘' }}</template>
        <template v-else>{{ '施工' }}</template>
      </template>
    </el-table-column>
    <el-table-column label="填表時間" min-width="20%" align="center">
      <template slot-scope="scope">
        {{ scope.row.created_at | dateFormat }}
      </template>
    </el-table-column>
    <el-table-column label="創建人" min-width="10%" align="center">
      <template slot-scope="scope">
        {{ getUserInfo(scope.row.applicant).username }}
      </template>
    </el-table-column>
    <el-table-column label="填表人" min-width="10%" align="center">
      <template slot-scope="scope">
        {{ getUserInfo(scope.row.assign_for).username }}
      </template>
    </el-table-column>
    <el-table-column label="狀態" min-width="10%" align="center">
      <template slot-scope="scope">
        <el-link v-if="scope.row.status == 1" type="danger" @click="showQrcodeInfo(scope)">尚未填表</el-link>
        <el-link v-else-if="scope.row.status == 2" type="primary" @click="toBrickInfo(scope)">等待審核</el-link>
        <el-tag v-else-if="scope.row.status == 3" type="success">已審核</el-tag>
        <el-tag v-else-if="scope.row.status == 4" type="primary">已計薪</el-tag>
        <span v-else>{{ statusArray[scope.row.status] }}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column label="總計(M²)" min-width="10%" align="center">
      <template slot-scope="scope">
        {{ scope.row.total }}
      </template>
    </el-table-column> -->
    <el-table-column label="操作" min-width="20%" align="center">
      <template slot-scope="scope">
        <el-button circle @click="toBrickInfo(scope)">
          <svg-icon icon-class="eye-open" />
        </el-button>
        <el-button v-if="scope.row.assign_for !== ''" circle @click="showQrcodeInfo(scope)">
          <svg-icon icon-class="qrcode" />
        </el-button>
        <el-button type="danger" icon="el-icon-delete" circle @click="deleteBrick(scope)" />
        <!--QRcode彈窗-->
        <el-dialog
          title="手機掃描填表"
          :visible.sync="qrDialogVisible"
          width="30%"
        >
          施工人員：{{ keyinUser }}
          <qrcode-vue :value="qrcodeUrl" :size="`300`" level="H" />
          <el-button :data-clipboard-text="qrcodeUrl" @click.prevent="copycode" class="btn-copy" type="success" >複製網址</el-button>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="qrDialogVisible=false">關閉</el-button>
          </span>
        </el-dialog>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getBrick } from '@/api/caseField'
import { mapGetters } from 'vuex'
import QrcodeVue from 'qrcode.vue'
import Clipboard from "clipboard";

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
  components: {
    QrcodeVue
  },
  props: {
    caseId: {
      type: String,
      default() {
        return ''
      }
    },
    brickCount: {
      type: Number,
      default() {
        return 0
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
      list: null,
      qrDialogVisible: false,
      qrcodeUrl: '',
      keyinUser: '',
      statusArray: {
        0: '-',
        1: '未填寫',
        2: '已填寫，等待審核',
        3: '已審核'
      }
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
  mounted() {
  },
  methods: {
    fetchData() {
      var paras = {}
      paras.case_id = this.caseId
      getBrick(paras).then(response => {
        this.list = response.data
        // 總數
        if (this.list != null) {
          this.$emit('update:brickCount', this.list.length)
        }
      })
    },
    toBrickInfo(scope) {
      this.$router.replace('/caseField/brick/' + scope.row.brick_id + '?caseId=' + this.caseId)
    },
    showQrcodeInfo(scope) {
      this.qrDialogVisible = true
      this.qrcodeUrl = process.env.VUE_APP_QRCODE_URL + `qrbrick/${scope.row.brick_id}?caseId=${this.caseId}`
      this.keyinUser = this.getUserInfo(scope.row.assign_for).username


      // var copyId = document.getElementsByClassName("btn-copy");
      // var clipboard = new Clipboard(copyId);
      // console.log(clipboard)
      // clipboard.on("success", function () {
      //   console.log("123456")
      //     // store.commit("PUT_SYSTEM_MODAL", 'FRIEND_COPY_SUCCESS'); // 系統訊息提示
      //     clipboard.destroy();
      // });
      // clipboard.on("error", function () {
      //   console.log("999")
      //     // store.commit("PUT_SYSTEM_MODAL", 'COPY_ERROR'); // 系統訊息提示
      // });
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
    },
    copycode() {
      var _this = this;
      var clipboard = new Clipboard(".btn-copy"); //单页面引用
      clipboard.on("success", e => {
        clipboard.destroy();
        _this.$notify({
          title: '成功',
          message: '成功複製連結！',
          type: 'success',
          duration: 2000
        });
      });

      clipboard.on("error", e => {
        clipboard.destroy();
        _this.$notify({
          title: '失敗',
          message: '複製連結失敗！',
          type: 'danger',
          duration: 2000
        });
      });
    }
  }
}
</script>
