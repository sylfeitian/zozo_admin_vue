<template>
	<!--新增的弹窗-->
		<el-dialog title="编辑分类" :visible.sync="showListVisible" width="50%" :before-close="handleClose" v-if="delay">
			<el-form :model="dataForm" label-width="140px" 	:rules="dataRule" class="demo-ruleForm" ref="editForm">
		    <el-form-item v-if='dataForm.parentname' label="上级分类：" prop="gcName">
            <el-input v-model.trim="dataForm.parentname" type="text" :disabled="true" placeholder="dataForm.parentname" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item v-else label="上级分类：">  
	        <el-select
				:disabled="row.grade=='1'"
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
            <el-input v-model.trim="dataForm.name " type="text" placeholder="请输入10个汉字/20个字符以内的内容" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
            <el-input v-model.trim="dataForm.sort" type="text" placeholder="数字越大越靠前" show-word-limit style="width:200px;"></el-input>
        </el-form-item>

		<el-form-item label="评价类型：" prop="appraisal" v-if="erjishow">
			    <!-- <el-input v-model.trim="dataForm.appraisal " type="text" placeholder="请输入4个汉字/8个字符以内的内容" show-word-limit style="width:400px;"></el-input> -->
	        <el-input v-model.trim="dataForm.appraisal" type="text" placeholder="请输入6字以内的内容" style="width:400px;"></el-input>
	    </el-form-item>
    

        <!-- <el-form-item v-if="yijishow"  prop="categoryJpId" v-for="(item, index) in dataForm.categoryJpId" :key="index" :label="index == 0 ? '关联日本分类：' : '' ">
	        <el-select
	          v-model="dataForm.categoryJpId[index]"
	          placeholder="请选择"
	          loading-text="加载中···"
	          @change ='actdatacategory'>
	          <el-option
	            v-for="item2 in goodKindList2"
	            :key="item2.id"
	            :label="item2.name || item2.nameJp"
	            :value="item2.id">
	          </el-option>
	        </el-select>
	        <el-button v-if="index+1 == dataForm.categoryJpId.length" @click="actadd" type="primary" style="margin-left: 20px;">添加</el-button>
			<el-button v-if="index!=0" @click="removecategoryJpItemFn(index)" type="primary" style="margin-left: 20px;">删除</el-button>
		</el-form-item> -->

		<el-form-item  v-if="yijishow" label="关联日本分类：">
			 <el-tree
					ref="treeCategory"
					:data="goodKindList2"
					show-checkbox
					node-key="id"
					:default-expanded-keys="expandedKeys"
					:default-checked-keys="checkedKeys"
					:props="defaultProps">
                </el-tree>
	    </el-form-item>


       <el-form-item label="测量方法：" prop="methodUrl" v-if="yijishow">
				<div class="pcCoverUrl imgUrl" style="width: 84px;" v-for="(item,index) in dataForm.methodUrlshow" @click="imgtype = 'rule'">
					<img-cropper
					    v-loading="methodUrlLoading[index]"
						ref="cropperImg1"
						:index="index"
						:imgWidth='"84px"'
						:imgHeight='"84px"'
						:cropImg = "item"
						@delteteImg="delteteImgMethodUrl"
						@GiftUrlHandle="GiftUrlHandle"
					></img-cropper>
					<div v-if="isUploadingImg()" @click.stop="uploadImgTip" class="hiddenLoading"></div>
				</div>
		</el-form-item>
		
    	<el-form-item label="分类性别：" prop=""  v-if="yijishow">
    		<div class="pcCoverUrl imgUrl"   @click="imgtype = 'all'" style="display:flex;">
    			<div class="artmwc artall">全部</div>
				<div style="position: relative;">
					<img-cropper
						style="width: 84px;"
						v-loading="genderMainLoading"
						ref="cropperImg1"
						:index="'1'"
						:cropImg = "dataForm.genderMain"
						:imgWidth='"84px"'
						:imgHeight='"84px"'
						@delteteImg="delteteImgAll"
						@GiftUrlHandle="GiftUrlHandle"
					></img-cropper>
					<div v-if="isUploadingImg()"  @click.stop="uploadImgTip"  class="hiddenLoading"></div>
				</div>
				
			</div>
    	</el-form-item>
    	
    	
    	<el-form-item label="" prop=""  v-if="yijishow">
    		<el-checkbox-group v-model="checkList">
    			<div class="artmwc">
    				<el-checkbox label="男士" ></el-checkbox>
    				<div v-if="checkList.indexOf('男士') != -1" class="pcCoverUrl imgUrl" style="width: 84px;"  @click="imgtype = 'm'">
						<img-cropper
							v-loading="genderMrLoading"
							ref="cropperImg1"
							:index="'1'"
							:cropImg = "dataForm.genderMr"
							:imgWidth='"84px"'
							:imgHeight='"84px"'
							@delteteImg="delteteImgM"
							@GiftUrlHandle="GiftUrlHandle"
						></img-cropper>
						<div v-if="isUploadingImg()"   @click.stop="uploadImgTip"  class="hiddenLoading"></div>
					</div>
    				<div v-else class="artuploadimg">上传图片</div>
    			</div>
    			<div class="artmwc">
    				<el-checkbox label="女士"></el-checkbox>
				    <div v-if="checkList.indexOf('女士') != -1" class="pcCoverUrl imgUrl" style="width: 84px;"  @click="imgtype = 'w'">
						<img-cropper
							v-loading="genderMrsLoading"
							ref="cropperImg1"
							:index="'1'"
							:imgWidth='"84px"'
							:cropImg = "dataForm.genderMrs"
							:imgHeight='"84px"'
							@delteteImg="delteteImgW"
							@GiftUrlHandle="GiftUrlHandle"
						></img-cropper>
						<div v-if="isUploadingImg()"  @click.stop="uploadImgTip"  class="hiddenLoading"></div>
					</div>
					<div  v-else  class="artuploadimg">上传图片</div>
    			</div>
			    <div class="artmwc">
    				<el-checkbox label="儿童"></el-checkbox>
				    <div v-if="checkList.indexOf('儿童') != -1"  class="pcCoverUrl imgUrl" style="width: 84px;"  @click="imgtype = 'c'">
						<img-cropper
							v-loading="genderKidLoading"
							ref="cropperImg1"
							:index="'1'"
							:imgWidth='"84px"'
							:cropImg = "dataForm.genderKid"
							:imgHeight='"84px"'
							@delteteImg="delteteImgC"
							@GiftUrlHandle="GiftUrlHandle"
						></img-cropper>
						<div v-if="isUploadingImg()"   @click.stop="uploadImgTip" class="hiddenLoading"></div>
					</div>
					<div  v-else class="artuploadimg">上传图片</div>
    			</div>
			</el-checkbox-group>
				<div style="color:#999;">建议尺寸：84*84px</div>s
    		
    	</el-form-item>
	</el-form>
		<span slot="footer" class="dialog-footer">
            <el-button @click="closeadd">取消</el-button>
            <el-button type="primary" @click="actuploaddata('editForm')">{{saveLoading?'提交中...':'确 定'}}</el-button>
        </span>
