<template>
    <el-dialog :visible.sync="visible" :title="!pageId ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
            <el-form-item prop="username" label="账号：">
                <el-input v-model="dataForm.username" placeholder="请输入账号" :disabled="!pageId ? false : true" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item prop="realName" label="姓名：">
                <el-input v-model="dataForm.realName" placeholder="请输入姓名" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item prop="mobile" label="手机号：">
                <el-input v-model="dataForm.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码：" :class="{ 'is-required': !pageId }">
                <el-input v-model="dataForm.password" show-password placeholder="请输入6-12位的密码" minlength="6" maxlength="12"></el-input>
            </el-form-item>
            <el-form-item prop="confirmPasswd" label="确认密码：" :class="{ 'is-required': !pageId }">
                <el-input v-model="dataForm.confirmPasswd" show-password placeholder="请确认密码" minlength="6" maxlength="12"></el-input>
            </el-form-item>
            <el-form-item
                    :label="'角色' + (index+1) + '：'"
                    v-for="(roleItem, index) in dataForm.roleIds"
                    :key="roleItem.key"
                    :prop="'roleIds.' + index + '.value'"
                    :rules="{
      required: true, message: '必填项不能为空', trigger: 'change'
    }"
            >
                <el-select v-model="roleItem.value" :placeholder="$t('user.roleIdList')" class="distance-btn">
                    <el-option
                            v-for="item in roleList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-button v-if="index>0" type="text" @click.prevent="removeRoleItem(roleItem)">删除</el-button>
                <el-button type="text" @click="addRoleItem">添加</el-button>
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
                pageId:null,// 有值的话代表是编辑
                roleList: [],
                // roleIdListDefault: [],
                dataForm: {
                    roleIds: [{
                        value: '',
                        key: Date.now()
                    }],
                    id: '',
                    username: '',
                    deptId: '0',
                    deptName: '',
                    password: '',
                    confirmPasswd: '',
                    realName: '',
                    gender: 0,
                    email: '',
                    mobile: '',
                    status: 1
                }
            }
        },
        computed: {
            dataRule () {
                var validateUsername = (rule, value, callback) => {
                    if (!/\S/.test(value)) {
                        return callback(new Error(this.$t('validate.required')))
                    }
                    if (!/^[a-zA-Z0-9]{0,20}$/.test(value)) {
                        return callback(new Error('仅可输入英文、数字，最大可输入20个字符'))
                    }
                    callback()
                }
                var validateRealName = (rule, value, callback) => {
                    if (!/\S/.test(value)) {
                        return callback(new Error(this.$t('validate.required')))
                    }
                    callback()
                }
                // 密码校验
                var validatePassword = (rule, value, callback) => {
                    if (!this.pageId && !/\S/.test(value)) {
                        return callback(new Error(this.$t('validate.required')))
                    }
                    if (!this.pageId && !/^[a-zA-Z0-9]{6,12}$/.test(value)) {
                        return callback(new Error('仅可输入英文数字，至少6位字符，至多12位字符'))
                    }
                    callback()
                }
                var validateComfirmPassword = (rule, value, callback) => {
                    if (!this.pageId && !/\S/.test(value)) {
                        return callback(new Error(this.$t('validate.required')))
                    }
                    if (!this.pageId && !/^[a-zA-Z0-9]{6,12}$/.test(value)) {
                        return callback(new Error('仅可输入英文数字，至少6位字符，至多12位字符'))
                    }
                    if (this.dataForm.password !== value) {
                        return callback(new Error(this.$t('user.validate.comfirmPassword')))
                    }
                    callback()

                }
                var validateRoleId = (rule, value, callback) => {
                    if (!/\S/.test(value)) {
                        return callback(new Error(this.$t('validate.required')))
                    }
                    callback()
                }
                // 手机验证 去空格，控制位数
                var validateMobile = (rule, value, callback) => {
                    if (!/\S/.test(value)) {
                        return callback(new Error(this.$t('validate.required')))
                    }
                    if (!this.pageId) {
                        value=value.replace(/\s*/g, '')
                        if(!/^1[3-9][0-9]{9}$/.test(value))
                        {
                            return callback(new Error(this.$t('validate.format', { 'attr': this.$t('user.mobile') })))
                        }
                    }
                    callback()
                }
                return {
                    username: [
                        { required: true, validator: validateUsername, trigger: 'blur' }
                    ],
                    realName: [
                        { required: true, validator: validateRealName, trigger: 'blur' }
                    ],
                    password: [
                        { required: true, validator: validatePassword, trigger: 'blur' }
                    ],
                    confirmPasswd: [
                        { required: true, validator: validateComfirmPassword, trigger: 'blur' }
                    ],
                    roleIds: [
                        { required: true, validator: validateRoleId, trigger: 'change' }
                    ],
                    mobile: [
                        { required: true, validator: validateMobile, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            // 删除角色
            removeRoleItem(roleItem) {
                var index = this.dataForm.roleIds.indexOf(roleItem)
                if (index > 0) {
                    this.dataForm.roleIds.splice(index, 1)
                }
            },
            // 新增角色
            addRoleItem() {
                debugger
                this.dataForm.roleIds.push({
                    value: '',
                    key: Date.now()
                });
            },
            init (id) {
                console.log('有id代表编辑，无id代表新增',id)
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    // this.dataForm.roleIds=[{
                    //     value: '',
                    //     key: Date.now()
                    // }]
                    if(id){
                        this.pageId = id;
                        this.getInfo(id);
                    }else{
                        this.pageId = '';
                    }
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
                    debugger
                    if (res.code !== 200) {
                        return this.$message.error(res.msg)
                    }
                    this.roleList = res.data
                }).catch(() => {})
            },
            // 获取信息 反填
            getInfo (id) {
                this.$http.get(`/admin-api/user/${id}`).then(({ data: res }) => {
                    debugger
                    for(var i=0;i<res.data.roleNames.length;i++){
                        res.data.roleIds[i].push(res.data.roleNames[i])
                    }
                    console.log(res.data.roleIds)
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
                    var roleData=[]
                    for(var i=0;i<this.dataForm.roleIds.length;i++){
                        debugger
                        roleData.push(this.dataForm.roleIds[i].value)
                    }
                    this.dataForm.roleIds = roleData
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
                    this.dataForm.roleIds=[{
                        value: '',
                        key: Date.now()
                    }]
                })
            }, 1000, { 'leading': true, 'trailing': false })
        }
    }
</script>

<style lang="scss">
    .distance-btn{
        margin-right: 15px;
    }
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
