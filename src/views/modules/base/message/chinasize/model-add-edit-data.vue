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
                :rules="dataRule"
                ref="dataForm"
                label-width="120px">
            <el-form-item label="尺码名称：" prop="name">
                <el-input v-model="dataForm.name" maxlength="10" placeholder="请输入10个字以内的内容"></el-input>
            </el-form-item>
            <el-form-item label="排序：" prop="sort">
                <el-input type="number" v-model="dataForm.sort"  @blur='artnumberinput(dataForm.sort)' min='0'  placeholder="0"></el-input>
            </el-form-item>
            <el-form-item label="" prop="sort">
                <div style="display: block;">数字越大越靠前</div>
            </el-form-item>
            <el-form-item style="text-align: center;">
            	<el-button  @click="dataFormCancel()">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit('dataForm')"
                           :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script> 
	import {updatasizeCn}  from '@/api/api'
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm : {
                	id:'',
                    name:'',
                    sort: 0,
                },
                dataRule : {
                    name: [
			            { required: true, message: '请输入尺码名称', trigger: 'blur' },
			            { min: 0, max: 10, message: '10个字符以内尺码名称', trigger: 'blur' }
			          ],
			          sort: [
//			            { required: true, message: '请排序数字', trigger: 'blur' },
			          ],
                },
                title:'添加/编辑尺码',
                row:"",
                formLabelWidth: '120px',
            }
        },
        methods: {
            init (row) {
                this.visible = true;
                if(row){
                	this.dataForm = row;
                }
                
            },
            //排序
		    artnumberinput(scope){
		    	if(scope<=0){
		    		this.dataForm.sort = 0;
		    	}
		    },
            dataFormSubmit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        updatasizeCn(this.dataForm).then((res) => {
                            this.loading = false;
                            let status = null;
                            if(res.code == "200"){
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
                            this.visible = false;
                			this.closeDialog();
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
            }
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