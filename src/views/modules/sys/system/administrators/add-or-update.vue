<template>
    <el-dialog :visible.sync="visible" :title="!pageId ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
            <el-form-item prop="username" label="账号：">
                <el-input v-model="dataForm.username" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item prop="realName" label="姓名：">
                <el-input v-model="dataForm.realName" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item prop="mobile" label="手机号：">
                <el-input v-model="dataForm.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码：" :class="{ 'is-required': !pageId }">
                <el-input v-model="dataForm.password" type="password" placeholder="请输入6-12位的密码"></el-input>
            </el-form-item>
            <el-form-item prop="comfirmPassword" label="确认密码：" :class="{ 'is-required': !pageId }">
                <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="请确认密码"></el-input>
            </el-form-item>
            <el-form-item prop="roleId" label="角色：" class="role-list">
                <el-select v-model="dataForm.roleId" :placeholder="$t('user.roleIdList')">
                    <el-option
                            v-for="item in roleList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template slot="footer">
            <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
        </template>
    </el-dialog>
</template>

<script>
    import debounce from 'lodash/debounce'
    import { isEmail, isMobile } from '@/utils/validate'
    export default {
        data () {
            return {
                visible: false,
                deptList: [],
                deptListVisible: false,
                pageId:null,
                roleList: [],
                // roleIdListDefault: [],
                dataForm: {
                    id: '',
                    username: '',
                    deptId: '0',
                    deptName: '',
                    password: '',
                    comfirmPassword: '',
                    realName: '',
                    gender: 0,
                    email: '',
                    mobile: '',
                    roleId: '',
                    status: 1
                }
            }
        },
        computed: {
            dataRule () {
                var validatePassword = (rule, value, callback) => {
                    if (!this.pageId && !/\S/.test(value)) {
                        return callback(new Error(this.$t('validate.required')))
                    }
                    callback()
                }
                var validateComfirmPassword = (rule, value, callback) => {
                    if (!this.pageId && !/\S/.test(value)) {
                        return callback(new Error(this.$t('validate.required')))
                    }
                    if (this.dataForm.password !== value) {
                        return callback(new Error(this.$t('user.validate.comfirmPassword')))
                    }
                    callback()
                }
                var validateMobile = (rule, value, callback) => {
                    if (!isMobile(value)) {
                        return callback(new Error(this.$t('validate.format', { 'attr': this.$t('user.mobile') })))
                    }
                    callback()
                }
                return {
                    username: [
                        { required: true, message: "请输入账号", trigger: 'blur' }
                    ],
                    realName: [
                        { required: true, message: "请输入姓名", trigger: 'change' }
                    ],
                    password: [
                        { required: true, validator: validatePassword, trigger: 'blur' }
                    ],
                    comfirmPassword: [
                        { required: true, validator: validateComfirmPassword, trigger: 'blur' }
                    ],
                    roleId: [
                        { required: true, message: "请输入角色", trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: "请输入手机号", trigger: 'blur' },
                        { validator: validateMobile, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            init (id) {
                console.log('666666',id)
                this.visible = true;
                if(id){
                    this.pageId = id;
                    this.getInfo(id);
                }else{
                    this.pageId = '';
                }
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    // this.roleIdListDefault = []
                    this.getRoleList()
                })
            },
            // 获取部门列表
            getDeptList () {
                return this.$http.get('/admin-api/dept/list').then(({ data: res }) => {
                    if (res.code !== 200) {
                        return this.$message.error(res.msg)
                    }
                    this.deptList = res.data
                }).catch(() => {})
            },
            // 获取角色列表
            getRoleList () {
                return this.$http.get('/admin-api/role/list').then(({ data: res }) => {
                    if (res.code !== 200) {
                        return this.$message.error(res.msg)
                    }
                    this.roleList = res.data
                }).catch(() => {})
            },
            // 获取信息
            getInfo (id) {
                this.$http.get(`/admin-api/user/${id}`).then(({ data: res }) => {
                    if (res.code !== 200) {
                        return this.$message.error(res.msg)
                    }
                    this.dataForm = {
                        ...this.dataForm,
                        ...res.data
                    }
                    // this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId)
                    // 角色配置, 区分是否为默认角色
                    // for (var i = 0; i < res.data.roleIdList.length; i++) {
                    //   if (this.roleList.filter(item => item.id === res.data.roleIdList[i])[0]) {
                    //     this.dataForm.roleIdList.push(res.data.roleIdList[i])
                    //     continue
                    //   }
                    //   this.roleIdListDefault.push(res.data.roleIdList[i])
                    // }
                }).catch(() => {})
            },
            // 所属部门树, 选中
            deptListTreeCurrentChangeHandle (data, node) {
                this.dataForm.deptId = data.id
                this.dataForm.deptName = data.name
                this.deptListVisible = false
            },
            // 表单提交
            dataFormSubmitHandle: debounce(function () {
                this.$refs['dataForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.$http[!this.pageId ? 'post' : 'put']('/admin-api/user', {
                        ...this.dataForm
                    }).then(({ data: res }) => {
                        if (res.code !== 200) {
                            return this.$message.error(res.msg)
                        }
                        this.$message({
                            message: this.$t('prompt.success'),
                            type: 'success',
                            duration: 500,
                            onClose: () => {
                                this.visible = false
                                this.$emit('refreshDataList')
                            }
                        })
                    }).catch(() => {})
                })
            }, 1000, { 'leading': true, 'trailing': false })
        }
    }
</script>

<style lang="scss">
    .mod-sys__user {
        .dept-list {
            .el-input__inner,
            .el-input__suffix {
                cursor: pointer;
            }
        }
        .role-list {
            .el-select {
                width: 100%;
            }
        }
    }
</style>
