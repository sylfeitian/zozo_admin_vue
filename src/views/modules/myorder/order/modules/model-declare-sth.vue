<template>
	<el-dialog
	 	    class="model-add-edit-data"
		    title="提示"
		    :close-on-click-modal="false"
		    :visible.sync="visible"
			width="35%"
				:before-close="closeDialog">
		    	<h3>是否确定申报</h3>
			    <span slot="footer" class="dialog-footer"  >
		     		    <el-button @click="dataFormCancel()">取消</el-button>
		     		    <el-button type="primary" @click="dataFormSubmit('addForm')"
		     		    :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
			    </span>
	</el-dialog>
</template>
<script>
	
	import { orderRedeclareJd,orderRedeclareLakala} from '@/api/api'

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
				type:'',//jd 申报失败重新申报；lakala 申报失败重新申报
			}
		},
		components:{
        },
		computed:{},
		mounted(){},
		methods:{
			init (row,type) {
				this.visible = true;
				this.row = row;
				this.type= type;
			},
			// 提交
			dataFormSubmit(formName){
				// this.$refs[formName].validate((valid) => {
						// if (valid) {
								this.loading = true;
								var obj=  {
									id:this.row.id,//物流单号
									orderId:this.row.id,//物流单号
								}
								var fn = this.type=="jd"?orderRedeclareJd:orderRedeclareLakala
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
				this.$parent.declareSthVisible = false;
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
