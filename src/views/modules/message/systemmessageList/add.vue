<template>
    <div>
        <Bread :breaddata="breaddata" :index="'1'" @changePage="changePage"></Bread>
        <el-form
                :model="addDataForm"
                :rules="dataRule"
                ref="addForm"
                label-width="120px"

        >
            <el-form-item label="推送方式：" prop="sizeName" :label-width="formLabelWidth">
                <el-select v-model="addDataForm.messageType" placeholder="请选择"  style="margin-left: 10px;width: 140px;">
                    <el-option label="站内信"  value="0"></el-option>
                    <el-option label="APP推送" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="消息接收人：" prop="img" :label-width="formLabelWidth">
                <el-radio-group v-model="addDataForm.messageType">
                    <el-radio :label="3">全部用户</el-radio>
                    <el-radio :label="6">指定用户</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="消息标题：" prop="title" :label-width="formLabelWidth">
                <el-input v-model="addDataForm.messageTitle" maxlength="100" auto-complete="off" placeholder="请填写标题" style="width: 1200px;"></el-input>
            </el-form-item>
            <el-form-item label="消息内容：" prop="con" :label-width="formLabelWidth" style="vertical-align:top;">
                <template slot-scope="scope">
                    <quill-editor-img class="inforRight" :index="i" ref="quillEditorCompon" style="display: inline-block;"  @artmessageContent='artmessageContent' ></quill-editor-img>
                </template>
            </el-form-item>
            <el-form-item style="text-align: center;margin-left: -120px!important;">
                <el-button  @click="dataFormSubmit()">推送消息</el-button>
            </el-form-item>
            <el-dialog title="添加商品" :visible.sync="dialogTableVisible">
                <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
                    <el-form-item label="ID：">
                        <el-input v-model="dataForm.params" ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
                        <el-button  class="btn"type="primary" plain @click="reset()" >重置条件</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                        width="100%"
                        ref="multipleTable"
                        :data="dataList"
                        border=""
                        v-loading="dataListLoading"
                        style="width: 100%;maigin-top:10px;"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="70"></el-table-column>
                    <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
                    <el-table-column prop="goodsId" label="商品ID" align="center"></el-table-column>
                    <el-table-column prop="sellPrice" label="价格" align="center"></el-table-column>
                    <el-table-column prop="stockQuantity" label="库存" align="center"></el-table-column>

                </el-table>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogTableVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
                </div>
            </el-dialog>
        </el-form>
    </div>
</template>

<script>
    import imgCropper from "@/components/model-photo-cropper";
    import Bread from "@/components/bread";
    import { getfashiondetail,saveMessage } from '@/api/api';
    import quillEditorImg from "@/components/quillEditor";
    import { getGoodscspage } from '@/api/url';
    import mixinViewModule from '@/mixins/view-module'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: getGoodscspage,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/log/login/export',
                    deleteURL: '',
                    dataListLoading: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                dataListLoading: false,
                dialogTableVisible: false,
                dataForm:{},
                addDataForm: {
                    messageContent: "",
                    messageTitle: "",
                    messageType: "",
                    receiver: "",
                    receiverPeople: "",
                    sendMode: "",
                    sendTime: "",
                    umengToken: 0
                },
                multipleSelection:[],
                dataList: [],
                content:[],
                list:[],
                dataRule : {
                    sizeName : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    title : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    con : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    img : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ]
                },
                formLabelWidth: '120px',
                dialogImageUrl: "",
                uploading:false,
                dialogVisible: false,
                breaddata: [ "消息中心",  "消息列表","推送消息"],
            }
        },
        components: {
            quillEditorImg,
            imgCropper,
            Bread
        },
        methods: {
            artmessageContent(messageContent,i){
                this.addDataForm.messageContent = messageContent;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            openDiog(){
                this.dialogTableVisible = true;
                this.getDataList();
            },
            reset() {
                this.dataForm.params = "";
                this.getDataList();
            },
            dataFormSubmit(){
                let that = this;
                this.$refs["addForm"].validate(valid => {
                    if (valid) {
                        this.$confirm(`确定提交表单信息?`, "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        })
                            .then(() => {
                                saveMessage({shopMessageTextDTO:this.addDataForm}).then((res)=>{
                                    if(res.code == 200){
                                        this.$message({
                                            message: res.msg,
                                            type: 'success',
                                            onClose:function () {
                                                that.changePage();
                                            }
                                        });
                                    }else{
                                        this.$message({
                                            message: res.msg,
                                            type: 'error',
                                        });
                                    }
                                })
                            })
                            .catch(() => {});
                    }
                });

            },
            changePage(){
                this.$emit("addList");
            }
        }
    }
</script>

<style scoped>
    /deep/ .el-form-item__content {
        line-height: 20px!important;
    }
    /deep/ .upload-box {
        border: 0!important;
    }
    /deep/ .el-button {
        width: 150px;
    }
</style>