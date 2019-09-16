<template>
    <!-- <el-dialog
        class="model-add-edit-data"
        :title="title"
        :close-on-click-modal="false"
        :visible.sync="visible"
        :before-close="closeDialog"
        width="26%"
    >
        <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="addForm"
            @keyup.enter.native="dataFormSubmit('addForm')"
            label-width="140px"
        >
            <el-form-item label="日本分类条件ID：">
                <span>{{dataForm.idJp}}</span>
            </el-form-item>
            <el-form-item label="日本分类条件信息：">
                <span>{{dataForm.nameJp}}</span>
            </el-form-item>
            <el-form-item label="分类条件信息：" prop="name" :label-width="formLabelWidth">
                <el-input v-model="dataForm.name" auto-complete="off"></el-input>
            </el-form-item>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dataFormCancel()">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit('addForm')"
                       :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
        </span>
    </el-dialog> -->

    <!-- 新增编辑活动弹框 -->
    <el-dialog
        :title="title"
        :visible.sync="visible"
        :close-on-click-modal = "false"
        :show-close = "false"
        class="activiDialog"
        width="40%">
        <el-form :model="activiDataForm" :rules="dataRule" ref="activiDataForm" @keyup.enter.native="subActivity()"  label-width="120px">
            <el-form-item label="活动标题：" prop="title">
                <el-input v-model="activiDataForm.title" placeholder="请输入50字以内的标题" :maxlength="50" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="满减规则：" :prop="ruleName">
                单笔订单满
                 <el-input-number style="width:120px" @blur="bluerule1" v-model="activiDataForm.limitPrice"  :precision="2" :step="1" :max="999999" controls-position="right"></el-input-number>
                元立减
                <el-input-number style="width:120px" v-model="activiDataForm.reducePrice" @blur="bluerule2"  :step="1" :max="999999" controls-position="right"></el-input-number>
                元
            </el-form-item>
            <el-form-item label="开始时间：" prop="startTime">
                <el-date-picker
                    v-model="activiDataForm.startTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择开始时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：" prop="endTime">
                <el-date-picker
                    v-model="activiDataForm.endTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择结束时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="活动限制：">
                <el-checkbox-group v-model="activiDataForm.checkList">
                    <el-checkbox :label="true">不可使用优惠券</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog()">取 消</el-button>
            <el-button type="primary" @click="dataFormSubmit('activiDataForm')" :loading="saveLoading">{{saveLoading?"提交中..":"确定"}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { activityReduceAdd,activityReduceEdit}  from '@/api/api.js'
    export default {
        name: "model-add-edit-data",
        data () {
              var  validatorTime = (rule, value, callback) => {
                if (new Date(value).getTime() < new Date(this.activiDataForm.startTime).getTime()) {
                 return callback(new Error("结束时间不能小于开始时间"))
                }
                callback()
            }
              var  validatorPrice = (rule, value, callback) => {
                if (parseFloat(this.activiDataForm.reducePrice) > parseFloat(this.activiDataForm.limitPrice)) {
                 return callback(new Error("立减价格不能大于满减金额"))
                }
                callback()
            }
            return {
                visible : false,
                loading : false,
                saveLoading:false,
                title:"",
                dataForm: {
                    // conditionId: "",//日本分类条件ID
                    // japanCondition: "",//日本分类条件信息
                    // conditionName: "",//分类条件信息
                    idJp: "",
                    nameJp: "",
                    name: "",
                },
                dataRule : {
                    title : [
                        { required: true, message: '活动标题不能为空', trigger: 'blur' },
                    ],
                    startTime : [
                        { required: true, message: '开始时间不能为空', trigger: 'blur' },
                    ],
                    endTime : [
                        { required: true, message: '结束时间不能为空', trigger: 'blur' },
                         { validator: validatorTime, trigger: 'blur'}
                    ],
                    // limitPrice: [
                    //     { required: true, message: '订单满多少元不能为空', trigger: 'blur' },
                    // ],
                    // reducePrice: [
                    //     { required: true, message: '立减多少元不能为空', trigger: 'blur' },
                        
                    // ],
                    rule1: [
                        { required: true, message: '订单满多少元不能为空', trigger: 'blur' },
                        { validator: validatorPrice, trigger: 'blur'}
                    ],
                     rule2: [
                        { required: true, message: '立减多少元不能为空', trigger: 'blur' },
                        { validator: validatorPrice, trigger: 'blur'}
                    ],
                },
                activiDataForm:{
                    title:'',
                    startTime:'',
                    endTime:'',
                    limitPrice:'',
                    reducePrice:'',
                    rule1:'',
                    rule2: '',
                    checkList:false
                },
                ruleName:'rule1'
            }
        },
        components:{
        },
        computed:{},
        mounted(){},
        methods: {
            init (row) {
                this.visible = true;
                this.row = row;
                if(row){
                    console.log(row);
                    this.title="编辑满减活动";
                    this.backScan();
                }else{
                    this.title="新增满减活动"
                }
                this.$nextTick(() => {
                   this.$refs['activiDataForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
             bluerule1(){
                if(this.activiDataForm.rule1){
                    this.ruleName = 'rule2';
                }
                console.log('====',this.ruleName)
            },
            bluerule2(){
                if(this.activiDataForm.rule1){
                    this.ruleName = 'rule1';
                }
                console.log('====',this.ruleName)
            },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // this.loading = true;
                        var obj = {
                            "endTime": this.activiDataForm.endTime,//活动结束时间 ,
                            "limitPrice": this.activiDataForm.limitPrice,// 满减限制金额 ,
                            "reducePrice": this.activiDataForm.reducePrice,//满减金额 ,
                            "shareFlag": this.activiDataForm.checkList?1:0,//能否共享优惠券活动标识,0:不共享，1:共享 ,
                            "startTime": this.activiDataForm.startTime,//活动开始时间 ,
                            "title": this.activiDataForm.title//活动标题
                        }
                        if(this.row){  obj.id = this.row.id};
                        var fn = this.row?activityReduceEdit:activityReduceAdd;
                        fn(obj).then((res) => {
                            this.loading = false;
                            // alert(JSON.stringify(res));
                            let status = null;
                            if(res.code == "200"){
                                status = "success";
                                this.visible = false;
                                this.$emit('searchDataList');
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
                        //console.log('error 添加失败!!');
                        return false;
                    }
                })
            },
            dataFormCancel(){
                this.visible = false;
                this.closeDialog();
            },
            closeDialog() {
                this.$parent.addEditDataVisible = false;
            },
         
        }
    }
</script>

<style scoped>
    /*/deep/.el-form-item__content:nth-child(1) {*/
    /*    margin-left: 20px!important;*/
    /*}*/
    .title {
        margin-left: -98px;
    }
</style>