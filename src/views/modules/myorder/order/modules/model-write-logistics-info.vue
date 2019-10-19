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
                         <el-form-item label="物流公司：" prop="companyId">
                            	<el-select
                                        v-model="dataForm.companyId"
                                        placeholder="请选择"
                                        loading-text="加载中···"
                                        @change="chooseCompany">
                                        <el-option
                                            v-for="item in companyopctions"
                                            :key="item.id"
                                            :label="item.companyName"
                                            :value="item.id">
                                        </el-option>
						        </el-select>
                        </el-form-item>
                        <el-form-item  label="物流单号："  prop="logisticsSn">
                            <el-input v-model.trim="dataForm.logisticsSn"
								placeholder="请输入物流单号" 
								clearable maxlength="30" 
								show-word-limit 
								@change="changeInput"  
								@input="changeInput">
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
	
	import { orderLogistics,logisticsCompany} from '@/api/api'

	export default{
		name: "model-add-edit-data",
		data(){
			return{
				visible : false,
				loading : false,
				dataForm : {
                    companyId:"",
					companyCode:"",//备注
					logisticsSn:'',
                },
                companyopctions:[
                    // {id:'1',companyName:'小白第一个公司'},
                    // {id:'2',companyName:'小白第二个公司'},
                    // {id:'3',companyName:'小白第三个公司'},
                ],
				dataRule : {
			        companyId : [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    logisticsSn : [
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
				this.getCompany();
			},
			getCompany(){
				logisticsCompany().then((res)=>{
					// if(res.code==200){
						this.companyopctions = res
					// }
				})
			},
            // 选择公司
            chooseCompany(val){
				// console.log(val);
				// var objItem = this.companyopctions.find((item,index)=>{
				// 	return item.id==val
				// })
				// // this.dataForm.companyId =val
				// this.dataForm.companyCode =objItem.companyCode
				
			},
			changeInput(){
				this.dataForm.logisticsSn = this.dataForm.logisticsSn.replace(/[^a-zA-Z0-9-]/g,"")
			},
			// 提交
			dataFormSubmit(formName){
				this.$refs[formName].validate((valid) => {
						if (valid) {
								this.loading = true;
								var obj=  {
									orderId:this.row.id,//订单id	
                                    companyId:this.dataForm.companyId,//物流公司id	
									// companyCode:this.dataForm.companyCode,//物流公司编号
									logisticsSn:this.dataForm.logisticsSn //物流单号
								}
								orderLogistics(obj).then((res) => {
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
				this.$parent.writeLogisticsInfoVisible = false;
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
 /deep/ .el-form-item__content{
     display: flex;
 }
</style>
