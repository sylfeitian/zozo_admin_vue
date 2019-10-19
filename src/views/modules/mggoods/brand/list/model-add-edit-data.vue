<template>
	<el-dialog
	 	    class="model-add-edit-data"
		    :title="title"
		    :close-on-click-modal="false"
		    :visible.sync="visible"
				:before-close="closeDialog">
		    	<el-form
		    		:model="dataForm"
		    		:rules="dataRule"
		    		ref="addForm"
		    		@keyup.enter.native="dataFormSubmit('addForm')"
		    		label-width="120px">
				        <el-form-item label="品牌名称：" prop="brandName">
				        	  <el-input v-model.trim="dataForm.brandName" maxlength="60" placeholder="请输入品牌名称"></el-input>
				        </el-form-item>
								<el-form-item label="品牌英文名称：" >
				        	  <el-input v-model.trim="dataForm.brandNameEn" maxlength="60" placeholder="请输入品牌英文名称"></el-input>
				        </el-form-item>

								<!-- <h3 class="attrList">添加属性值:</h3> -->
								<el-form-item label="品牌图片：" prop="brandPic">
										<div class="pcCoverUrl imgUrl">
											<!-- :aspectRatio="1 / 1" -->
												<img-cropper
														ref="cropperImg1"
														:index="'1'"
														:imgWidth='"100px"'
														:imgHeight='"100px"'
														@GiftUrlHandle="GiftUrlHandle"
												></img-cropper>
										</div>
								</el-form-item>
					</el-form>
			    <span slot="footer" class="dialog-footer">
		     		    <el-button  @click="dataFormCancel()">返回</el-button>
		     		    <el-button type="primary" @click="dataFormSubmit('addForm')"
		     		    :loading="loading">{{loading ? "提交中···" : "提交"}}</el-button>
			    </span>
	</el-dialog>
</template>
<script>
    // import { livemembertype_add } from '@/api/api2'
	
		import { addBrand,backScanBrand,updateBrand } from '@/api/api'
    // import { isNum,isIntNum} from '@/utils/validate'
		import cloneDeep from 'lodash/cloneDeep'
			import { uploadPicBase64 } from '@/api/api'
    import imgCropper from "@/components/model-photo-cropper";

	export default{
		name: "model-add-edit-data",
		data(){
			 //数字
	        var validateNum = (rule, value, callback) => {
		        if (!isIntNum(value)) {
		          callback(new Error('请输入正确的天数'))
		        } else {
		          callback()
		        }
	        }
			return{
				visible : false,
				loading : false,
				 dialogImageUrl: '',
        dialogVisible: false,
				dataForm : {
					brandName: "",
					brandNameEn: "",
					brandPic:'',
				},
				dataRule : {
			        brandName : [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
			        ],
							brandNameEn: [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
							],
							brandPic: [
			          // { required: true, message: '必填项不能为空', trigger: 'blur' },
							],
				},
				title:'',
				row:"",
			}
		},
		components:{
			imgCropper,
		},
		computed:{},
		mounted(){},
		methods:{
			init (row) {
				this.visible = true;
				this.row = row;
				if(row){
					this.title="编辑商品品牌";
					this.backScan();
				}else{
					this.title="新建商品品牌"
				
				}
				this.$nextTick(() => {
						this.$refs['addForm'].resetFields();
						// this.getApplyPullList();
				})
			},
			// 编辑回显
			backScan(){
				  var obj  = {
							id:this.row.id
					}
					backScanBrand(obj).then((res)=>{
							if(res.code == 200){
									Object.assign(this.dataForm,res.data);
									this.$nextTick(()=>{
										if(this.$refs.cropperImg1){
											console.log(this.$refs.cropperImg1	);
											this.$refs.cropperImg1.cropper.imgShow  = true
											this.$refs.cropperImg1.cropper.cropImg  = this.dataForm.brandPic
										}
									})
							}else{

							}
					})
			},
		  //上传图片
			uploadPic(base64){
				const params = { "imgStr": base64 };
				const that = this;
				this.uploading = true;
				return new Promise(function(resolve){
					uploadPicBase64(params).then(res =>{
						that.uploading = false
						if(res && res.code == "200"){
							var url = res.data.url
							that.dataForm.brandPic = url;
							// that.currentIndex = -1;//不能这样写，防止网络延迟
							resolve("true")
						}else {
							// that.currentIndex = -1;//不能这样写，防止网络延迟
							resolve("false")
						}
					})
				});
			},
			// 提交
			dataFormSubmit(formName){
				if(this.uploading){
					this.$message({
						message: "正在上传图片，请稍后提交",
						type: 'warning',
						duration: 1500,
					})
					return;
				}
				// alert([this.dataForm.name,this.dataForm.domainAddress]);
				// console.log(this.dataForm);
				this.$refs[formName].validate((valid) => {
						if (valid) {
								this.loading = true;
								var obj={
										"brandInitials": this.dataForm.brandNameEn.split("")[0],
										"brandName": this.dataForm.brandName,
										"brandNameEn": this.dataForm.brandNameEn,
										"brandPic":this.dataForm.brandPic,
										// "brandValueDTOList": this.dataForm.brandValueDTOList,
										// "brandApply": 0,
										// "brandSort": 0,
										// "storeId": 0
								}
 
								if(this.row) obj.id = this.row.id
								var fn = this.row?updateBrand:addBrand;
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
						} else {
								//console.log('error 添加失败!!');
								return false;
						}
				})
			},
			dataFormCancel(){
					this.visible = false;
					this.closeDialog();
			},
			GiftUrlHandle(val){
				console.log("base64上传图片接口");
				console.log(val);
				this.uploadPic(val);
			},
			closeDialog() {
				console.log("关闭窗口");
        this.$parent.addEditDataVisible = false;
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
 
</style>
