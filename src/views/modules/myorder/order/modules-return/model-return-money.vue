<template>
	<el-dialog
	 	    class="model-add-edit-data"
		    title="请选择售后原因"
		    :close-on-click-modal="false"
		    :visible.sync="visible"
			width="35%"
			:before-close="closeDialog">
		    	<!-- <h3 v-if="this.row.isAgree==1">同意退款将直接退款给用户，请确认退货商品已收到?</h3>
				<h3 v-else>拒绝退款将取消该售后单，请确认已于用户达成一致?</h3> -->
				<el-form
					:model="dataForm"
					:rules="dataRule"
					ref="addForm"
					@keyup.enter.native="dataFormSubmit('addForm')"
					label-width="120px"
				>
					<el-form-item label="售后原因：" prop="aftersaleReasonId">
						<el-select
							v-model="dataForm.aftersaleReasonId"
							placeholder="请选择售后原因"
							loading-text="加载中···"
							>
						<el-option
							v-for="item in returnrReasonlist"
							:key="item.id"
							:label="item.content"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
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
	
	import { returnReimburse, aftersaleReturnrReason } from '@/api/api'

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
                dataForm:{
					aftersaleReasonId:""
				},
				returnrReasonlist:[],
				dataRule : {
                    aftersaleReasonId : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ]
                },
			}
		},
		components:{
		},
		created() {
			this.getReason();
		},
		computed:{},
		mounted(){},
		methods:{
			init (row) {
				this.visible = true;
				this.row = row;
			},
			// 获取退换货原因
            getReason(){
                aftersaleReturnrReason().then((res)=>{
                    if(res.code==200){
                        this.returnrReasonlist = res.data;
                    }
                })
            },
			// 提交
			dataFormSubmit(formName){
				// this.$refs[formName].validate((valid) => {
						// if (valid) {
								this.loading = true;
								var obj=  {
									isAgree:this.row.isAgree,//退款类型 1同意退款 0决绝退款
									aftersaleSn:this.row.aftersaleSn,//物流单号
									aftersaleReasonId:this.dataForm.aftersaleReasonId //退货原因id
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
 /deep/ .el-form-item__content{
        margin-left: 0!important;
    }
</style>