</el-dialog>

</template>

<script>
	import cloneDeep from 'lodash/cloneDeep'
	import imgCropper from "@/components/model-photo-cropper";
	//查询一级分类   查询日本分类  图片   提交   编辑查询回显
	import { categoryCn,searchCategoryJp,uploadPicBase64 ,updataCategoryCn ,backScanCategoryCn,categoryCnVerifyName} from '@/api/api'
	export default {
	  data() {
	    var checkName = (rule, value, callback) => {
			// 校验中国分类名称是否重复
			if(value){
				if(value===this.tempName){
					callback();
				}else{
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
			}
	    };
	    var sortminmax = (rule, value, callback) => {
	    	if(value >= 0 && value < 99999){
	    		callback();
	    	}else{
	    		callback('排序值在0-99999之间');
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
				  return callback('至少输入2个字，对应4个字符的内容');
			  }else{
				  return callback()
			  }
		  };
	    return {
			saveLoading:false,
	    	erjishow: true,  //二级没有评价类型
	    	yijishow: true,  //一级不用上传图片
	    	imgtype:'',  //img的类型
	    	checkList:[],  //分类性别多选
	        datacategory: '', //选择分类
	        showListVisible:true,
	        goodKindList1: [{ id: '0', name: "无" }],
	        goodKindList2: [],
	        dataArray:[],
			tempName:'',
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
			defaultProps: {
				// children: 'list',
				// label: 'name',
				children: 'children',
				label: 'label'
			},
			expandedKeys:[],
			checkedKeys:[],
			methodUrlLoading:[false,false,false,false,false,false,false,false,false,false],
			genderMainLoading:false,
			genderMrLoading:false,
			genderMrsLoading:false,
			genderKidLoading:false,
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
				],
	        	appraisal: [
					{ required: true, message: '必填项不能为空', trigger: 'blur' },
					{ validator: validateAppraisal,trigger: 'blur'},
				],
			 },
			 row:"",
			delay:false
	    };
	  },
	  components: {
	  	imgCropper,
	  },
		watch:{
			'dataForm.name':function(newV,oldV) {
				if(!newV){ return}
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
				if(!newV){ return}
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
		},
	  created () {
		  this.actselectchange()
	  },
	  methods: {
		init(row){
			this.row = row;
			this.saveLoading = false;
			if(this.row){
				this.tempName = this.row.label; // 暂存当前名字，校验用
			}
			this.showListVisible = true;
			var id = row&&row.id?row.id:""
			this.$nextTick(()=> {
				this.getCategoryJp().then(()=>{
					this.backScan();	// 编辑时回显数据
				});// 获取关联日本分类
				this.getCategoryCn();//获取一级分类
			})
	  	},
	  	actselectchange(){
	  		if(this.dataForm.parentId == 0){   //添加一级
	  			this.erjishow = true;
	  			this.yijishow = false;
	  		}else{
				if(this.dataForm.methodUrlshow && this.dataForm.methodUrlshow.length<10){
						var methodUrlshow = [];
						// 去除空图片
						this.dataForm.methodUrlshow.forEach((item,index)=>{
								if(item){ methodUrlshow.push(item);}
						})
						// 追加最后一个展位
						methodUrlshow.push('');
						this.dataForm.methodUrlshow = [].concat(methodUrlshow)
				}
	  			this.erjishow = false;
				this.yijishow = true;
				  
				if(this.dataForm.genderMr) this.checkList.push("男士");
				if(this.dataForm.genderMrs) this.checkList.push("女士");
				if(this.dataForm.genderKid) this.checkList.push("儿童");
		  		}
	  	},
		// 编辑时回显数据
		backScan(){
			backScanCategoryCn(this.row).then((res) => {
				if (res.code == 200) {
					Object.assign(this.dataForm, res.data);
					if (res.data.methodUrl)
						this.dataForm.methodUrlshow = JSON.parse(res.data.methodUrl);
					this.actselectchange();
					this.delay=true
					// 默认展开选中的树形结构
					this.$nextTick(()=>{
						this.expandedKeys = res.data.categoryJpId;
						this.checkedKeys =  res.data.categoryJpId;
						// alert(this.expandedKeys);
						// alert(this.checkedKeys);
					})
				} else {
					this.$message(res.msg);
				}
			}).catch(() => {
				this.$message("服务器错误");
			})
		},
		// 获取关联日本分类下拉列表
		getCategoryJp(){
			var obj = {
				params:{
					id:this.row.id
				}
			}
			return new Promise((resolve)=>{
					searchCategoryJp(obj).then((res) => {
						if (res.code == 200) {
							console.log(res.data);
							res.data.forEach((item) => {
								if(!item.name){
									item.name = item.nameJp;
								}
								item.children = item.list;
								item.label = item.name;

								if(item && item.list){
									item.list.forEach((item2)=>{
										if(!item2.name){
											item2.name = item2.nameJp;
										}
										item2.children = "";
										item2.label = item2.name;
									})
								}
								this.goodKindList2.push(item);
							})
							resolve("ok")
						} else {
							this.$message(res.msg);
							resolve("error")
						}
					}).catch(() => {
						this.$message("服务器错误");
						resolve("error")
					})
			})
		},
		//获取一级分类
		getCategoryCn(){
			categoryCn().then((res) => {
				if (res.code == 200) {
					res.data.forEach((item) => {
						this.goodKindList1.push(item);
					})
				} else {
					this.$message(res.msg);
				}
			}).catch(() => {
				this.$message("服务器错误");
			})
		},
		// 提交
		actuploaddata(formName){  //确定提交 
		if(this.saveLoading){
			return;
		}
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
					var ids = []
					if(this.yijishow){
						ids = this.$refs.treeCategory.getCheckedKeys(true);
						console.log(ids);
						if(ids.length==0){
							this.$message({
								message: '请选择关联分类',
								type: 'warning',
								duration: 1500
							})
							return false;
						}
					}
				
					//确定提交
					// var categoryJpId = [] ;
					// this.dataForm.categoryJpId.forEach((item,index)=>{
					// 		if(item) categoryJpId.push(item)
					// })
					this.saveLoading = true
					var obj = {
						...this.dataForm,
						categoryJpId:ids
					}
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
		// 判断是否有图片正在上传
		isUploadingImg(){
			if(this.genderMainLoading){
				return true;
			}else if(this.genderMrLoading){
				return true;
			}else if(this.genderMrsLoading){
				return true;
			}else if(this.genderKidLoading){
				return true;
			}else if(this.methodUrlLoading.indexOf(true)!=-1){
				return true;
			}else{
				return false
			}
		},
		uploadImgTip(){
			if(this.isUploadingImg()){
				this.$message.warning("当前有图片正在上传，请稍后再试");
				return
			}
		},
		//上传图片
		uploadPic(base64,_index){
			
			const params = { "imgStr": base64 };
			const that = this;
			this.uploading = true;
			if(that.imgtype == 'rule'){
				that.methodUrlLoading[_index] = true
				that.$set(that.methodUrlLoading,_index,that.methodUrlLoading[_index]);
			}else if(that.imgtype == 'all'){
				that.genderMainLoading = true;
			}else if(that.imgtype == 'm'){
				that.genderMrLoading = true;
			}else if(that.imgtype == 'w'){
				that.genderMrsLoading = true;
			}else if(that.imgtype == 'c'){
				that.genderKidLoading = true;
			}
			return new Promise(function(resolve){
				uploadPicBase64(params).then(res =>{
					that.uploading = false
					if(res && res.code == "200"){
						var url = res.data.url
						if(that.imgtype == 'rule'){
							that.methodUrlLoading[_index] = false;
							that.$set(that.methodUrlLoading,_index,that.methodUrlLoading[_index]);
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
										methodUrlshow.push(item)	;
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
							that.genderMainLoading = false;
							that.dataForm.genderMain = url;
						}else if(that.imgtype == 'm'){
							that.genderMrLoading = false;
							that.dataForm.genderMr = url;
						}else if(that.imgtype == 'w'){
							that.genderMrsLoading = false;
							that.dataForm.genderMrs = url;
						}else if(that.imgtype == 'c'){
							that.genderKidLoading = false;
							that.dataForm.genderKid = url;
						}
						// that.currentIndex = -1;//不能这样写，防止网络延迟
						resolve("true")
					}else {
						// that.currentIndex = -1;//不能这样写，防止网络延迟
						that.$message.error(res.msg)
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
		// 删除某一条日本分类
		removecategoryJpItemFn(index){
			console.log(index);
			this.dataForm.categoryJpId.splice(index,1)
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
		// 删除测量方法图片
		delteteImgMethodUrl(index){
			let that = this;
			console.log(index);
			that.dataForm.methodUrlshow.splice(index,1);
			let methodUrlshow = [];
			that.dataForm.methodUrlshow.forEach((item,index)=>{
				if(item){
					methodUrlshow.push(item)	;
				}
			})
			// 追加最后一个展位
			methodUrlshow.push('');
			console.log(methodUrlshow);
			that.dataForm.methodUrlshow = [].concat(methodUrlshow)
		},
		// 删除分类性别图片(全部)
		delteteImgAll(){
			this.dataForm.genderMain = "";
		},
		// 删除分类性别图片(男士)
		delteteImgM(){
			this.dataForm.genderMr = "";
		},
		// 删除分类性别图片(女士)
		delteteImgW(){
			this.dataForm.genderMrs = "";
		},
		// 删除分类性别图片(儿童)
		delteteImgC(){
			this.dataForm.genderKid = "";
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
		position: relative;
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

.hiddenLoading{
    position: absolute;
    height: 102px;;
    width: 100px;
    // background: rebeccapurple;
    top: -1px;
    left: -1px;
    z-index: 1000;
}
</style>