<template>
	<el-dialog
	 	    class="model-add-edit-data"
		    title="备注"
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
                        <el-form-item  label=""  prop="remarks">
                            <el-input
                                type="textarea"
                                :rows="4"
                                maxlength="500"
                                placeholder="请输入少于500字的内容"
                                v-model="dataForm.remarks">
                            </el-input>
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
	
	import { managerRemark} from '@/api/api'

	export default{
		name: "model-add-edit-data",
		data(){
			return{
				visible : false,
				loading : false,
				dataForm : {
                    operating:1,//操作 0不通过 1通过
                    remarks:"",//备注
				},
				dataRule : {
			        operating : [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    remarks : [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
			        ],
				},
				orderBase:'',
				title:'',
			
			}
		},
		components:{
        },
		computed:{},
		mounted(){},
		methods:{
			init (orderBase) {
				this.visible = true;
				this.orderBase = orderBase;
			},
			// 提交
			dataFormSubmit(formName){
				this.$refs[formName].validate((valid) => {
						if (valid) {
								this.loading = true;
								var obj=  {
									id:this.orderBase.logisticsSn,//物流单号
									remarks:this.dataForm.remarks,//备注
								}
								managerRemark(obj).then((res) => {
									this.loading = false;
									// alert(JSON.stringify(res));
									let status = null;
									if(res.code == "200"){
										status = "success";
										this.visible = false;
										// this.$emit('searchDataList');
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
				this.$parent.remarkInfoVisible = false;
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
