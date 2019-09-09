<template>
	<!--新增的弹窗-->
		<el-dialog title="编辑分类" :visible.sync="showListVisible" width="50%" :before-close="handleClose">
			<el-form :model="dataForm" label-width="140px" 	:rules="dataRule" class="demo-ruleForm" ref="editForm">
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
            <el-input v-model="dataForm.name " type="text" placeholder="请输入4个汉字/8个字符以内的内容" show-word-limit style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
            <el-input v-model="dataForm.sort" type="text" placeholder="0-255" show-word-limit style="width:200px;"></el-input>
        		<div class="grey">(数字越小越靠前)</div>
        </el-form-item>
        <el-form-item v-if="yijishow" v-for="(item, index) in dataForm.categoryJpId" :key="index" :label="index == 0 ? '关联日本分类：' : '' ">
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
		 
	 	<el-form-item label="评价类型：" prop="appraisal" v-if="erjishow">
	        <el-input v-model="dataForm.appraisal" type="text" maxlength="6" placeholder="请输入6字以内的内容" show-word-limit style="width:400px;"></el-input>
	    </el-form-item>
    
    
    	<el-form-item label="测量方法：" prop="methodUrlshow" v-if="yijishow">
			<div class="pcCoverUrl imgUrl" v-for="(item,index) in dataForm.methodUrlshow" @click="imgtype = 'rule'">
				<img-cropper
					ref="cropperImg1"
					:cropImg = "item"
					:index="'1'"
					:imgWidth='"100px"'
					:imgHeight='"100px"'
					@GiftUrlHandle="GiftUrlHandle"
				></img-cropper>
			</div>
		</el-form-item>
		
    	<el-form-item label="分类性别：" prop=""  v-if="yijishow">
    		<div class="pcCoverUrl imgUrl"  @click="imgtype = 'all'" style="display: flex;">
    			<div class="artmwc artall">全部</div>
				<img-cropper
					ref="cropperImg1"
					:index="'1'"
					:cropImg = "dataForm.genderMain"
					:imgWidth='"100px"'
					:imgHeight='"100px"'
					@GiftUrlHandle="GiftUrlHandle"
				></img-cropper>
			</div>
    	</el-form-item>
    	
    	
    	<el-form-item label="" prop=""  v-if="yijishow">
    		<el-checkbox-group v-model="checkList">
    			<div class="artmwc">
    				<el-checkbox label="男士" ></el-checkbox>
    				<div v-if="checkList.indexOf('男士') != -1" class="pcCoverUrl imgUrl"  @click="imgtype = 'm'">
						<img-cropper
							ref="cropperImg1"
							:index="'1'"
							:cropImg = "dataForm.genderMr"
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
							:cropImg = "dataForm.genderMrs"
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
							:cropImg = "dataForm.genderKid"
							:imgHeight='"100px"'
							@GiftUrlHandle="GiftUrlHandle"
						></img-cropper>
					</div>
					<div  v-else class="artuploadimg">上传图片</div>
    			</div>
			</el-checkbox-group>
    		
    	</el-form-item>
	</el-form>
		  	
	  <span slot="footer" class="dialog-footer artFooter">
	    <el-button @click="closeadd" style="margin-right: 20px;">取 消</el-button>
	    <el-button type="primary" @click="actuploaddata('editForm')">确 定</el-button>
	  </span>
</el-dialog>

</template>

