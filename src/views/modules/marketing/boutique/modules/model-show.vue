<template>
	<el-dialog
	 	    class="model-add-edit-data"
		    title="提示"
		    :close-on-click-modal="false"
		    :visible.sync="visible"
			width="35%"
			append-to-body
			:before-close="closeDialog">
		    	<h3 style="text-align:center;">是否选择全部?</h3>
                <!-- <p style="color:red">请确认已与用户沟通达成一致</p> -->
			    <span slot="footer" class="dialog-footer"  >
		     		    <el-button @click="dataFormCancel()">取消</el-button>
		     		    <el-button type="primary" @click="dataFormSubmit('addForm')"
		     		    :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
			    </span>
	</el-dialog>
</template>
<script>
	
	import { orderRetry} from '@/api/api'

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
				dataRule : {
			        // operating : [
			        //   { required: true, message: '必填项不能为空', trigger: 'blur' },
                    // ],
                    // remarks : [
			        //   { required: true, message: '必填项不能为空', trigger: 'blur' },
			        // ],
				},
				orderBase:'',
				title:'',
				row:'',
			}
		},
		props:{
			dataForm: {}
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
						// if (valid) {
								this.loading = true;
								var obj=  {
                                    // goodsId:this.row.goodsId, // 商品货号
                                    // goodsName:this.row.goodsName, // 商品名称
                                    // storeI:this.row.storeI, // 店铺名称
                                    // brandI:this.row.brandI, // 品牌名称
                                    // categoryId:this.row.categoryId, // 选择分类
                                    // isDiscount:this.row.isDiscount, // 是否折扣
                                    // discountPriceStart:this.row.discountPriceStart, // 促销价
                                    // discountPriceEn:this.row.discountPriceEnd, // 促销价
                                    // discountRateStart:this.row.discountRateStart, // 折扣率
                                    // discountRateEn:this.row.discountRateEnd, // 折扣率
                                    // stockQuantityStart:this.row.stockQuantityStart, // 本地库存
                                    // stockQuantityeEn:this.row.stockQuantityeEnd, // 本地库存
                                    // madeIn:this.row.madeIn, // 产地
                                    // fuzzySearch:this.row.fuzzySearch, // 模糊查询
                                    // gender:this.row.gender, // 性别
                                    // categoryMore:this.row.categoryMore, // 多分类
                                    // stockQuantityStart:this.row.stockQuantityStart, // 本地库存
                                    // stockQuantityeEn:this.row.stockQuantityeEnd, // 本地库存
									// orderId:this.row.id,//订单id
									"activityId": this.row.id,// 活动ID ,
                            		"categoryName": this.row.title,//精选分类名称 ,
									...this.dataForm,
								}
								orderRetry(obj).then((res) => {
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
