<template>
	<!--新增的弹窗-->
	<div>
	<el-dialog title="新增分类" :visible="showListVisible" width="50%" :before-close="handleClose">
			<el-form :model="dataForm" label-width="140px" 	:rules="dataRule" class="demo-ruleForm" ref="addForm">
			<el-form-item v-if='dataForm.parentname' label="上级分类：" prop="gcName">
				<el-input v-model="dataForm.parentname" type="text" :disabled="true" placeholder="dataForm.parentname" show-word-limit style="width:400px;"></el-input>
			</el-form-item>
			<el-form-item v-else label="上级分类：">  
				<el-select
					v-model="dataForm.parentId"
					placeholder="请选择"
					loading-text="加载中···"
					@change="actselectchange">
					<el-option
						v-for="item in goodKindList1"
						:key="item.id"
						:label="item.name"
						:value="item.id">
					</el-option>
				</el-select>
				</el-form-item>
			<el-form-item label="分类名称：" prop="name">
				<el-input v-model="dataForm.name " type="text" placeholder="请输入10个汉字/20个字符以内的内容" style="width:400px;"></el-input>
			</el-form-item>
			<el-form-item label="排序：" prop="sort">
				<el-input v-model="dataForm.sort" type="text" placeholder="0-255(数字越大越靠前)" show-word-limit style="width:200px;"></el-input>
			</el-form-item>
			
			<el-form-item label="评价类型：" prop="appraisal" v-if="erjishow">
				<el-input v-model="dataForm.appraisal" type="text" placeholder="请输入6字以内的内容" style="width:400px;"></el-input>
			</el-form-item>
			<el-form-item v-if="yijishow" prop="categoryJpId" v-for="(item, index) in dataForm.categoryJpId" :key="index" :label="index == 0 ? '关联日本分类：' : '' ">
				<el-select
				v-model="dataForm.categoryJpId[index]"
				placeholder="请选择"
				loading-text="加载中···"
				@change ='actdatacategory'>
				<el-option
					v-for="item in goodKindList2"
					:key="item.id"
					:label="item.name || item.nameJp"
					:value="item.id">
				</el-option>
				</el-select>
				<el-button v-if="index+1 == dataForm.categoryJpId.length" @click="actadd" type="primary" style="margin-left: 20px;">添加</el-button>
			</el-form-item>
			
			<el-form-item label="测量方法：" prop="methodUrl" v-if="yijishow">
				<div class="pcCoverUrl imgUrl" v-for="(item,index) in dataForm.methodUrlshow" @click="imgtype = 'rule'">
					<img-cropper
						ref="cropperImg1"
						:index="index"
						:imgWidth='"100px"'
						:imgHeight='"100px"'
						:cropImg = "item"
						@GiftUrlHandle="GiftUrlHandle"
					></img-cropper>
				</div>
			</el-form-item>
			
			<el-form-item label="分类性别：" prop="genderMain"   v-if="yijishow">
				<div class="pcCoverUrl imgUrl"  @click="imgtype = 'all'" style="display: flex;">
					<div class="artmwc artall">全部</div>
					<img-cropper
						ref="cropperImg1"
						:index="'1'"
						:imgWidth='"100px"'
						:imgHeight='"100px"'
						@GiftUrlHandle="GiftUrlHandle"
					></img-cropper>
				</div>
			</el-form-item>
			
			
			<el-form-item label=""  v-if="yijishow">
				<el-checkbox-group v-model="checkList">
					<div class="artmwc">
						<el-checkbox label="男士" ></el-checkbox>
						<div v-if="checkList.indexOf('男士') != -1" class="pcCoverUrl imgUrl"  @click="imgtype = 'm'">
							<img-cropper
								ref="cropperImg1"
								:index="'1'"
								:imgWidth='"100px"'
								:imgHeight='"100px"'
								@GiftUrlHandle="GiftUrlHandle"
							></img-cropper>
						</div>
						<div v-else class="artuploadimg">上传图片</div>
					</div>
					<div class="artmwc">
						<el-checkbox label="女士"></el-checkbox>
						<div v-if="checkList.indexOf('女士') != -1" class="pcCoverUrl imgUrl"  @click="imgtype = 'w'">
							<img-cropper
								ref="cropperImg1"
								:index="'1'"
								:imgWidth='"100px"'
								:imgHeight='"100px"'
								@GiftUrlHandle="GiftUrlHandle"
							></img-cropper>
						</div>
						<div  v-else  class="artuploadimg">上传图片</div>
					</div>
					<div class="artmwc">
						<el-checkbox label="儿童"></el-checkbox>
						<div v-if="checkList.indexOf('儿童') != -1"  class="pcCoverUrl imgUrl"  @click="imgtype = 'c'">
							<img-cropper
								ref="cropperImg1"
								:index="'1'"
								:imgWidth='"100px"'
								:imgHeight='"100px"'
								@GiftUrlHandle="GiftUrlHandle"
							></img-cropper>
						</div>
						<div  v-else class="artuploadimg">上传图片</div>
					</div>
				</el-checkbox-group>
    		
    		</el-form-item>
		</el-form>

		<span slot="footer" class="dialog-footer">
            <el-button @click="closeadd">取消</el-button>
            <el-button type="primary" @click="actuploaddata('addForm')">{{saveLoading?'提交中...':'确 定'}}</el-button>
        </span>
	</el-dialog>
	</div>
