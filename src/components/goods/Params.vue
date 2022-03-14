<template>
    <!-- 顶部面包屑 -->
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片式图区 -->
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <!-- 警告框 -->
            <el-alert
                title="注意：只允许为第三级分类设置相关参数"
                type="warning"
                :closable="false"
                show-icon=""
            ></el-alert>
            <!-- 商品分类区 -->
            <el-row class="opt_cat">
                <el-col>
                    <span>商品分类</span>
                    <el-cascader
                        v-model="selectCateKeys"
                        :options="cateList"
                        :props="cateProps"
                        @change="handleChange"
                    ></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数按钮 -->
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="isBtnDisable"
                        @click="addDialogVisible = true"
                    >
                        添加参数
                    </el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag
                                    v-for="(item, i) in scope.row.attr_vals"
                                    :key="i"
                                    closable
                                    @close="handleClose(i, scope.row)"
                                >
                                    {{ item }}
                                </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                ></el-input>
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                >
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <div>
                                    <el-button
                                        type="primary"
                                        icon="el-icon-edit"
                                        size="mini"
                                        @click="showEditDialog(scope.row.attr_id)"
                                    >
                                        修改
                                    </el-button>
                                    <el-button
                                        type="danger"
                                        icon="el-icon-search"
                                        size="mini"
                                        @click="removeParams(scope.row.attr_id)"
                                    >
                                        删除
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性按钮 -->
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="isBtnDisable"
                        @click="addDialogVisible = true"
                    >
                        添加属性
                    </el-button>
                    <!-- 静态参数表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <el-table-column type="expand">
                            <el-table-column type="expand">
                                <template slot-scope="scope">
                                    <el-tag
                                        v-for="(item, i) in scope.row.attr_vals"
                                        :key="i"
                                        closable
                                        @close="handleClose(i, scope.row)"
                                    >
                                        {{ item }}
                                    </el-tag>
                                    <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                    ></el-input>
                                    <el-button
                                        v-else
                                        class="button-new-tag"
                                        size="small"
                                        @click="showInput(scope.row)"
                                    >
                                        + New Tag
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <div>
                                    <el-button
                                        type="primary"
                                        icon="el-icon-edit"
                                        size="mini"
                                        @click="showEditDialog(scope.row.attr_id)"
                                    >
                                        修改
                                    </el-button>
                                    <el-button
                                        type="danger"
                                        icon="el-icon-search"
                                        size="mini"
                                        @click="removeParams(scope.row.attr_id)"
                                    >
                                        删除
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数对话框 -->
        <el-dialog
            :title="`添加${this.titleText}`"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed"
        >
            <el-form :model="addForm" :rules="addFormRules" ref="ruleFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改参数对话框 -->
        <el-dialog
            :title="`修改${this.titleText}`"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed"
        >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script>
export default {
    name: 'Params',

    data() {
        return {
            // 商品分类列表
            cateList: [],
            // cascader相关数据
            cateProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                expandTrigger: 'hover',
            },
            selectCateKeys: [],
            // tabs相关数据
            activeName: 'many',
            //动态数据
            manyTableData: [],
            // 静态数据
            onlyTableData: [],
            // 添加参数弹窗控制
            addDialogVisible: false,
            // 添加表单数据
            addForm: {
                attr_name: '',
            },
            // 添加表单验证
            addFormRules: {
                attr_name: [
                    {
                        required: true,
                        message: '请输入参数名称',
                        trigger: 'blur',
                    },
                ],
            },
            // 修改弹窗开关
            editDialogVisible: false,
            editForm: {},
            editFormRules: {
                attr_name: [
                    {
                        required: true,
                        message: '请输入参数名称',
                        trigger: 'blur',
                    },
                ],
            },
        }
    },

    created() {
        this.getCateList()
    },

    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
            this.cateList = res.data
        },
        // 选择框发生变化触发
        handleChange() {
            this.getParamsData()
        },
        // tabs相关事件
        handleTabClick() {
            this.getParamsData()
        },
        async getParamsData() {
            if (this.selectCateKeys.length !== 3) {
                this.selectCateKeys = []
                this.manyTableData = []
                this.onlyTableData = []
            } else {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: { sel: this.activeName },
                })
                if (res.meta.status !== 200) return this.$message.error('获取分类参数失败')
                res.data.forEach((item) => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                    item.inputVisible = false
                    item.inputValue = ''
                })
                if (this.activeName === 'many') {
                    this.manyTableData = res.data
                    console.log(this.manyTableData)
                } else {
                    this.onlyTableData = res.data
                    console.log(this.onlyTableData)
                }
            }
        },
        // 关闭添加参数弹窗触发
        addDialogClosed() {
            // this.$refs.ruleFormRef.resetFields()
        },
        // 添加参数
        addParams() {
            this.$refs.ruleFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.post(
                    `categories/${this.cateId}/attributes`,
                    {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName,
                    },
                )

                if (res.meta.status !== 201) {
                    return this.$message.error('获取属性列表失败')
                }
                this.$message.success('添加参数成功！')
                this.addDialogVisible = false
                this.getParamsData()
            })
        },
        // 点击修改弹出对话框
        async showEditDialog(attr_id) {
            const { data: res } = await this.$http.get(
                `categories/${this.cateId}/attributes/${attr_id}`,
                {
                    params: { attr_sel: this.activeName },
                },
            )
            if (res.meta.status !== 200) return this.$message.error('获取修改数据失败')
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 修改弹窗关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 点击按钮修改参数信息
        editParams() {
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.put(
                    `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                    {
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.activeName,
                    },
                )
                if (res.meta.status !== 200) return this.$message.error('获取参数失败')
                this.$message.success('修改成功')
                this.getParamsData()
                this.editDialogVisible = false
            })
        },
        async removeParams(attr_id) {
            const confirmResult = await this.$confirm('此操作将永久这条数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).catch((error) => {
                return error
            })
            if (confirmResult === 'confirm') {
                const { data: res } = await this.$http.delete(
                    `categories/${this.cateId}/attributes/${attr_id}`,
                )
                if (res.meta.status !== 200)
                    return this.$message.error('删除数据失败，获取数据失败')
                this.getParamsData()
            } else {
                return this.$message.info('已取消删除')
            }
        },
        async handleInputConfirm(row) {
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            this.saveActiveVals(row)
        },
        async saveActiveVals(row) {
            const { data: res } = await this.$http.put(
                `categories/${this.cateId}/attributes/${row.attr_id}`,
                {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(' '),
                },
            )
            if (res.meta.status !== 200) {
                return this.$message.error('编辑参数列表获取失败')
            }
            this.$message.success('修改参数成功')
        },
        handleClose(i, row) {
            console.log(row)
            row.attr_vals.splice(i, 1)
            this.saveActiveVals(row)
        },
        showInput(row) {
            row.inputVisible = true
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
    },

    computed: {
        // 添加XX按钮是否禁用
        isBtnDisable() {
            if (this.selectCateKeys.length !== 3) {
                return true
            } else {
                return false
            }
        },
        // 当前选中的三级ID
        cateId() {
            if (this.selectCateKeys.length === 3) return this.selectCateKeys[2]
            return null
        },
        // 添加参数弹窗的title显示静态参数或者静态属性
        titleText() {
            if (this.activeName == `many`) {
                return '动态参数'
            } else {
                return '静态属性'
            }
        },
    },
}
</script>



<style lang="less" scoped>
.opt_cat {
    margin: 15px 0px;
    span {
        margin-right: 10px;
    }
}
.el-tag {
    margin-right: 20px;
    margin-left: 20px;
}
.input-new-tag {
    width: 200px;
}
</style>
