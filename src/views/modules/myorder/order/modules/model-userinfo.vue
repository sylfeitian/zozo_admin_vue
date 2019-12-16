<template>
	<el-dialog
	 	    class="model-add-edit-data"
		    title="身份证信息"
		    :close-on-click-modal="false"
		    :visible.sync="visible"
			width="45%"
			:before-close="closeDialog">
		    	<el-form
				:inline="false"
		    		:model="dataForm"
		    		:rules="dataRule"
		    		ref="editForm"
		    		>
					
                        <el-form-item  label="真实姓名：" prop="memberRealName">
							<el-input placeholder="请输入内容"   v-model="dataForm.memberRealName"></el-input>
                        </el-form-item>
						
						<el-form-item  label="身份证号码：" prop="idCard">
							<el-input placeholder="请输入内容"   v-model="dataForm.idCard" maxlength="18"></el-input>
                        </el-form-item>

                        <el-form-item  label="身份证正反面：" >
							
							<div class="idCardWarp">
								<img :src="dataForm.idcartPositiveUrl | filterImgUrl" alt="">
								<img :src="dataForm.idcartReverseUrl | filterImgUrl" alt="" style="margin-left:10px;">
							</div>
                        </el-form-item>
				</el-form>
			    <span slot="footer" class="dialog-footer"  >
		     		    <el-button @click="dataFormCancel()">取消</el-button>
		     		    <el-button type="primary" @click="dataFormSubmit('editForm')"
		     		    :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
			    </span>
	</el-dialog>
</template>
<script>
	
	import { memberDeatilInfo,saveOrderAuthentication } from '@/api/api'

	export default{
		name: "model-add-edit-data",
		data(){
			return{
				visible : false,
				loading : false,
				dataForm : {
                    memberRealName:"",//真实姓名
					idCard:"",//身份证号
					idcartPositiveUrl: "",
					idcartReverseUrl: "",
				},
				dataRule : {
					memberRealName : [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
			        idCard : [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
				},
				title:'',
				orderBase:"",
				row:'',
			}
		},
		components:{
        },
		computed:{},
		mounted(){},
		methods:{
			init (orderBase,row) {
				this.visible = true;
				this.orderBase = orderBase;
				this.row = row;
				this.backScan();
			},
			backScan(){
				var obj  = {
                    params:{
                        memberId:this.orderBase.memberId,
                        orderId:this.orderBase.orderId,
                    }
                }
				memberDeatilInfo(obj).then((res)=>{
                    if(res.code==200){
                        this.dataForm = res.data;
                    }
                })
			},
			// 提交
			dataFormSubmit(formName){
				this.$refs[formName].validate((valid) => {
						if (valid) {
								
								var obj=  {
									"id": this.row.id,
									"identifyNum": this.dataForm.idCard,
									"userName": this.dataForm.memberRealName
								}
								this.loading = true;
								saveOrderAuthentication(obj).then((res) => {
									this.loading = false;
									// alert(JSON.stringify(res));
									let status = null;
									if(res.code == "200"){
										status = "success";
										this.visible = false;
										console.log(this.$parent,'------')
										this.$parent.$parent.getOrderDetail();
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
<style  lang="scss"  scoped>
 .attrList{
	 height: 60px;
	 line-height: 90px;
	 border-top: 2px dotted gainsboro;
	 padding-left: 16px;
 }
 .el-textarea{
	 width: 100%;
 }

 .idCardWarp{
	text-align: center;
	img{
		width:316px;
		height: 200px;
		margin-bottom: 10px;
		border: 1px solid #eae8e8;
	}
}
/deep/ .el-form-item__label{
	width:120px;
}
.el-form--inline .el-form-item{
	display: block;
}
.el-form-item{
	.el-input--default{
		width: 260px !important
	}
}
</style>
