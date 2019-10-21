<template>
	<el-dialog
	 	    class="model-add-edit-data"
		    title="审核"
		    :close-on-click-modal="false"
		    :visible.sync="visible"
			width="35%"
				:before-close="closeDialog">
		    	<el-form
		    		:model="dataForm"
		    		:rules="dataRule"
		    		ref="addForm"
		    		@keyup.enter.native="dataFormSubmit('addForm')"
		    		>
                        <el-form-item  label="审核结果：" prop="auditState">
                               <el-radio-group v-model="dataForm.auditState">
                                    <el-radio label="1">审核通过</el-radio>
                                    <el-radio label="2">审核不通过</el-radio>
                                </el-radio-group>
                        </el-form-item>
				</el-form>
			    <span slot="footer" class="dialog-footer"  >
		     		    <el-button @click="dataFormCancel()">取消</el-button>
		     		    <el-button type="primary" @click="dataFormSubmit('addForm')"
		     		    :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
			    </span>
	</el-dialog>
</template>
<script>
	
	import { activityAudit} from '@/api/api'

	export default{
		name: "model-add-edit-data",
		data(){
			return{
				visible : false,
				loading : false,
				dataForm : {
                    auditState:"1",//操作 审核状态 1审核通过 2审核不通过
                    remarks:"",//备注
				},
				dataRule : {
			        auditState : [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
				},
				row:'',
				title:'',
			
			}
		},
		components:{
        },
		computed:{},
		mounted(){},
		methods:{
			init (row) {
				this.visible = true;
				this.row = row;
			},
			// 提交
			dataFormSubmit(formName){
				this.$refs[formName].validate((valid) => {
						if (valid) {
								this.loading = true;
								var obj=  {
									id:this.row.id,//订单id
									auditState:this.dataForm.auditState,//操作 0不通过 1通过
									remarks:this.dataForm.remarks,//备注
								}
							activityAudit(obj).then((res) => {
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
								return false;
						}
				})
			},
			dataFormCancel(){
					this.visible = false;
					this.closeDialog();
			},
			closeDialog() {
                this.visible = false;
				this.$parent.exammineVisible = false;
			},
		},
	}
</script>
<style scoped>
 .attrList{
	 height: 60px;
	 line-height: 90px;
	 border-top: 2px dotted gainsboro;
	 padding-left: 16px;
 }
 .el-textarea{
	 width: 100%;
 }
</style>
