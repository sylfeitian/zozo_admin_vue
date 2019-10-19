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
				        <el-form-item label="规格名称：" prop="specName">
				        	  <el-input v-model.trim="dataForm.specName" maxlength="60" placeholder="请输入规格名称"></el-input>
				        </el-form-item>


								<!-- <h3 class="attrList">添加属性值:</h3> -->
						<div  v-for="(item,index) in dataForm.specValueDTOList"  :key="index">
							<el-form-item label="规格值：" :prop="'specValue'+index">
								<el-input v-model.trim="dataForm['specValue'+index]" placeholder="规格值" class="sepcInput" @input="changeSpec(index)" @change="changeSpec(index)"></el-input>
								<el-button type="danger" plain @click="removeSpec(index)" v-if="index!=0">删除</el-button>
							</el-form-item>
							<el-form-item  label="规格图片：" >
									<div class="pcCoverUrl imgUrl" @click="changeCurrentIndex(index)">
										<!-- :aspectRatio="1 / 1" -->
										<img-cropper
											ref="cropperImg"
											:index="'1'"
											:imgWidth='"100px"'
											:imgHeight='"100px"'
											@GiftUrlHandle="GiftUrlHandle"
										></img-cropper>
									</div>
							</el-form-item>
						</div>
								
						<el-form-item>
							<el-button   @click="appendSpec()" type="primary">添加规格值</el-button>
						</el-form-item>
					</el-form>
			    <span slot="footer" class="dialog-footer">
		     		    <el-button @click="dataFormCancel()">返回</el-button>
		     		    <el-button type="primary" @click="dataFormSubmit('addForm')"
		     		    :loading="loading">{{loading ? "提交中···" : "提交"}}</el-button>
			    </span>
	</el-dialog>
</template>
<script>
    // import { livemembertype_add } from '@/api/api2'
	
		import { addSpec,backScanSpec,updateSpec } from '@/api/api'
    // import { isNum,isIntNum} from '@/utils/validate'
		import cloneDeep from 'lodash/cloneDeep'
		
	import imgCropper from "@/components/model-photo-cropper";
	 import { uploadPicBase64 } from '@/api/api'