<script>
	import imgCropper from "@/components/model-photo-cropper";
	//查询一级分类   查询日本分类  图片   提交   编辑查询回显
	import { categoryCn,searchCategoryJp,uploadPicBase64 ,updataCategoryCn ,backScanCategoryCn} from '@/api/api'  
	export default {
	  data() {
	  	//这里就是整个checkName啦，就是方法一的使用
	    var checkName = (rule, value, callback) => {
	            var len = 0;  
	            for (var i=0; i<value.length; i++) {   
	                var c = value.charCodeAt(i);   
	                //单字节加1   
	                if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
	                    len++;   
	                } else {   
	                    len+=2;   
	                }   
	            };   
	            if (len = 0 || len > 8) {
	                //重点重点，下面就是填写提示的文字
	                callback(new Error('名称长度不超过8个字符，一个中文字等于2个字符。'));
	            } else {
	                callback();
	            }
	    };
	    var sortminmax = (rule, value, callback) => {
	    	if(value >= 0 && value < 255){
	    		callback();
	    	}else{
	    		callback('排序值在0-255之间');
	    	}
	    };
	    return {
	    	erjishow: true,  //二级没有评价类型
	    	yijishow: true,  //一级不用上传图片
	    	imgtype:'',  //img的类型
	    	checkList:[],  //分类性别多选
	        datacategory: '', //选择分类
	        showListVisible:true,
	        goodKindList1: [{ id: '0', name: "无" }],
	        goodKindList2: [],
	        dataArray:[],
	        dataForm:{     
	        	parentId:'', //父级分类id
	        	name:'', //分类名称
	        	sort:'', //排序
		      	categoryJpId:[''],  //关联的日方分类id  
		      	appraisal:'', //评价类型   
		      	methodUrlshow:[''], //测试方法  不传
		      	methodUrl:['',], //测试方法  传
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
	        	appraisal: [
	       			{ required: true, message: '必填项不能为空', trigger: 'blur' },
				],
	     	},
	    };
	  },
	  components: {
	  	imgCropper,
	  },
	  created () {
	  },
	  methods: {
	  	actselectchange(){
	  		if(this.dataForm.parentId == 0){   //添加一级	  			
	  			this.erjishow = true;
	  			this.yijishow = false;
	  		}else{
	  			this.dataForm.methodUrlshow.push('');
	  			this.erjishow = false;
	  			this.yijishow = true;
	  		}
	  	},
	  	init(row){
			  this.row = row;
	  		this.showListVisible = true;
	  		backScanCategoryCn(row).then((res)=>{
	  			if(res.code == 200){
					this.dataForm = res.data;
					if(res.data.methodUrl) this.dataForm.methodUrlshow =JSON.parse(res.data.methodUrl);
	  				this.actselectchange();
	  			}else{
	  				this.$message(res.msg);
	  			}
	  		}).catch(()=>{
	  			this.$message("服务器错误");
	  		})
	  		
	  		//获取一级分类
	  		categoryCn().then((res)=>{
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
	  		
	  		//获取关联日本分类
	  		searchCategoryJp().then((res)=>{
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
		actuploaddata(formName){  //确定提交 
		  if(typeof this.dataForm.methodUrlshow =="string"){
			  	this.dataForm.methodUrlshow = JSON.parse(this.dataForm.methodUrlshow);
		  } 
	  		if(!this.dataForm.methodUrlshow[this.dataForm.methodUrlshow.length-1]){
	  			this.dataForm.methodUrlshow.pop()
	  		}
	  		if(this.dataForm.methodUrlshow.length){
	  			this.dataForm.methodUrlshow.forEach((item)=>{
		  			if(item.indexOf(this.$imgDomain) != -1){
			  			item.substr(this.$imgDomain.length)
			  		}
		  		})
	  		}
	  	
	  		// 测量尺寸是一个json
	  		this.dataForm.methodUrl = JSON.stringify(this.dataForm.methodUrlshow);
	  		
	  		//处理男士/女士/儿童     是否传数据
	  		if(this.checkList.indexOf('男士') == -1){
	  			this.dataForm.genderMr = '';
	  		}else if(this.checkList.indexOf('女士') == -1){
	  			this.dataForm.genderMrs = '';
	  		}else if(this.checkList.indexOf('儿童') == -1){
	  			this.dataForm.genderKid = '';
	  		}	
	  		
	  		//img有前缀得去掉前缀
	  		if(this.dataForm.genderMr && this.dataForm.genderMr.indexOf(this.$imgDomain) != -1){
	  			file.url.substr(this.$imgDomain.length)
	  		}
	  		if(this.dataForm.genderMrs && this.dataForm.genderMrs.indexOf(this.$imgDomain) != -1){
	  			file.url.substr(this.$imgDomain.length)
	  		}
	  		if(this.dataForm.genderKid && this.dataForm.genderKid.indexOf(this.$imgDomain) != -1){
	  			file.url.substr(this.$imgDomain.length)
	  		}
			this.$refs[formName].validate((valid) => {
				if (valid) {
					//确定提交
					updataCategoryCn(this.dataForm).then((res)=>{
						if(res.code == 200){
							console.log(res.data);
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
	  	GiftUrlHandle(val){
			console.log("base64上传图片接口");
			console.log(val);
			this.uploadPic(val);
			if(this.imgtype == 'rule'){
				this.dataForm.methodUrlshow.push('');
			}
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
						if(that.imgtype == 'rule'){
							if(that.dataForm.methodUrlshow.lenght >= 10){
								this.$message("最多可上传10张图片");
								return;
							}
							that.dataForm.methodUrlshow[that.dataForm.methodUrlshow.length-1] = url;
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
	      done();
	      this.$emit("editshow")
	    },
	    closeadd(){
	    	this.showListVisible = false;
	    	this.$emit("editshow")
	    },
	  }
	}
</script>

<style lang="scss" scoped>
/deep/ .pcCoverUrl {
	margin-right: 10px;
}

/deep/ .el-checkbox{
	margin-left: 60px;
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
	margin-left: 92px;
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