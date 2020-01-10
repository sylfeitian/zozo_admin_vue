<template>
    <div>
        <Bread :breaddata="breaddata" :index="'1'" @changePage="changePage"></Bread>
        <el-form
                :model="addDataForm"
                :rules="dataRule"
                ref="addForm"
                label-width="120px"

        >
            <el-form-item label="推送方式：" prop="sendMode" :label-width="formLabelWidth">
                <el-select v-model="addDataForm.sendMode" placeholder="请选择"  style="margin-left: 10px;width: 140px;">
                    <el-option label="站内信"  value="0"></el-option>
                    <el-option label="APP推送" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="消息接收人：" prop="receiverPeople" :label-width="formLabelWidth">
                <el-radio-group style="margin-top: 13px;" @change="receiver" v-model="addDataForm.receiverPeople">
                    <el-radio :label="0">全部用户</el-radio>
                    <div style="display: inline-block;margin-left:20px;"  @click="showDialogTableFn"> <el-radio :label="1">指定用户</el-radio></div style="display: inline-block;margin-left:20px;">
                </el-radio-group>
            </el-form-item>
            <el-form-item label="指定用户：" v-if="addDataForm.receiverPeople == 1" :label-width="formLabelWidth">
                <span>
						   <el-tag
                                   :key="index"
                                   v-for="(tag,index) in userLsit"
                                   :disable-transitions="false"
                                   style="margin-right:5px;"
                                   closable
                                   @close="handleClose(index)">
                    <!-- {{tag.memberName}} -->
                    {{tag.id}}
                </el-tag>
					  </span>
                      <span style="margin-top: 10px;display: inline-block;">共{{userLsit1.length}}条</span>
            </el-form-item>
            <el-form-item label="消息标题：" prop="messageTitle" :label-width="formLabelWidth">
                <el-input v-model.trim="addDataForm.messageTitle" auto-complete="off" placeholder="请填写标题" style="width: 1200px;"></el-input>
            </el-form-item>
            <el-form-item label="消息内容：" prop="messageContent" :label-width="formLabelWidth" style="vertical-align:top;">
                <template slot-scope="scope">
                    <quill-editor-img class="inforRight"  ref="quillEditorCompon" style="display: inline-block;"  @artmessageContent='artmessageContent' ></quill-editor-img>
                </template>
            </el-form-item>
            <el-form-item style="text-align: center;margin-left: -120px!important;">
                <el-button  @click="dataFormSubmit()">推送消息</el-button>
            </el-form-item>
            <el-dialog title="选择接收用户" :visible.sync="dialogTableVisible" width="80%">
                <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
                    <el-form-item label="会员账号：">
                        <el-input v-model.trim="dataForm.memberName" ></el-input>
                    </el-form-item>
                    <el-form-item label="消费金额：">
                        <el-input-number v-model="dataForm.minAmount" controls-position="right"  :min="0" :max="dataForm.maxAmount-1"></el-input-number>
                        --
                        <el-input-number v-model="dataForm.maxAmount" controls-position="right"  :min="dataForm.minAmount" :max="100000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="订单数量：">
                        <el-input-number v-model="dataForm.minCount" controls-position="right"  :min="0" :max="dataForm.maxCount-1"></el-input-number>
                        --
                        <el-input-number v-model="dataForm.maxCount" controls-position="right"  :min="dataForm.minCount" :max="100000"></el-input-number>
                    </el-form-item>
                    <el-form-item>
                        <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
                        <el-button  class="btn"type="primary" plain @click="reset()" >重置</el-button>
                    </el-form-item>
                </el-form>
                <el-button @click="all" type="primary" style="float: left;margin-bottom: 10px;">选择全部</el-button>
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
                    <el-table-column prop="id" label="用户ID" align="center"></el-table-column>
                    <el-table-column prop="memberName" label="会员账号" align="center"></el-table-column>
                    <el-table-column prop="nickName" label="用户姓名" align="center"></el-table-column>
                    <el-table-column prop="memberName" label="手机号" align="center"></el-table-column>
                    <el-table-column prop="orderAmount" label="消费金额" align="center"></el-table-column>
                    <el-table-column prop="orderCount" label="订单数量" align="center"></el-table-column>
                    <el-table-column prop="memberLoginTime" label="最近登录时间" align="center"></el-table-column>
                </el-table>
                <div class="bottomFun" style="margin-top: 10px;">
                    <div class="bottomFunLeft">
                        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    </div>
                    <!-- 分页 -->
                    <el-pagination
                            @size-change="pageSizeChangeHandle"
                            @current-change="pageCurrentChangeHandle"
                            :current-page="page"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="limit"
                            :total="total"
                            layout="total, sizes, prev, pager, next, jumper">
                    </el-pagination>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="decl">取 消</el-button>
                    <el-button type="primary" @click="saveUser">确 定</el-button>
                </div>
                <el-dialog
                        class="model-add-edit-data"
                        title="提示"
                        :close-on-click-modal="false"
                        :visible.sync="visible2"
                        width="35%"
                        append-to-body
                        :before-close="closeDialog">
                            <h3 style="text-align:center;">请确定是否添加全部?</h3>
                            <!-- <p style="color:red">请确认已与用户沟通达成一致</p> -->
                            <span slot="footer" class="dialog-footer"  >
                                    <el-button @click="dataFormCancel()">取消</el-button>
                                    <el-button type="primary" @click="modeldataFormSubmit('addForm')"
                                    :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
                            </span>
                </el-dialog>
            </el-dialog>
        </el-form>
    </div>
</template>

