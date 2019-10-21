<template>
	<el-dialog
	 	    class="model-add-edit-data"
		    title="审核"
		    :close-on-click-modal="false"
		    :visible.sync="visible"
			width="35%"
			:before-close="closeDialog">
		    	<h3>确定停止该活动吗?</h3>
                <p style="color:red">停止后已下单的活动商品不受影响</p>
			    <span slot="footer" class="dialog-footer"  >
		     		    <el-button @click="dataFormCancel()">取消</el-button>
		     		    <el-button type="primary" @click="dataFormSubmit('addForm')"
		     		    :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
			    </span>
	</el-dialog>
</template>
<script>
	
	import { presellActivityStop } from '@/api/api'

	export default{
		name: "model-stop",
		data(){
			return{
				visible : false,
				loading : false,
				dataForm : {
                    auditState:"1",//操作 2不通过 1通过
                    remarks:"",//备注
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
				// this.$refs[formName].validate((valid) => {
				// 		if (valid) {
								this.loading = true;
								var obj=  {
									id:this.row.id,
								}
								presellActivityStop(obj).then((res) => {
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
				this.$parent.modelStopVisible = false;
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