import { stat } from 'fs';

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
				uploading:false,
				currentIndex:-1,
				dialogImageUrl: '',
				dialogVisible: false,
				dataForm : {
					specName: "",
					specValueDTOList:[],
					// 测试发现如果不在下面添加 input输入不进去（代码动态添加也不行）
					specValue0:"",
					specValue1:"",
					specValue2:"",
					specValue3:"",
					specValue4:"",
					specValue5:"",
					specValue6:"",
					specValue7:"",
					specValue8:"",
					specValue9:"",
					specValue10:"",
					specValue11:"",
					specValue12:"",
					specValue13:"",
					specValue14:"",
					specValue15:"",
					specValue16:"",
					specValue17:"",
					specValue18:"",
					specValue19:"",
					specValue20:"",
				},
				specValueDTOItem:	{
						specValueImage:'',
						specValueName:'',
				},
				dataRule : {
			        specName : [
			          { required: true, message: '必填项不能为空', trigger: 'blur' },
			        ],
							// attrValueName: [
			        //   { required: true, message: '必填项不能为空', trigger: 'blur' },
							// ],
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
					this.title="编辑商品规格";
					this.backScan();
				}else{
					this.title="新建商品规格"
					this.dataForm.specValueDTOList = new  Array();
					this.dataForm.specValueDTOList.push(this.specValueDTOItem);
					this.addDataRule();
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
					backScanSpec(obj).then((res)=>{
							if(res.code == 200){
									Object.assign(this.dataForm,res.data);
									// 属性单独处理回显
									res.data.specValueDTOList.forEach((item,index)=>{
										this.dataForm["specValue"+index] = item.specValueName;
										this.$nextTick(()=>{
											if(this.$refs.cropperImg[index]){
												this.$refs.cropperImg[index].cropper.imgShow = true;
												this.$refs.cropperImg[index].cropper.cropImg = item.specValueImage;
											}
										})
									})
									this.addDataRule();
							}else{

							}
					})
			},
			removeSpec(index){
				 this.dataForm.specValueDTOList.splice(index,1);
				 this.dataForm.specValueDTOList.forEach((item,index)=>{
						 this.dataForm["specValue"+index] = item.specValueName
						 this.$nextTick(()=>{
							if(this.$refs.cropperImg[index]){
								this.$refs.cropperImg[index].cropper.imgShow = true;
								this.$refs.cropperImg[index].cropper.cropImg = item.specValueImage;
							}
						})
				 })		
			},
			// 追加属性
			appendSpec(){
					// var len = this.dataForm.specValueDTOList.length;
					this.dataForm.specValueDTOList.push(cloneDeep(this.specValueDTOItem));
					this.addDataRule();
			},
			// 改变属性值时
			changeSpec(index){
					console.log(this.dataForm);
					this.dataForm.specValueDTOList[index].specValueName = cloneDeep(this.dataForm['specValue'+index]) ;
			},
			// 添加必选项星星
			addDataRule(){
					this.dataForm.specValueDTOList.forEach((item,index)=>{
						   this.dataRule["specValue"+index] =  [{ required: true, message: '必填项不能为空', trigger: 'blur' } ]
					})
					console.log("验证规则:");
					console.log(this.dataRule);
			},
			changeCurrentIndex(index){
				this.currentIndex  = index;
			},
			  //上传图片
			uploadPic(base64){
				if(this.currentIndex == -1){
					alert("前端未捕捉到图片的下标,请重新点击上传!");
					return;
				}
				const params = { "imgStr": base64 };
				const that = this;
				this.uploading = true;
				return new Promise(function(resolve){
					uploadPicBase64(params).then(res =>{
						that.uploading = false
						let status = ""
						if(res && res.code == "200"){
							var url = res.data.url
							that.dataForm.specValueDTOList[that.currentIndex].specValueImage = url;
							// that.currentIndex = -1;//不能这样写，防止网络延迟
							status="success"
							resolve("true")
						}else {
							// that.currentIndex = -1;//不能这样写，防止网络延迟
							status = "error";
							resolve("false")
						}
						that.$message({
							 message: res.msg,
							type: status,
							duration: 500,
						})
					})
				});
			},
		
			// 提交
			dataFormSubmit(formName){
				// alert([this.dataForm.name,this.dataForm.domainAddress]);
				// console.log(this.dataForm);
				if(this.uploading){
					this.$message({
						message: "正在上传图片，请稍后提交",
						type: 'warning',
						duration: 1500,
					})
					return;
				}
				// console.log(this.dataForm.specValueDTOList)
				for(var i=0;i<this.dataForm.specValueDTOList.length;i++){
					for(var j=i+1;j<this.dataForm.specValueDTOList.length;j++){
							console.log([i,j,this.dataForm.specValueDTOList[i].specValueName,this.dataForm.specValueDTOList[j].specValueName])
							if(this.dataForm.specValueDTOList[i].specValueName == this.dataForm.specValueDTOList[j].specValueName ){
								this.$message({
									message: "规格名字不能有重复",
									type: 'warning',
									duration: 1500,
								})
								return
							}
					}
				}
				
				this.$refs[formName].validate((valid) => {
						if (valid) {
								this.loading = true;
								var obj={
									"specName": this.dataForm.specName,
									"specValueDTOList": this.dataForm.specValueDTOList
								}
								if(this.row) obj.id = this.row.id
								var fn = this.row?updateSpec:addSpec;
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
 .sepcInput{
	width: 60%;
    margin-right: 20px;
 }
/deep/.upload-box{
	border: 1px solid #ffffff !important;
}
</style>
