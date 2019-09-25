<template>
    <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" class="rolePage">
        <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
            <el-form-item prop="name" label="角色名称：">
                <el-input v-model="dataForm.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="remark" label="角色说明：">
                <el-input v-model="dataForm.remark" placeholder="不超过20个汉字"></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item size="mini" label="权限管理：">
                        <el-tree
                                :data="menuList"
                                :props="{ label: 'name', children: 'children' }"
                                node-key="id"
                                ref="menuListTree"
                                accordion
                                show-checkbox>
                        </el-tree>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template slot="footer">
            <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
        </template>
    </el-dialog>
</template>

<script>
    import debounce from 'lodash/debounce'
    export default {
        data () {
            return {
                visible: false,
                menuList: [],
                // deptList: [],
                dataForm: {
                    id: '',
                    name: '',
                    menuIdList: [],
                    // deptIdList: [],
                    remark: ''
                }
            }
        },
        watch: {
            'dataForm.name': function (newV, oldV) {
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 20) { //输入字符大于20的时候过滤
                        this.dataForm.name = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
            'dataForm.remark':function(newV,oldV) {
                var chineseCount=0,characterCount=0;
                for(let i=0;i<newV.length;i++){
                    if(/^[\u4e00-\u9fa5]*$/.test(newV[i])){ //汉字
                        chineseCount=chineseCount+2;
                    }else{ //字符
                        characterCount=characterCount+1;
                    }
                    var count=chineseCount+characterCount;
                    if(count>40){ //输入字符大于40的时候过滤
                        this.dataForm.remark = newV.substr(0, (chineseCount / 2 + characterCount) - 1)
                    }
                }
            }
        },
            methods: {
            init (id) {
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    this.$refs.menuListTree.setCheckedKeys([])
                    // this.$refs.deptListTree.setCheckedKeys([])
                    Promise.all([
                        this.getMenuList(),
                        // this.getDeptList()
                    ]).then(() => {
                        if (id) {
                            this.getInfo()
                        }
                    })
                })
            },
            // 获取菜单列表
            getMenuList () {
                return this.$http.get('/admin-api/menu/select').then(({ data: res }) => {
                    if (res.code !== 200) {
                        return this.$message.error(res.msg)
                    }
                    this.menuList = res.data
                }).catch(() => {})
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
            // 获取信息
            getInfo () {
                this.$http.get(`/admin-api/role/${this.dataForm.id}`).then(({ data: res }) => {
                    if (res.code !== 200) {
                        return this.$message.error(res.msg)
                    }
                    this.dataForm = {
                        ...this.dataForm,
                        ...res.data
                    }
                    this.dataForm.menuIdList.forEach(item => this.$refs.menuListTree.setChecked(item, true))
                    // this.$refs.deptListTree.setCheckedKeys(this.dataForm.deptIdList)
                }).catch(() => {})
            },
            // 表单提交
            dataFormSubmitHandle: debounce(function () {
                this.$refs['dataForm'].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.dataForm.menuIdList = [
                        ...this.$refs.menuListTree.getCheckedKeys(),
                        ...this.$refs.menuListTree.getHalfCheckedKeys()
                    ]
                    // this.dataForm.deptIdList = this.$refs.deptListTree.getCheckedKeys()
                    this.$http[!this.dataForm.id ? 'post' : 'put']('/admin-api/role', this.dataForm).then(({ data: res }) => {
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
    .rolePage {
        .el-tree-node__content{
            border: none !important;
        }
    }
</style>
