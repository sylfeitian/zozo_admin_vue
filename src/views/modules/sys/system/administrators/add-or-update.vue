<template>
    <el-dialog :visible.sync="visible" :title="(!pageId ? '添加' : '编辑')+'管理员'" :close-on-click-modal="false"
               :close-on-press-escape="false">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
                 label-width="120px">
            <el-form-item prop="username" label="账号：">
                <el-input v-model.trim="dataForm.username" placeholder="请输入账号" :disabled="!pageId ? false : true"
                          maxlength="20"></el-input>
            </el-form-item>
            <el-form-item prop="realName" label="姓名：">
                <el-input v-model.trim="dataForm.realName" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item prop="mobile" label="手机号：">
                <el-input v-model.trim="dataForm.mobile" placeholder="请输入手机号" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item v-if="!pageId" prop="password" label="密码：" :class="{ 'is-required': !pageId }">
                <el-input v-model.trim="dataForm.password" type="password" placeholder="请输入6-12位的密码" minlength="6"
                          maxlength="12"></el-input>
            </el-form-item>
            <el-form-item  v-if="!pageId" prop="confirmPasswd" label="确认密码：" :class="{ 'is-required': !pageId }">
                <el-input v-model.trim="dataForm.confirmPasswd" type="password" placeholder="请确认密码" minlength="6"
                          maxlength="12"></el-input>
            </el-form-item>
            <el-form-item
                    v-for="(roleItem, index) in dataForm.roleIds"
                    :label="index===0?'角色：':''"
                    :key="index"
                    :prop="index===0?'roleIds.0.id':''"
            >
                <el-select v-model="roleItem.id" :placeholder="dataForm.roleIds.id?'角色'+(index+1):'请选择'" class="distance-btn"
                           @change="selected">
                    <el-option
                            v-for="item in roleList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <template v-if="dataForm.roleIds.length<2">
                    <el-button type="text" @click="addRoleItem">添加</el-button>
                 </template>
                <template v-else>
                    <el-button v-if="index===0" type="text" @click.prevent="removeRoleItem">删除</el-button>
                    <el-button v-if="index>0" type="text" @click="addRoleItem">添加</el-button>
                 </template>
            </el-form-item>
        </el-form>
        <template slot="footer">
            <el-button @click="noCheck">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
        </template>
    </el-dialog>
</template>

