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
            ref="addForm"
            @keyup.enter.native="dataFormSubmit('addForm')"
            label-width="120px"
        >
            <el-form-item label="尺码ID：">
                <span>{{dataForm.idJp}}</span>
            </el-form-item>
            <el-form-item label="尺码名称：">
                <span>{{dataForm.name}}</span>
            </el-form-item>
            <el-form-item label="关联尺码：" prop="cnSizeId" :label-width="formLabelWidth">
            	<el-select
		          v-model="dataForm.cnSizeId"
		          placeholder="请选择"
		          loading-text="加载中···">
		          <el-option
		            v-for="item in goodKindList1"
		            :key="item.id"
		            :label="item.name"
		            :value="item.id">
		          </el-option>
		        </el-select>
            </el-form-item>
            <el-form-item style="text-align: center;">
                <el-button type="primary" @click="dataFormSubmit('addForm')"
                           :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
                <el-button @click="dataFormCancel()">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
	import {uploadsizejptag,getsizecn} from '@/api/api'
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {
                	id:"",
                    idJp: "",//尺码ID
                    name: "",//日本尺码名称
                    cnSizeName: "",//尺码名称
                    cnSizeId:"",//中国尺码id
                },
                goodKindList1:[],
                dataRule : {
                    cnSizeName : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ]
                },
                optionsApplication: [],
                optionsRight: [],
                title:'',
                row:"",
                formLabelWidth: '120px'
            }
        },
        components:{
        },
        computed:{
        	
        },
        mounted(){
        	this.artgetsize();
        },
        methods: {
        	//获取尺码
        	artgetsize(){
                getsizecn().then(({data})=>{
                	if(data){
                		this.goodKindList1 = data;
		          	}else {
			          	this.$message.error("服务器错误");
		          	}
	                })
        	},
            init (row) {
                this.visible = true;
                this.dataForm = row;
                this.title="修改/关联尺码";
//              this.$nextTick(() => {
//                  this.$refs['addForm'].resetFields();
//                  // this.getApplyPullList();
//              })
            },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        console.log(this.dataForm);
                        uploadsizejptag(this.dataForm).then((res) => {
                            this.loading = false;
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
                this.$parent.addEditisshow = false;
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