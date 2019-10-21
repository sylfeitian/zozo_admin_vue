<template>
    <el-dialog
            class="model-add-edit-data"
            :title="title"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :before-close="closeDialog"
            width="26%"
    >
        <el-form
                :model="dataForm"
                ref="addForm"
                :rules="dataRule"
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"
        >
            <el-form-item label="词典名称：" prop="dictName" :label-width="formLabelWidth">
                <el-input v-model.trim="dataForm.dictName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="词典编码：" prop="dictValue" :label-width="formLabelWidth">
                <el-input v-model.trim="dataForm.dictValue"   maxlength="100"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;margin-left: -120px!important;">
                <el-button  @click="dataFormCancel()">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit('addForm')"
                           :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import { backScanDict,dictSave,updateDict } from '@/api/api'
    export default {
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {
                    dictName: "",
                    dictValue: ""
                },
                dataRule : {
                    dictName : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    dictValue : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ]
                },
                title:'',
                row:"",
                row2:"",
                formLabelWidth: '120px'
            }
        },
         watch:{
            'dataForm.dictName':function(newV,oldV) {
                var chineseCount=0,characterCount=0;
                for(let i=0;i<newV.length;i++){
                    if(/^[\u4e00-\u9fa5]*$/.test(newV[i])){ //汉字
                        chineseCount=chineseCount+2;
                    }else if(/[0-9a-zA-Z]/g.test(newV[i])){ //数字、字母
                        characterCount=characterCount+1;
                    }else{ // 只能输入文字、字母、数字
                        this.dataForm.dictName = newV.replace(newV[i],"")
                    }
                    var count=chineseCount+characterCount;
                    if(count>40){ //输入字符大于40的时候过滤
                        this.dataForm.dictName = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
            'dataForm.dictValue':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    // 只能输入英文和数字
                    if(/[^0-9a-zA-Z]/g.test(newV[i])){
                        this.dataForm.dictValue = newV.replace(newV[i],"")
                    }
                }
            }
        },
        components:{
        },
        computed:{},
        mounted(){},
        methods: {
            init (row,row2) {
                this.visible = true;
                this.row = row;
                this.row2 = row2;
                console.log(row)
                if(row2){
                    this.title="编辑词典";
                    this.backScan();
                }else{
                    this.title="添加词典"

                }
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            // 编辑回显
            backScan(){
                var obj  = {
                    id:this.row2.id,
                    dictName:this.row2.dictName,
                    dictValue:this.row2.dictValue,
                }
                backScanDict(obj).then((res)=>{
                    if(res.code == 200){
                        Object.assign(this.dataForm,res.data);

                    }else{

                    }
                })
            },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        var obj = {
                            "pid":  this.row.id,//: 上级ID，一级为0 ,
                            "dictName":  this.dataForm.dictName,// 字典名称 ,
                            "dictValue":  this.dataForm.dictValue,//字典编号 ,
                            "sort ":0,
                        }
                        if(this.row2) obj.id = this.row2.id
                        var fn = this.row2?updateDict:dictSave;
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
                this.$parent.addOrUpdateVisible = false;
            },
        }
    }
</script>

<style scoped>
    /*/deep/.el-form-item__content:nth-child(1) {*/
    /*    margin-left: 50px!important;*/
    /*}*/
    .title {
        margin-left: -70px;
    }
</style>