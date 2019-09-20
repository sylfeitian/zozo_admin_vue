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
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"
        >
            <el-form-item label="中文词汇：" prop="chineseVocabulary" :label-width="formLabelWidth">
                <el-input v-model="dataForm.chineseVocabulary" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="对照词汇：" prop="japaneseWord" :label-width="formLabelWidth">
                <el-input v-model="dataForm.japaneseWord" placeholder="请输入"></el-input>
            </el-form-item>
<!--            <el-form-item style="text-align: center;margin-left: -120px!important;">-->
<!--                <el-button  @click="dataFormCancel()">取消</el-button>-->
<!--                <el-button type="primary" @click="dataFormSubmit('addForm')"-->
<!--                           :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>-->
<!--            </el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dataFormCancel()">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit('addForm')"
                       :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { backScanSyslexicon,syslexiconSave,editSyslexicon } from '@/api/api'
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {
                    chineseVocabulary :"",
                    japaneseWord: "",
                },
                optionsApplication: [],
                optionsRight: [],
                title:'',
                row:"",
                formLabelWidth: '120px',
                lexiconType:'1',
            }
        },
        components:{
        },
        computed:{},
        mounted(){},
        methods: {
            init (row,lexiconType) {
                this.visible = true;
                this.row = row;
                this.lexiconType = lexiconType;
                console.log(row)
                if(row){
                    this.title="编辑对照词";
                    this.backScan();
                }else{

                    this.title="新建对照词"

                }
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            // 编辑回显
            backScan(){
                var obj  = {
                    id:this.row.id,
                    chineseVocabulary:this.row.chineseVocabulary,
                    japaneseWord:this.row.japaneseWord,
                    lexiconType:  this.lexiconType
                }
                backScanSyslexicon(obj).then((res)=>{
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
                            "chineseVocabulary":  this.dataForm.chineseVocabulary,
                            "japaneseWord":  this.dataForm.japaneseWord,
                            "lexiconType":  this.lexiconType
                        }
                        if(this.row) obj.id = this.row.id
                        var fn = this.row?editSyslexicon:syslexiconSave;
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
    /*    margin-left: 50px!important;*/
    /*}*/
    .title {
        margin-left: -70px;
    }
    /deep/.el-textarea {
        width: 100%;
    }
</style>