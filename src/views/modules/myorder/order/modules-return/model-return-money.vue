<template>
	<el-dialog
	 	    class="model-add-edit-data"
		    title="提示"
		    :close-on-click-modal="false"
		    :visible.sync="visible"
			width="35%"
				:before-close="closeDialog">
		    	<h3 v-if="this.row.isAgree==1">同意退款将直接退款给用户，请确认退货商品已收到?</h3>
				<h3 v-else>拒绝退款将取消该售后单，请确认已于用户达成一致?</h3>
			    <span slot="footer" class="dialog-footer"  >
		     		    <el-button @click="dataFormCancel()">取消</el-button>
		     		    <el-button type="primary" @click="dataFormSubmit('addForm')"
		     		    :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
			    </span>
	</el-dialog>
</template>
<script>
	
	import { returnReimburse} from '@/api/api'

	export default{
		name: "model-add-edit-data",
		data(){
			return{
				visible : false,
				loading : false,
				// dataForm : {
                //     operating:1,//操作 0不通过 1通过
                //     remarks:"",//备注
				// },
				// dataRule : {
			    //     operating : [
			    //       { required: true, message: '必填项不能为空', trigger: 'blur' },
                //     ],
                //     remarks : [
			    //       { required: true, message: '必填项不能为空', trigger: 'blur' },
			    //     ],
				// },
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
									isAgree:this.row.isAgree,//退款类型 1同意退款 0决绝退款
									aftersaleSn:this.row.aftersaleSn,//物流单号
								}
								returnReimburse(obj).then((res) => {
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
				this.$parent.returnMoneyVisible = false;
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
