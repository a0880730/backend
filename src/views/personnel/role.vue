<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新增角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="角色標籤" width="220">
        <template slot-scope="scope">
          {{ scope.row.role_tag }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名稱" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="備註">
        <template slot-scope="scope">
          {{ scope.row.notes }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.role_tag !== 'admin'" type="primary" size="small" @click="handleEdit(scope)">編輯</el-button>
          <el-button v-if="scope.row.role_tag !== 'admin'" type="danger" size="small" @click="handleDelete(scope)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'編輯權限':'新增權限'" :close-on-click-modal="false">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色標籤">
          <el-input v-if="dialogType==='new'" v-model="role.role_tag" placeholder="角色標籤" />
          <label v-if="dialogType==='edit'">{{ role.role_tag }}</label>
        </el-form-item>
        <el-form-item label="角色名稱">
          <el-input v-model="role.name" placeholder="角色名稱" />
        </el-form-item>
        <el-form-item label="備註">
          <el-input
            v-model="role.notes"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="權限清單">
          <el-tree
            ref="tree"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="name"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">送出</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { mapState, mapGetters } from 'vuex'

import { getPermission, addPermission, updatePermission, deletePermission } from '@/api/role'
import { getRole, addRole, updateRole, deleteRole } from '@/api/role'

export default {
  name: 'Role',
  data() {
    return {
      role: {},
      routes: [],
      rolesList: [],
      permissionList: [],
      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    ...mapState({
      PermissionData: state => state.user.PermissionData
      // PermissionDataRules: state => state.user.PermissionDataRules
    }),
    ...mapGetters([
      'defaultData',
      'async_routes'
    ]),
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.routes = this.getRoutes(this.async_routes)
    this.getPermission()
  },
  methods: {
    getRoutes(asyncRoutes) {
      const res = []
      for (const i in asyncRoutes) {
        const item = { ...asyncRoutes[i] }
        if (item.meta != null)item.title = item.meta.title
        if (typeof item.children !== 'undefined') {
          item.children = this.getRoutes(item.children)
        }
        if (item.title != null) res.push(item)
      }
      return res
    },
    // 取得權限群組
    async getPermission() {
      const res = await getPermission()
      this.permissionList = {}
      for (const item of res.data) {
        this.permissionList[item.permission_tag] = item
      }
      this.getRole()
    },
    // 取得角色群組
    async getRole() {
      const res = await getRole()
      // 排除admin最高權限的帳戶
      // this.rolesList = res.data.filter(item => {
      //   if (item.role_tag === 'admin') return false
      //   return true
      // })
      this.rolesList = [...res.data]
      for (const role of this.rolesList) {
        role.permission = []
        for (const permissionTag of role.allow_permissions) {
          role.permission.push(this.permissionList[permissionTag])
        }
      }
    },
    handleAddRole() {
      this.role = this.defaultData(this.PermissionData)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const rolePermission = []
        for (const permissionItem of this.role.permission) {
          permissionItem.allow_path.map((item) => {
            rolePermission.push({ 'name': item })
          })
        }
        this.$refs.tree.setCheckedNodes(rolePermission)
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('確定要刪除?', 'Warning', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row).then(async response => {
            // 刪除角色成功
            if (response.code === 200) {
              if (typeof row.permission === 'object') {
                row.permission.map(async(item) => {
                  // 刪除權限群組
                  await deletePermission(item).then(res => {
                    if (res.code === 200) {
                      this.$notify({ title: '成功', message: '角色權限已刪除', type: 'success', duration: 2000 })
                    } else {
                      if (typeof res.message !== 'undefined') {
                        this.$notify({ title: '失敗', message: res.message, type: 'error', duration: 2000 })
                      } else {
                        this.$notify({ title: '失敗', message: '刪除失敗(' + res.code + ')', type: 'error', duration: 2000 })
                      }
                    }
                  })
                })
              }
            } else {
              if (typeof response.message !== 'undefined') {
                this.$notify({ title: '失敗', message: response.message, type: 'error', duration: 2000 })
              } else {
                this.$notify({ title: '失敗', message: '刪除失敗(' + response.code + ')', type: 'error', duration: 2000 })
              }
            }
          })
          this.getPermission()
        })
        .catch(err => { console.error(err) })
    },
    async confirmRole() {
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      const routes = []
      for (const i in checkedNodes) {
        routes.push(checkedNodes[i].name)
      }
      if (this.dialogType === 'edit') {
        const paras = {
          permission_id: this.role.permission[0].permission_id,
          name: this.role.name,
          allow_method: ['GET'],
          allow_path: routes,
          notes: ''
        }
        updatePermission(paras).then((response) => {
          this.dialogVisible = false
          if (response.code === 200) {
            const _this = this
            setTimeout(function() {
              _this.addRole()
            }, 50)
          }
        })
      } else {
        const paras = {
          permission_tag: this.role.role_tag,
          name: this.role.name,
          allow_method: ['GET'],
          allow_path: routes,
          notes: ''
        }
        addPermission(paras).then((response) => {
          this.dialogVisible = false
          if (response.code === 201) {
            const _this = this
            setTimeout(function() {
              _this.addRole()
            }, 50)
          }
        })
      }
    },
    addRole() {
      if (this.dialogType === 'edit') {
        const paras = {
          name: this.role.name,
          role_id: this.role.role_id,
          allow_permissions: [this.role.role_tag],
          notes: this.role.notes
        }
        updateRole(paras).then((response) => {
          this.getPermission()
          this.$notify({ title: '成功', message: '資料修改成功', type: 'success', duration: 2000 })
          this.dialogVisible = false
        })
      } else {
        const paras = {
          name: this.role.name,
          role_tag: this.role.role_tag,
          allow_permissions: [this.role.role_tag],
          notes: this.role.notes
        }
        addRole(paras).then((response) => {
          this.getPermission()
          this.$notify({ title: '成功', message: '資料新增成功', type: 'success', duration: 2000 })
          this.dialogVisible = false
        })
      }
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
