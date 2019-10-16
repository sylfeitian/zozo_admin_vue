<template>
	<el-dialog
	 	    class="model-add-edit-data"
		    title="审核"
		    :close-on-click-modal="false"
		    :visible.sync="visible"
			width="35%"
			:before-close="closeDialog">
				<h3 v-if="this.row.operating==1">请确认审核通过?</h3>
				<h3 v-else>请确认审核不通过?</h3>
                <!-- <p style="color:red">请确认已与用户沟通达成一致</p> -->
			    <span slot="footer" class="dialog-footer"  >
		     		    <el-button @click="dataFormCancel()">取消</el-button>
		     		    <el-button type="primary" @click="dataFormSubmit('addForm')"
		     		    :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
			    </span>
	</el-dialog>
</template>
<script>
	
	import { aftersaleReturnVerify} from '@/api/api'

	export default{
		name: "model-add-edit-data",
		data(){
			return{
				visible : false,
				loading : false,
				// dataForm : {
                //     operating:"1",//操作 0不通过 1通过
                //     remarks:"",//备注
				// },
				// dataRule : {
			    //     operating : [
			    //       { required: true, message: '必填项不能为空', trigger: 'blur' },
                //     ],
                //     // remarks : [
			    //     //   { required: true, message: '必填项不能为空', trigger: 'blur' },
			    //     // ],
				// },
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
				console.log(this.row)
			},
			// 提交
			dataFormSubmit(formName){
				// this.$refs[formName].validate((valid) => {
				// 		if (valid) {
								this.loading = true;
								var obj=  {
									"aftersaleSn": this.row.aftersaleSn,//售后单号 ,
									"operating": this.row.operating,//操作 0不通过 1通过 ,
									"realRefundAmount": this.row.realRefundAmount,//实际退款金额 ,
									"remark": this.row.remark,//处理备注 
									// "warehouseId": this.row.warehouseId//退货仓id
								}
								if(this.row.operating==1 && !this.row.warehouseId){
									this.$message.warning("缺少退货仓，不能审核通过!");
									return;
								}
								obj.warehouseId = this.row.warehouseId//退货仓id
							
								aftersaleReturnVerify(obj).then((res) => {
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
				this.$emit('searchDataList');
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
