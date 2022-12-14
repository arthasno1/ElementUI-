<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="editRoleVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="roleList" border stripe>
        <!-- 箭头展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :class="['btBottom', i1 === 0 ? 'btTop' : '', 'rowLeft', 'vcenter']" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <!-- 右箭头 -->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限，三级权限 -->
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '' : 'btTop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag closable @close="removeRightById(scope.row, item2.id)" type="success">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag closable @close="removeRightById(scope.row, item3.id)" v-for="item3 in item2.children" :key="item3.id" type="warning">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">搜索</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)"> 分配权限 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="提示" :visible.sync="editRoleVisible" width="40%">
      <!-- 添加角色，主体区 -->
      <el-form :model="editRole" :rules="editRoleRules" ref="editRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName" label-width="15%">
          <el-input v-model="editRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="15%">
          <el-input v-model="editRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加角色，底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editRoleVisible = false">确定</el-button>
        <el-button @click="editRoleVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="SetRightDialogVisible" width="50%" @close="setRightEditClose">
      <!-- 树结构 -->
      <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="allotRight">确定</el-button>
        <el-button @click="SetRightDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Role',
  data() {
    return {
      // 定义角色列表
      roleList: [],
      // 添加角色开关
      editRoleVisible: false,
      // 添加角色列表
      editRole: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色规则
      editRoleRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3-10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '角色描述长度在6-15个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 分配权限窗口开关
      SetRightDialogVisible: false,
      // 分配权限数据
      rightList: [],
      // 树解构数据
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中节点ID值数组
      defKeys: [],
      // 角色id
      roleId: {}
    }
  },
  created() {
    // 获取角色列表
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((error) => error)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) this.$message.error('获取删除角色权限失败')
      role.children = res.data
      // this.getRoleList()
      this.$message.success('删除成功')
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      this.roleRow = role
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限数据获取失败')
      }
      this.rightList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.SetRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 关闭分配权限，清空选中id
    setRightEditClose() {
      this.defKeys = []
    },
    // 分配权限 确定按钮
    async allotRight() {
      this.SetRightDialogVisible = true
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('获取角色授权失败')
      this.$message.success(res.meta.msg)
      this.getRoleList()
      this.SetRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.rowLeft {
  margin-left: 48px !important;
}
.el-tag {
  margin: 7px;
}
.btTop {
  border-top: 1px solid #eee;
}
.btBottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
