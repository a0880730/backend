<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddPermission">新增權限</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="群組標籤" width="220">
        <template slot-scope="scope">
          {{ scope.row.permission_tag }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名稱" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="權限" width="220">
        <template slot-scope="scope">
          {{ scope.row.allow_path }}
        </template>
      </el-table-column> -->
      <el-table-column align="header-center" label="備註">
        <template slot-scope="scope">
          {{ scope.row.notes }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">編輯</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'編輯權限':'新增權限'" :close-on-click-modal="false">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="權限標籤">
          <el-input v-model="role.permission_tag" placeholder="" />
        </el-form-item>
        <el-form-item label="權限名稱">
          <el-input v-model="role.name" placeholder="Role Name" />
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
import { getRole } from '@/api/role'

export default {
  name: 'Role',
  data() {
    return {
      role: {},
      routes: [],
      rolesList: [],
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
    this.getRole()
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
    async getRole() {
      const res = await getRole()
      this.rolesList = res.data
      console.log('getRole', res)
    },
    async getPermission() {
      const res = await getPermission()
      // this.rolesList = res.data
    },
    handleAddPermission() {
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
        const rolePermission = this.role.allow_path.map((item) => {
          return { 'name': item }
        })
        this.$refs.tree.setCheckedNodes(rolePermission)
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deletePermission(row)
          this.getPermission()
          // this.rolesList.splice($index, 1)
          // this.$message({
          //   type: 'success',
          //   message: 'Delete succed!'
          // })
        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      const routes = []
      for (const i in checkedNodes) {
        routes.push(checkedNodes[i].name)
      }
      this.role.allow_path = routes
      this.role.allow_method = ['GET']
      // this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (this.dialogType === 'edit') {
        delete this.role.permission_tag
        delete this.role.notes
        updatePermission(this.role).then((response) => {
          this.getPermission()
          this.dialogVisible = false
        })
      } else {
        addPermission(this.role).then((response) => {
          this.getPermission()
          this.dialogVisible = false
        })
      }

      // const { notes, key, name } = this.role
      // this.dialogVisible = false
      // this.$notify({
      //   title: 'Success',
      //   dangerouslyUseHTMLString: true,
      //   message: `
      //       <div>Role Key: ${key}</div>
      //       <div>Role Name: ${name}</div>
      //       <div>notes: ${notes}</div>
      //     `,
      //   type: 'success'
      // })
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