<script>
    import imgCropper from "@/components/model-photo-cropper";
    import Bread from "@/components/bread";
    import { getfashiondetail,saveMessage, messageuserall } from '@/api/api';
    import quillEditorImg from "@/components/quillEditor";
    import { getUser } from '@/api/url';
    import mixinViewModule from '@/mixins/view-module'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: getUser,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/log/login/export',
                    deleteURL: '',
                    dataListLoading: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                userLsit:[],
                userLsit1:[],
                checkAll: false,
                dataListLoading: false,
                dialogTableVisible: false,
                dataForm:{},
                addDataForm: {
                    messageContent: "",
                    messageTitle: "",
                    receiverPeople: "",
                    sendMode: "",
                    receiver:"",
                },
                multipleSelection:[],
                dataList: [],
                content:[],
                list:[],
                dataRule : {
                    sendMode : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    messageTitle : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    messageContent : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    receiverPeople : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ]
                },
                formLabelWidth: '120px',
                dialogImageUrl: "",
                uploading:false,
                dialogVisible: false,
                breaddata: [ "消息中心",  "消息列表","推送消息"],
                visible2:false,
                loading : false,
            }
        },
        components: {
            quillEditorImg,
            imgCropper,
            Bread
        },
        watch: {
            'addDataForm.messageTitle': function (newV, oldV) {
                var chineseCount = 0, characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 200) { //输入字符大于200的时候过滤
                        this.addDataForm.messageTitle = newV.substr(0, (chineseCount / 2 + characterCount) - 1)
                    }
                }
            }
        },
        methods: {
            decl(){
                this.dataForm = {};
                this.dialogTableVisible = false;
                // this.addDataForm.receiverPeople = 0;
            },
            all(){
                this.visible2 = true;
                // this.$refs.multipleTable.toggleAllSelection()
            },
            handleCheckAllChange(val) {
                if(val) this.$refs.multipleTable.toggleAllSelection();
                else this.$refs.multipleTable.clearSelection();
            },
            handleClose(index){
                this.userLsit.splice(index, 1);
                this.userLsit1.splice(index, 1);
            },
            saveUser(){
                this.dialogTableVisible = false;
                this.userLsit = this.multipleSelection;
                this.userLsit1 = this.multipleSelection;
            },
            receiver(val){
              
                //  if(val == 1) {  // };
            },
            //  弹框
            showDialogTableFn(val){
                this.dialogTableVisible = true;
                this.multipleSelection = [];
                this.getDataList().then(res=>{
                    this.$nextTick(()=>{
                            // setTimeout(()=>{
                                this.backScahCheckout();
                            //     window.that = this;
                            //     this.$refs.backScanref.click();
                            // },3001)
                    })
                }) ;
            

            },
            // 回显表格复选框
            backScahCheckout(){
                // var userLsit = this.userLsit;
                // userLsit = [this.dataList[1],this.dataList[2]]
                var userLsit = [];
                 this.dataList.forEach((item)=>{
                    this.userLsit.forEach((item2)=>{
                        if(item.id==item2.id){
                            userLsit.push(item)
                        }
                    })
                })
                userLsit.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row,true);
                });
                console.log("2342432424324234");
                console.log(this.multipleSelection);
            },
            artmessageContent(messageContent,i){
                this.addDataForm.messageContent = messageContent;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if (this.multipleSelection.length == this.dataList.length)
                    this.checkAll = true;
                else this.checkAll = false;
            },
            openDiog(){
                this.dialogTableVisible = true;
                this.getDataList();
            },
            reset() {
                // this.dataForm.maxCount = "";
                // this.dataForm.minCount = "";
                // this.dataForm.minAmount = "";
                // this.dataForm.maxAmount = "";
                // this.dataForm.maxAmount = "";
                // this.dataForm.memberName = "";
                this.dataForm = {};
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
                                var receiver = [];
                                var umengToken = [];
                                that.userLsit.map((v)=>{
                                    receiver.push(v.id)
                                    // list.push(v.memberName)
                                    umengToken.push(v.umengToken);

                                })
                                that.addDataForm.receiver = receiver.join(",");
                                that.addDataForm.umengToken = umengToken.join(",");
                                saveMessage(that.addDataForm).then((res)=>{
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
            },
            modeldataFormSubmit () {
                if(this.dataList.length==0){
                    this.$message.warning("至少勾选一个");
                    return
                }
                this.loading = true;
                var obj=  {
                    params:{
                        ...this.dataForm,
                    }
                }
                messageuserall(obj).then((res) => {
                    this.loading = false;
                    // alert(JSON.stringify(res));
                    let status = null;
                    if(res.code == "200"){
                        // console.log(res.msg)
                        // status = "success";
                        // this.visible2 = false;
                        // this.getData;
                        // this.closeDialog();
                        this.$message({
                            message: "正在添加，由于用户数量较多，请稍后查看",
                            type: "success",
                            duration: 1500
                        })
                        this.visible2 = false;
                        this.getData;
                        this.closeDialog();
                        this.decl();
                        var userLsit = res.data
                        this.userLsit1 = res.data
                        this.userLsit = userLsit.slice(0,50)
                        console.log(this.userLsit)
                    }else{
                        // status = "error";
                        this.$message({
                            message: "添加失败",
                            type: "error",
                            duration: 1500
                        })
                    }
                    // this.$message({
                    //     message: res.msg,
                    //     type: status,
                    //     duration: 1500
                    // })
                })
            },
            // 关闭内层弹窗
            dataFormCancel(){
                this.visible2 = false;
                this.closeDialog();
			},
			closeDialog() {
                this.visible2 = false;
			},
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