<script>
    import debounce from 'lodash/debounce'
    import {isEmail, isMobile} from '@/utils/validate'
    import cloneDeep from 'lodash/cloneDeep'

    export default {
        data() {
            return {
                visible: false,
                // deptList: [],
                // deptListVisible: false,
                pageId: null,// 有值的话代表是编辑
                roleList: [],
                // roleIdListDefault: [],
                dataForm: {
                    roleIds: [{
                        id: ''
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
        watch: {
            'dataForm.realName': function (newV, oldV) {
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 20) { //输入字符大于20的时候过滤
                        this.dataForm.realName = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
            'dataForm.mobile':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    // 只能输入数字
                    if(!/[0-9]/g.test(newV[i])){
                        this.dataForm.mobile = newV.replace(newV[i],"")
                    }
                }
            }
        },
        computed: {
            dataRule() {
                // 账号
                var validateUsername = (rule, value, callback) => {
                    if (!/\S/.test(value)) {
                        return callback(new Error(this.$t('validate.required')))
                    }
                    if (!/^[a-zA-Z0-9]{0,20}$/.test(value)) {
                        return callback(new Error('仅可输入英文、数字，最大可输入20个字符'))
                    }
                    callback()
                }
                // 姓名
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
                // 角色
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
                    } else {
                        value = value.replace(/\s*/g, '')
                        if (!/^1[3-9][0-9]{9}$/.test(value)) {
                            return callback(new Error(this.$t('validate.format', {'attr': this.$t('user.mobile')})))
                        }
                    }
                    callback()
                }
                return {
                    username: [
                        {required: true, validator: validateUsername, trigger: 'blur'}
                    ],
                    realName: [
                        {required: true, validator: validateRealName, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, validator: validatePassword, trigger: 'blur'}
                    ],
                    confirmPasswd: [
                        {required: true, validator: validateComfirmPassword, trigger: 'blur'}
                    ],
                    'roleIds.0.id': [
                        {required: true, validator: validateRoleId, trigger: 'change'}
                    ],
                    mobile: [
                        {required: true, validator: validateMobile, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            // 筛选重复的角色
            selected(query) {
                    var selectItem = [];
                    for (let i = 0; i < this.dataForm.roleIds.length; i++) {
                        selectItem.push(this.dataForm.roleIds[i].id)
                    }
                    if (selectItem.indexOf(query) !== selectItem.lastIndexOf(query)) { // 所选角色重复
                        this.dataForm.roleIds[selectItem.lastIndexOf(query)].name = ''
                        this.dataForm.roleIds[selectItem.lastIndexOf(query)].id = ''
                        this.dataForm.roleIds[selectItem.lastIndexOf(query)].key = Date.now()
                        this.$message("该角色已经被选了,请选择其他角色")
                    }
            },
            // 弹窗关闭
            noCheck() {
                this.visible = false
                this.$refs['dataForm'].resetFields();
                this.dataForm.roleIds = [{
                    id: ''
                }]
            },
            // 删除角色
            removeRoleItem() {
                this.dataForm.roleIds.splice(this.dataForm.roleIds.length-1, 1)
            },
            // 新增角色
            addRoleItem() {
                this.dataForm.roleIds.push({
                    id: ''
                });
            },
            init(id) {
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    console.log(this.dataForm)
                    if (id) {
                        this.pageId = id;
                        this.getInfo(id);
                    } else {
                        this.pageId = "";
                        this.dataForm.password = "";
                        this.dataForm.confirmPasswd = "";
                    }
                    this.getRoleList()
                    this.dataForm.roleIds = [{
                        id: ''
                    }]
                })
            },
            // 获取部门列表
            // getDeptList () {
            //     return this.$http.get('/admin-api/dept/list').then(({ data: res }) => {
            //         if (res.code !== 200) {
            //             return this.$message.error(res.msg)
            //         }
            //         this.deptList = res.data
            //     }).catch(() => {})
            // },
            // 获取角色列表
            getRoleList() {
                return this.$http.get('/admin-api/role/list').then(({data: res}) => {
                    if (res.code !== 200) {
                        return this.$message.error(res.msg)
                    }
                    this.roleList = res.data
                }).catch(() => {
                })
            },
            // 回显
            getInfo(id) {
                this.$http.get(`/admin-api/user/${id}`).then(({data: res}) => {
                    Object.assign(res.data.roleIds, res.data.roleNames)
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
                }).catch(() => {
                })
            },
            // 所属部门树, 选中
            // deptListTreeCurrentChangeHandle (data, node) {
            //     this.dataForm.deptId = data.id
            //     this.dataForm.deptName = data.name
            //     this.deptListVisible = false
            // },
            // 表单提交
            dataFormSubmitHandle: debounce(function () {
                var that = this;
                       that.$refs['dataForm'].validate((valid) => {
                           if (!valid) {
                               return false
                           }
                           var roleData = []
                           for (var i = 0; i < that.dataForm.roleIds.length; i++) {
                               if(that.dataForm.roleIds[i].id !==""){
                                   roleData.push(that.dataForm.roleIds[i].id)
                               }
                           }
                           var dataForm = cloneDeep(that.dataForm);
                            dataForm.roleIds = roleData
                           that.$http[!this.pageId ? 'post' : 'put']('/admin-api/user', {
                               ...dataForm
                           }).then(({data: res}) => {
                               if (res.code !== 200) {
                                   return that.$message.error(res.msg)
                               }
                               that.$message({
                                   message: that.$t('prompt.success'),
                                   type: 'success',
                                   duration: 500,
                                   onClose: () => {
                                       that.visible = false
                                       that.$emit('refreshDataList')
                                   }
                               })
                           }).catch(() => {
                           })
                        //    that.dataForm.roleIds = [{
                        //        id: ''
                        //    }]
                       })
            }, 1000, {'leading': true, 'trailing': false})
        }
    }
</script>

<style lang="scss">
    .distance-btn {
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