</template>

<script>
	import cloneDeep from 'lodash/cloneDeep'
	import imgCropper from "@/components/model-photo-cropper";
	import { categoryCn,searchCategoryJp,uploadPicBase64 ,updataCategoryCn,categoryCnVerifyName} from '@/api/api'   //查询一级分类   查询日本分类  图片   提交
	export default {
	  data() {
	    var checkName = (rule, value, callback) => {
					// 校验中国分类名称是否重复
					if(value){
						var obj={name:value, parentId:0}
						if(this.dataForm.parentId !==0){ //不是一级分类时
							obj.parentId=this.dataForm.parentId
						}
						categoryCnVerifyName(obj).then((res)=>{
							if(res.code == 200){
								callback();
							}else{
								callback(new Error(res.msg));
							}
						})
					}
	    };
	    var sortminmax = (rule, value, callback) => {
	    	if(value >= 0 && value < 255){
	    		callback();
	    	}else{
	    		callback('排序值在0-255之间');
	    	}
		};
		var validateCategoryJpId = (rule, value, callback) => {
	    	if(value.length==1 && value[0]==""){
	    		callback('至少关联一个日本分类');
	    	}else{
	    		callback();
	    	}
		};
		var validateAppraisal = (rule, value, callback) => {
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < value.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(value[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                }
			var count = chineseCount + characterCount;
			if (count < 4 ) {
				// return callback(new Error('aaa'))
				return callback('至少输入2个字，对应4个字符的内容');
			}else{
				return callback()
			}
		};
	    return {
			saveLoading:false,
            fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
                {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
            // loading:false,
	    	erjishow: true,  //二级没有评价类型
	    	yijishow: true,  //一级不用上传图片
//	    	selectdisabled: false, //是否可以选择一级分类
	    	imgtype:'',  //img的类型
	    	checkList:[],  //分类性别多选
	        datacategory: '', //选择分类
	        showListVisible:true,
	        goodKindList1: [{ id: '0', name: "无" }],
	        goodKindList2: [],
	        dataArray:[],
	        dataForm:{   
	        	parentId:'0', //父级分类id
	        	name:'', //分类名称
	        	sort:'', //排序
		      	categoryJpId:[''],  //关联的日方分类id  
		      	appraisal:'', //评价类型
		      	methodUrlshow:[''], //测试方法  不传
		      	methodUrl:[], //测试方法  传
		      	genderMain:'' , //分类主图
		      	genderMr:'', //分类男士图片 
		      	genderMrs:'', //分类女士图片 
		      	genderKid:'', //分类儿童图片 
		      },
	      	dataRule : {
	        	name : [
	            	{ required: true, message: '必填项不能为空', trigger: 'blur' },
	            	{ validator: checkName,trigger: 'blur' }
	        	],
	        	sort: [
         			{ required: true, message: '必填项不能为空', trigger: 'blur' },
         			{ validator: sortminmax,trigger: 'blur'},
				],
				categoryJpId:[
					{ required: true, message: '必填项不能为空', trigger: 'blur' },
					{ validator: validateCategoryJpId,trigger: 'blur'},
				],
				methodUrl:[
					{ required: true, message: '必填项不能为空', trigger: 'blur' }
				],
	        	appraisal: [
	       			{ required: true, message: '必填项不能为空', trigger: 'blur' },
                    { validator: validateAppraisal,trigger: 'blur'},
				],
				genderMain: [
	       			{ required: true, message: '必填项不能为空', trigger: 'blur' },
				],
	     	},
	    };
	  },
	  components: {
	  	imgCropper,
	  },
		watch:{
			'dataForm.name':function(newV,oldV) {
				var chineseCount = 0,characterCount = 0;
				for (let i = 0; i < newV.length; i++) {
					if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
						chineseCount = chineseCount + 2;
					} else { //字符
						characterCount = characterCount + 1;
					}
					var count = chineseCount + characterCount;
					if (count > 20) { //输入字符大于20的时候过滤
						this.dataForm.name = newV.substr(0,(chineseCount/2+characterCount)-1)
					}
				}
			},
			// 评价类型
            'dataForm.appraisal':function(newV,oldV) {
			    if(newV){
                    var chineseCount = 0,characterCount = 0;
                    for (let i = 0; i < newV.length; i++) {
                        if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                            chineseCount = chineseCount + 2;
                        } else { //字符
                            characterCount = characterCount + 1;
                        }
                        var count = chineseCount + characterCount;
                        if (count > 12) { //输入字符大于12的时候过滤
                            this.dataForm.appraisal = newV.substr(0,(chineseCount/2+characterCount)-1)
                        }
                    }
                }
			}
			},
			created () {
	  },
	  methods: {
	  	init(row){
			this.showListVisible = true;
			this.saveLoading = false;
	  		this.$nextTick(()=>{
				if(row){
					this.dataForm.parentId = row.id;
				}
				// this.loading =  true;
				Promise.all([
					this.getGoodKindList1(),
					this.getCategoryJp()
				]).then(() => {
					// this.loading = false
				})
			   this.actselectchange();
			})
		},
	 	 // 获取一级分类列表
		getGoodKindList1(){
			return categoryCn().then((res)=>{
	  			if(res.code == 200){
	  				console.log(res.data);
	  				res.data.forEach((item)=>{
	  					this.goodKindList1.push(item);
	  				})
//	  				this.goodKindList1.concat(res.data);
	  				console.log(this.goodKindList1);
	  			}else{
	  				this.$message(res.msg);
	  			}
	  		}).catch(()=>{
	  			this.$message("服务器错误");
	  		})
		},
		// 获取日本分类列表
		getCategoryJp(){
			return searchCategoryJp().then((res)=>{
	  			if(res.code == 200){
	  				console.log(res.data);
	  				res.data.forEach((item)=>{
	  					this.goodKindList2.push(item);
	  				})
	  			}else{
	  				this.$message(res.msg);
	  			}
	  		}).catch(()=>{
	  			this.$message("服务器错误");
	  		})
		},
		//  判断是否是一级，啦显示不同的选项
		actselectchange(){
	  		if(this.dataForm.parentId == 0){   //添加一级
	  			this.erjishow = true;
	  			this.yijishow = false;
	  			this.dataForm.appraisal = null;  //一级没有评价类型
	  		}else{
	  			this.erjishow = false;
				this.yijishow = true;
			} 

			// 防止切换分类时候，导致空白图片变多
			// this.dataForm.methodUrlshow= [""];
		  },
		//   提交
		actuploaddata(formName){  //确定提交 
			if(this.saveLoading){
				return;
			} 
		  	// if(this.yijishow && this.dataForm.methodUrlshow.length==0){
			// 	this.$message("测量方法至少上传一张图片");
			// 	return
			// }
			// 处理"测试方法"数据
			// var methodUrlshow = this.dataForm.methodUrlshow.filter((item,index)=>{
			// 	return  item;
			// })
			// 	this.dataForm.methodUrl = JSON.stringify(methodUrlshow);
		
			// var categoryJpId = this.dataForm.categoryJpId.filter((item,index)=>{
			// 	return  item;
			// })
		
			//  this.dataForm.categoryJpId = categoryJpId;
			var methodUrlshow = cloneDeep(this.dataForm.methodUrlshow);
	 		if(typeof methodUrlshow =="string"){
				methodUrlshow = JSON.parse(methodUrlshow);
			} 
			if(!methodUrlshow[methodUrlshow.length-1]){
				methodUrlshow.pop()
			}
			if(methodUrlshow.length){
				methodUrlshow.forEach((item)=>{
					if(item.indexOf(this.$imgDomain) != -1){
						item.substr(this.$imgDomain.length)
					}
				})
			}  
			// 测量尺寸是一个json
			this.dataForm.methodUrl = JSON.stringify(methodUrlshow);

			if(this.dataForm.methodUrl=="[]"){this.dataForm.methodUrl= ""}
			// if(this.dataForm.methodUrl=="[]"){this.dataForm.methodUrl= ""}
			  
	  		//处理男士/女士/儿童     是否传数据
	  		if(this.checkList.indexOf('男士') == -1){
	  			this.dataForm.genderMr = '';
	  		}else if(this.checkList.indexOf('女士') == -1){
	  			this.dataForm.genderMrs = '';
	  		}else if(this.checkList.indexOf('儿童') == -1){
	  			this.dataForm.genderKid = '';
			  }	
			console.log(this.dataForm);
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.saveLoading = true;
					var obj = {};
					Object.assign(obj,this.dataForm);
					if(obj.parentId=="0") obj.categoryJpId = [];
					updataCategoryCn(obj).then((res)=>{
						this.saveLoading = false;
						if(res.code == 200){
							console.log(res.data);
							this.$message.success(res.msg);
							this.closeadd();
						}else{
							this.$message(res.msg);
						}
					}).catch(()=>{
						this.$message("服务器错误");
					})
				} else {
					//console.log('error 添加失败!!');
					return false;
				}
			})
	  	},
	  	GiftUrlHandle(val,index){
			console.log("base64上传图片接口");
			console.log(val);
			this.uploadPic(val,index);
			// if(this.imgtype == 'rule'){
			// 	this.dataForm.methodUrlshow.push('');
			// }
		},
		//上传图片
		uploadPic(base64,_index){
			const params = { "imgStr": base64 };
			const that = this;
			this.uploading = true;
			return new Promise(function(resolve){
				uploadPicBase64(params).then(res =>{
					that.uploading = false
					if(res && res.code == "200"){
						var url = res.data.url
						if(that.imgtype == 'rule'){
							if(that.dataForm.methodUrlshow.length >= 10){
								this.$message("最多可上传10张图片");
								return;
							}
							let isAddImg = true;
							//过滤空的
							var methodUrlshow = []
							console.log(_index);
							console.log("_index")
							that.dataForm.methodUrlshow.forEach((item,index)=>{
									console.log([index==_index,that.dataForm.methodUrlshow.length-1!=_index]);
									if(index==_index && that.dataForm.methodUrlshow.length-1!=_index){
										isAddImg = false;
										item = url
									}
									if(item){
										methodUrlshow.push(item);
									}
							})
							// 追加新的
							console.log("新的");
							if(isAddImg){
								methodUrlshow.push(url);
							}
							// 追加最后一个展位
							methodUrlshow.push('');
							console.log(methodUrlshow);
							that.dataForm.methodUrlshow = [].concat(methodUrlshow)
						}else if(that.imgtype == 'all'){
							that.dataForm.genderMain = url;
						}else if(that.imgtype == 'm'){
							that.dataForm.genderMr = url;
						}else if(that.imgtype == 'w'){
							that.dataForm.genderMrs = url;
						}else if(that.imgtype == 'c'){
							that.dataForm.genderKid = url;
						}
						// that.currentIndex = -1;//不能这样写，防止网络延迟
						resolve("true")
					}else {
						this.$message.error(res.msg)
						// that.currentIndex = -1;//不能这样写，防止网络延迟
						resolve("false")
					}
				})
			});
		},
		//选择关联分类
		actdatacategory(last){
//			console.log(this.dataForm.categoryJpId);
//			console.log(last)
//			console.log(this.dataForm.categoryJpId.indexOf(last));
			if( this.dataForm.categoryJpId.indexOf(last) != this.dataForm.categoryJpId.length-1 ){   //有重复的
				this.dataForm.categoryJpId[this.dataForm.categoryJpId.length-1] = '';
				this.$message("该分类已经被选了,请选择其他分类")
			}else{    //没有重复的
				
			}
			
		},
		//新增一个关联分类
		actadd(){
			if(this.dataForm.categoryJpId[this.dataForm.categoryJpId.length-1]){
				this.dataForm.categoryJpId.push('');
			}else{
				this.$message("请选择分类")
			}
		},
		//新增关闭
	    handleClose(done) {
	  	    this.showListVisible = false;
	      this.$emit("addshow")
	    },
	    closeadd(){
	    	this.showListVisible = false;
	    	this.$emit("addshow")
	    },
	  }
	}
</script>

<style lang="scss" scoped>
/deep/ .pcCoverUrl {
	margin-right: 10px;
}

/deep/ .el-checkbox{
	// margin-left: 60px;
	display: block;
}
.artmwc{
	display: flex;
	margin: 10px;
	position: relative;
	/deep/ .pcCoverUrl{
		margin-left: 20px;
	/deep/	.artuploadimg{
			/*position: absolute;*/
			width: 100px;
			height: 30px;
		}
	}
}

.artall{
	// margin-left: 92px;
	margin-right: 23px;
}
.artuploadimg{
	/*position: absolute;*/
	margin-left: 30px;
	width: 100px;
	height: 30px;
	font-size: 16px;
}


</style>