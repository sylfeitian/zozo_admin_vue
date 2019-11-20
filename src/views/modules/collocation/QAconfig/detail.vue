<template>
    <div>
        <Bread :breaddata="breaddata" :index="'1'" @changePage="changePage"></Bread>
        <el-button style="float:right;margin-bottom:20px;" type="primary" @click="addHelp()">新增Q&A</el-button>
        <el-table
                :data="dataList"
                v-loading="dataListLoading"
                border
                style="width: 100%">
            <el-table-column
                    type="index"
                    prop="$index"
                    align="center"
                    label="序号"
                    width="70">
                <template slot-scope="scope">
                    {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
                </template>
            </el-table-column>
            <el-table-column
                    prop="sort"
                    align="center"
                    label="排序">
                <template slot-scope="scope">
                    <el-input
                        v-model="scope.row.sort"
                        @change="changeSort(scope.row)"
                        :min="0"
                        type="number"
                        style="width:120px;"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column
                    prop="title"
                    align="center"
                    label="标题"
                    width="220">
            </el-table-column>
            <el-table-column
                    prop="type"
                    align="center"
                    label="帮助类型">
            </el-table-column>
            <el-table-column
                    prop="booleanDisplay"
                    align="center"
                    label="是否显示">
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.booleanDisplay"
                            @change="putState(scope.row)"
                    >
                    </el-switch>
                </template>
            </el-table-column>


            <el-table-column
                    prop="createDate"
                    align="center"
                    label="发布时间">
            </el-table-column>
            <el-table-column
                    prop="views"
                    align="center"
                    label="查看次数">
            </el-table-column>
            <el-table-column
                    prop="address"
                    align="center"
                    label="操作"
                    width="220">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addHelp(scope.row.id)">编辑</el-button>
                    <el-button type="text" size="small" @click="delItem(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="footerBox">
            <div class="footerBtn">
                <el-button @click="changeSortSave()" type="primary">保存排序</el-button>
            </div>
            <el-pagination
                @size-change="pageSizeChangeHandle"
                @current-change="pageCurrentChangeHandle"
                :current-page="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
        </div>


        <el-dialog
                :title="helpTitle"
                :visible.sync="editVisible"
                :close-on-click-modal="false"
                :before-close="closeDialog"
                class="activiDialog"
                width="40%">
            <el-form :model="editDataForm" :rules="dataRule" ref="editDataForm" @keyup.enter.native="subActivity()"
                     label-width="120px">
                <el-form-item label="帮助类型：" prop="type">
                    <el-input v-model.trim="editDataForm.type" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="帮助标题：" prop="title">
                    <el-input v-model.trim="editDataForm.title" placeholder="请输入200字以内的内容"></el-input>
                </el-form-item>
                <el-form-item label="帮助内容：" prop="content">
                    <quill-editor-img v-if="isShow" :value="editDataForm.content"   @artmessageContent='artmessageContent' ></quill-editor-img>
                </el-form-item>
                <el-form-item label="显示设置：">
                    <el-switch v-model="editDataForm.booleanDisplay"></el-switch>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="noCheck('editDataForm')">取 消</el-button>
            <el-button type="primary" @click="subActivity('editDataForm')" :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import {toQamainList} from '@/api/url'
    import {zozogoodsPage, delQuestionanswer, saveQuestionanswer, putQuestionanswer, getQuestionanswer,updateQuestionanswerSort} from '@/api/api'
    import Bread from "@/components/bread";
    import quillEditorImg from "@/components/quillEditor";
    export default {
        mixins: [mixinViewModule],
        components: {quillEditorImg,Bread},
        data() {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: toQamainList,
                    getDataListIsPage: true,
                    activatedIsNeed: false,
                    // exportURL: '/admin-api/store/export',
                    // deleteURL: '/admin-api/store',
                    // deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                helpTitle: '新增帮助',
                dataListLoading: false,
                dataList: [],
                isShow:false,
                dataForm: {},
                isSave: true,
                loading : false,
                editVisible: false,
                editDataForm: {
                    type: '',
                    title: '',
                    content: '',
                    booleanDisplay: true,
                },
                value: true,
                sortList: [],
                breaddata: ["配置管理", "Q&A配置", "查看Q&A"],
            }
        },
        computed: {
            dataRule() {
                return {
                    type: [
                        {required: true, message: '名称不能为空', trigger: 'blur'},
                    ],
                    title: [
                        {required: true, message: '帮助标题为空', trigger: 'blur'},
                    ],
                    content: [
                        {required: true, message: '帮助内容为空', trigger: 'blur'},
                    ]
                }
            }
        },
        watch: {
            'editDataForm.title': function (newV, oldV) {
                var chineseCount = 0, characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 400) { //输入字符大于400的时候过滤
                        this.editDataForm.title = newV.substr(0, (chineseCount / 2 + characterCount) - 1)
                    }
                }
            }
        },
        created() {
            this.demo();
        },
        methods: {
            init(row) {
                this.$nextTick(() => {
                    if (row) {
                        this.dataForm.typeId = row.id;
                        this.editDataForm.type = row.type;
                        this.editDataForm.typeId = row.id;
                        this.getDataList();
                    }
                })
            },
            artmessageContent(messageContent){
                this.editDataForm.content = messageContent;
            },
            putState(data) {
                let obj = {
                    id: data.id,
                    booleanDisplay: data.booleanDisplay
                }
                putQuestionanswer(obj).then((res) => {
                    if (res.code == 200) {
                        this.getDataList();
                        this.$message({
                            message: res.msg,
                            type: 'success',
                            duration: 1500,
                        })
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                            duration: 1500,
                        })
                    }
                })
            },
            delItem(id) {
                this.$confirm('是否删除该数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let obj = [];
                    obj.push(id)
                    delQuestionanswer({data: obj}).then((res) => {
                        if (res.code == 200) {
                            this.getDataList();
                            this.$message({
                                message: res.msg,
                                type: 'success',
                                duration: 1500,
                            })
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'error',
                                duration: 1500,
                            })
                        }
                    })
                }).catch(() => {
                });
            },
            changePage() {
                this.$emit("showListFun");
            },
            addHelp(id) {
                this.editVisible = true;
                if (id) {
                    this.helpTitle = '编辑帮助';
                    this.isSave = false;
                    var obj = {
                        id: id
                    }
                    getQuestionanswer(obj).then((res) => {
                        if (res.code == 200) {
                            this.editDataForm.sort = res.data.sort;
                            this.editDataForm.id = res.data.id;
                            this.editDataForm.views = res.data.views;
                            this.editDataForm.title = res.data.title;
                            this.editDataForm.content = res.data.content;
                            this.editDataForm.booleanDisplay = res.data.booleanDisplay;
                            this.isShow = true;
                        }
                    })
                } else {
                    this.isSave = true;
                    this.helpTitle = '新增帮助';
                    this.isShow = true;
                }
            },
            //更改排序
            changeSort(row) {
                this.sortList.push(row);
            },
            //保存排序
            changeSortSave() {
                if (this.sortList.length == 0) {
                    this.$message({
                    type: "warning",
                    message: "请选择修改排序的数据"
                    });
                    return false;
                }
                console.log(this.sortList)
                const obj = {
                            id:  this.sortList.length!=0 && this.sortList[0].id,
                            sort:  this.sortList.length!=0 && this.sortList[0].sort
                        }
                updateQuestionanswerSort(obj).then(res => {
                    if (res.code == 200) {
                    this.$message({
                        message: res.msg,
                        type: "success",
                        duration: 1500,
                        onClose: () => {
                            this.sortList = [];
                        this.getDataList();
                        }
                    });
                    } else {
                    this.$message({
                        message: res.msg,
                        type: "error",
                        duration: 1500,
                        onClose: () => {
                            this.sortList = [];
                        this.getDataList();
                        }
                    });
                    }
                });
            },

            noCheck(formName) {
                this.$refs[formName].resetFields();
                this.editVisible = false;
                this.isShow = false;
                this.editDataForm.title = "";
                this.editDataForm.content = "";
                this.editDataForm.booleanDisplay = true;
                this.editDataForm.sort = "";
                this.editDataForm.id = "";
                this.editDataForm.views = "";
            },
            // 关闭弹窗
            closeDialog() {
                this.editVisible = false;
            },
            subActivity(formName) {
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm(`确定提交表单信息?`, "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        })
                            .then(() => {
                                this.loading = true;
                                if (that.isSave) {
                                    saveQuestionanswer(that.editDataForm).then((res) => {
                                        this.loading = false;
                                        if(res.code == "200"){
                                            status = "success";
                                            this.visible = false;
                                            this.getDataList();
                                            this.closeDialog();

                                        }else{
                                            status = "error";
                                        }

                                        this.$message({
                                            message: res.msg,
                                            type: status,
                                            duration: 1500
                                        })
                                    })
                                } else {
                                    putQuestionanswer(that.editDataForm).then((res) => {
                                        this.loading = false;
                                        if(res.code == "200"){
                                            status = "success";
                                            this.visible = false;
                                            this.getDataList();
                                            this.closeDialog();

                                        }else{
                                            status = "error";
                                        }

                                        this.$message({
                                            message: res.msg,
                                            type: status,
                                            duration: 1500
                                        })
                                    })
                                }
                            })
                            .catch(() => {
                            });
                    }
                });
            },


            demo() {
                function placeholderPic() {
                    var w = document.documentElement.offsetWidth;
                    document.documentElement.style.fontSize = w / 20 + 'px';
                }

                placeholderPic();
                window.onresize = function () {
                    placeholderPic();
                }
            },
        }
    };
</script>
<style lang="scss" scoped>
    .el-input {
        width: 240px;
        height: 40px;
    }

    .footerBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
