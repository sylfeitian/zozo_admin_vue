<template>
	<el-dialog
	 	    class="model-add-edit-data"
		    title="提示"
		    :close-on-click-modal="false"
		    :visible.sync="visible"
			width="35%"
			:before-close="closeDialog">
		    	<h3>请问确定要退款吗?</h3>
				<h3 style="color:red;">同意退款后将自动退款给用户</h3>
				</el-form>
			    <span slot="footer" class="dialog-footer"  >
		     		    <el-button @click="dataFormCancel()">取消</el-button>
		     		    <el-button type="primary" @click="dataFormSubmit('addForm')"
		     		    :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
			    </span>
	</el-dialog>
</template>
<script>
	
	import { retryMoney } from '@/api/api'

	export default{
		data(){
			return{
				visible : false,
				loading : false,
				orderBase:'',
				title:'',
				row:'',
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
				// this.$refs[formName].validate((valid) => {
						// if (valid) {
								this.loading = true;
								var obj=  {
									aftersaleSn:this.row.aftersaleSn,//物流单号
								}
								retryMoney(obj).then((res) => {
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
				// 		} else {
				// 				return false;
				// 		}
				// })
			},
			dataFormCancel(){
					this.visible = false;
					this.closeDialog();
			},
			closeDialog() {
                this.visible = false;
				this.$parent.retryVisible = false;
			},
		},
	}
</script>
<style lang="scss" scoped>
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
