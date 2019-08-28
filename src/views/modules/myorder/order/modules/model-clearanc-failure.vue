<template>
	<el-dialog
	 	    class="model-add-edit-data"
		    title="提示"
		    :close-on-click-modal="false"
		    :visible.sync="visible"
			width="35%"
				:before-close="closeDialog">
		    	<h3>确认操作清关失败吗?</h3>
                <p style="color:red">订单将自动取消</p>
			    <span slot="footer" class="dialog-footer"  >
		     		    <el-button type="primary" @click="dataFormSubmit('addForm')"
		     		    :loading="loading">{{loading ? "提交中···" : "提交"}}</el-button>
		     		    <el-button @click="dataFormCancel()">返回</el-button>
			    </span>
	</el-dialog>
</template>
<script>
	
	import { clearCustomFail} from '@/api/api'

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
									id:this.row.id,//订单id
								}
								clearCustomFail(obj).then((res) => {
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
				this.$parent.clearancFailureVisible = false;
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
