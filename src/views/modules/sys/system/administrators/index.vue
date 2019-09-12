<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <div class="mod-sys__user">
            <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getData()">
                <el-form-item label="账号：">
                    <el-input v-model="dataForm.username" placeholder="请输入账号" clearable></el-input>
                </el-form-item>
                <el-form-item label="角色：">
                    <el-select v-model="dataForm.roleId" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getData()" type="primary">搜索</el-button>
                    <el-button  @click="reset()">重置</el-button>
                    <el-button v-if="$hasPermission('sys:user:save')" type="primary" @click="addOrUpdateHandle()">添加管理员</el-button>
                </el-form-item>
            </el-form>
<!--            <el-form>-->
<!--                <el-form-item>-->
<!--                    <el-button v-if="$hasPermission('sys:user:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>-->
<!--                    <el-button v-if="$hasPermission('sys:user:delete')" type="danger" plain @click="deleteHandle()">批量{{ $t('deleteBatch') }}</el-button>-->
<!--                    <el-button v-if="$hasPermission('sys:user:export')" type="primary" plain @click="exportHandle()">{{ $t('export') }}</el-button>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
            <el-table
                    v-loading="dataListLoading"
                    :data="dataList"
                    border
                    @selection-change="dataListSelectionChangeHandle"
                    @sort-change="dataListSortChangeHandle"
                    style="width: 100%;">
                <el-table-column
                        type="index"
                        prop="$index"
                        label="序号"
                        align="center"
                        width="70">
                    <template slot-scope="scope">
                        {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="账号" header-align="center" align="center" width="130px"></el-table-column>
                <el-table-column prop="realName" label="姓名" header-align="center" align="center" width="130px"></el-table-column>
                <el-table-column prop="roleName" label="角色" header-align="center" align="center">
                    <template slot-scope="scope">
                            <template v-for="item in scope.row.roleName">{{item+'  '}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号" header-align="center" align="center"></el-table-column>
                <el-table-column prop="createDate" label="创建时间" header-align="center" align="center">
                </el-table-column>
                <el-table-column :label="$t('handle')" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="$hasPermission('sys:user:update')" type="text" size="small" @click="changeNumber(scope.row)">重置密码</el-button>
                        <el-button v-if="$hasPermission('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
                        <el-button v-if="$hasPermission('sys:user:delete') && scope.row.superAdmin!==1" type="text" class="artdanger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    :current-page="page"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="limit"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="pageSizeChangeHandle"
                    @current-change="pageCurrentChangeHandle">
            </el-pagination>
            <!-- 弹窗, 新增 / 修改 -->
            <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
            <!-- 修改密码 -->
            <el-dialog
                    title="修改密码"
                    :visible.sync="centerDialogVisible"
                    :close-on-click-modal = "false"
                    :show-close = "true"
                    class="storedialog"
                    width="30%">
                <el-form :model="numberDataForm" ref="numberDataForm" :rules="dataRule" @keyup.enter.native="numberSubmitHandle()" label-width="120px">
                    <el-form-item style="margin-left: -42px!important;">
                        <span>账号：</span><span>{{numberDataForm.username}}</span>
                    </el-form-item>
                    <el-form-item label="密码：" prop="password">
                        <el-input v-model="numberDataForm.password" type="password" placeholder="请输入6-12位的密码" minlength="6" maxlength="12"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码：" prop="newPassword">
                        <el-input v-model="numberDataForm.newPassword" type="password" placeholder="请确认密码" minlength="6" maxlength="12"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="noCheck">取 消</el-button>
                    <el-button type="primary" @click="numberSubmitHandle" :loading="buttonStatus">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import AddOrUpdate from './add-or-update'
    import Bread from "@/components/bread";

    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: '/admin-api/user/page',
                    getDataListIsPage: true,
                    deleteURL: '/admin-api/user',
                    deleteIsBatch: true,
                    exportURL: '/admin-api/user/export'
                },
                options: [],
                breaddata: ["系统管理", "管理员管理"],
                dataForm: {},
                addOrUpdateVisible: false,
                centerDialogVisible:false,
                buttonStatus:false,
                numberDataForm:{
                    username:'',
                    password: '',
                    newPassword: '',
                    id:''
                },
            }
        },
        components: {
            AddOrUpdate,
            Bread
        },
        created(){
            this.getRoleList()
        },
        computed: {
            dataRule () {
                // 验证是否输入为空
                var validatePassword = (rule, value, callback) => {
                    if (!/^[a-zA-Z0-9]{6,12}$/.test(value)) {
                        return callback(new Error('仅可输入英文数字，至少6位字符，至多12位字符'))
                    }
                    callback()
                }
                var validateComfirmPassword = (rule, value, callback) => {
                    if (this.numberDataForm.password !== value) {
                        return callback(new Error(this.$t('user.validate.comfirmPassword')))
                    }
                    if (!/^[a-zA-Z0-9]{6,12}$/.test(value)) {
                        return callback(new Error('仅可输入英文数字，至少6位字符，至多12位字符'))
                    }
                    callback()
                }
                return {
                    password: [
                        { required: false, validator: validatePassword, trigger: 'blur' }
                    ],
                    newPassword: [
                        { required: false, validator: validateComfirmPassword, trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            // 重置密码 获取账户名
            changeNumber(row){
                this.centerDialogVisible = true;
                this.$nextTick(()=> {
                    this.$refs['numberDataForm'].resetFields()
                })
                this.numberDataForm.id = row.id
                this.numberDataForm.username = row.username
            },
            getData(){
                this.page = 1;
                this.limit = 10;
                this.getDataList();
            },
            // 表单重置
            reset(){
                this.dataForm = {};
                this.getData();
            },
            // 重置密码 提交
            numberSubmitHandle(){
                this.$refs['numberDataForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.$http.put('/admin-api/user/reset/passwd', this.numberDataForm).then(({ data: res }) => {
                        if (res.code !== 200) {
                            return this.$message.error(res.msg)
                        }
                        this.$message({
                            message: this.$t('prompt.success'),
                            type: 'success',
                            duration: 500,
                            onClose: () => {
                                this.centerDialogVisible = false
                            }
                        })
                    })
                })
            },
            // 重置密码 取消
            noCheck(){
                this.centerDialogVisible = false
                this.$refs['numberDataForm'].resetFields();
            },
            // 获取角色列表
            getRoleList () {
                return this.$http.get('/admin-api/role/list').then(({ data: res }) => {
                    if (res.code !== 200) {
                        return this.$message.error(res.msg)
                    }
                    this.options = res.data
                }).catch(() => {})
            },
        }
    }
</script>
<style lang="scss" scoped>
    .grayLine{
        border-bottom: 0!important;
    }
</style>