<template>
    <div>
        <Bread :breaddata="breaddata" @changePage="changePage" :index="'1'"></Bread>

        <div  v-loading="backScanLoading"  v-if="backScanLoading" style="min-height:400px">
        </div>
        <el-form
                ref="dataForm"
                :rules="rules"
                class="grayLine topGapPadding"
                :model="dataForm"
                style="margin-left: 20px;margin-bottom: 100px;"
                v-if="!backScanLoading"
        >
            <el-form-item label="商品分类：" class="item" style="margin-top: 20px;">
                <span>{{dataForm.firstCategory}}</span>-->
                <span>{{dataForm.secondCategory}}</span>
                <span style="margin-left: 2%;color:green;cursor:pointer;" @click="logMore">修改</span>
            </el-form-item>
            <el-form-item label="商品编码：" class="item">
                <span>{{dataForm.idJp}}</span>
            </el-form-item>
            <el-form-item label="日本商品名称：" class="item">
                <span>{{dataForm.nameJp}}</span>
            </el-form-item>
            <el-form-item label="商品名称：" prop="name" class="item">
                <el-input v-model="dataForm.name" placeholder="请输入" style="margin-left: 10px;"></el-input>&nbsp;&nbsp;
                <span style="color: #bebebe;">必填且最多可输入60个文字</span>
            </el-form-item>
            <el-form-item label="品牌：" class="item">
                <span>{{dataForm.brandName}}</span>
            </el-form-item>
            <el-form-item label="所属店铺：" class="item">
                <span>{{dataForm.storeName}}</span>
            </el-form-item>
            <el-form-item label="主品牌：" class="item">
                <template>
                    <span v-if="dataForm.brands && dataForm.brands.length!=0 && dataForm.brands[0].isMainBrand==0">{{dataForm.brands[0].brandName}}</span>
                </template>
            </el-form-item>
            <el-form-item label="副品牌：" class="item">
                <template>
                    <span v-if="dataForm.brands && dataForm.brands.length!=0 &&dataForm.brands[0].isMainBrand==1">{{dataForm.brands[0].brandName}}</span>
                </template>
            </el-form-item>
            <el-form-item label="主性别：" class="item">
                <template>
                    <span v-if="dataForm.genders==0">男</span>
                    <span v-if="dataForm.genders==1">女</span>
                    <span v-if="dataForm.genders==2">儿童</span>
                </template>
            </el-form-item>
            <el-form-item label="副性别：" class="item">
                <template>
                    <span v-if="dataForm.viceGenders==0">男</span>
                    <span v-if="dataForm.viceGenders==1">女</span>
                    <span v-if="dataForm.viceGenders==2">儿童</span>
                </template>
            </el-form-item>
            <el-form-item label="日本销售价：" class="item">
                <span>{{dataForm.properPriceYen}}</span>
            </el-form-item>
            <el-form-item label="日本促销价：" class="item">
                <span>{{dataForm.salePriceYen}}</span>
            </el-form-item>
            <el-form-item label="品牌销售价：" class="item">
                <span>{{dataForm.properPrice}}</span>
            </el-form-item>
            <el-form-item label="品牌促销价：" class="item">
                <span>{{dataForm.salePrice}}</span>
            </el-form-item>
            <el-form-item label="价格标识：" class="item">
                <template>
                    <span v-if="dataForm.salePlan==0">关税计算</span>
                    <span v-if="dataForm.salePlan==1">品牌方设定</span>
                </template>
                <template>
                    <span v-if="dataForm.priceType=='sale'">促销价</span>
                    <span v-if="dataForm.priceType=='proper'">标准价</span>
                </template>
            </el-form-item>
            <el-form-item label="原产地：" class="item">
                <span>{{dataForm.madeInJp}}</span>
                <el-input v-model="dataForm.madeIn" placeholder="请输入" style="margin-left: 10px;"></el-input>&nbsp;&nbsp;
                <span style="color: #bebebe;">最多可输入10个文字</span>
            </el-form-item>
            <el-form-item label="材质：" class="item">
                <span>{{dataForm.materialJp}}</span>
                <el-input v-model="dataForm.material" placeholder="请输入" style="margin-left: 10px;"></el-input>&nbsp;&nbsp;
            </el-form-item>
            <el-form-item label="上架状态：" class="item">
                <template>
                    <span v-if="dataForm.showWeb==0">下架</span>
                    <span v-if="dataForm.showWeb==1">上架</span>
                    <span v-if="dataForm.showWeb==2">未上架</span>
                </template>
            </el-form-item>
            <el-form-item label="日本上架状态：" class="item">
                <template>
                    <span v-if="dataForm.japanShowWeb=='true' || dataForm.japanShowWeb==1|| dataForm.japanShowWeb==true">可售</span>
                    <span v-else-if="dataForm.japanShowWeb=='false' || dataForm.japanShowWeb==0 || dataForm.japanShowWeb==false">不可售</span>
                </template>
            </el-form-item>
            <el-form-item label="可售状态：" class="item">
                <template>
                    <span v-if="dataForm.sellState==0">不可售</span>
                    <span v-if="dataForm.sellState==1">可售</span>
                </template>
            </el-form-item>
            <el-form-item label="颜色尺码：">
                <el-table
                        border
                        :data="dataForm.skuVOList"
                        class="inforRight"
                        style="display:inline-block;width: 80%">
                    <el-table-column prop="goodsCsIdJp" label="SKU编码" align="center"></el-table-column>
                    <el-table-column prop="colorName" label="颜色" align="center"></el-table-column>
                    <el-table-column prop="sizeName" label="尺码" align="center"></el-table-column>
                    <el-table-column prop="specId" label="尺码信息" align="center">
                        <template slot-scope="scope">
                            <div @click="detShowChange(scope.row)" style="color: #2260D2;cursor:pointer;">
                                查看
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stockQuantity" label="库存" align="center"></el-table-column>
                    <!-- <el-table-column prop="sellState" label="是否可售" align="center"></el-table-column> -->
                    <el-table-column prop="sellStartDate" label="售卖开始时间" align="center"></el-table-column>
                    <el-table-column prop="sellEndDate" label="售卖结束时间" align="center"></el-table-column>
                    <el-table-column prop="cartLimit" label="日本限购数量" align="center"></el-table-column>
                    <el-table-column prop="limitPerCustomer" label="日本每人限购数量" align="center"></el-table-column>
                    <el-table-column prop="sellPrice" label="售价(RMB)" align="center">
                        <template
                                slot-scope="scope"
                                v-if="scope.row.specSellPrice!==''&&scope.row.specSellPrice!==null"
                        >￥{{scope.row.sellPrice?scope.row.sellPrice:'0.00'}}</template>
                    </el-table-column>
                    <el-table-column prop="goodsNum" label="图片" align="center">
                        <template slot-scope="scope">
                            <img
                                    :src="scope.row.imageUrl | filterImgUrl"
                                    style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="分类条件：">
                <el-row v-for="(item,index) in dataForm.tags" :key="index" class="info" style="width: 500px;">
                    <el-col :span="12"><div class="grid-content">{{item.parentTagName}}</div></el-col>
                    <el-col :span="12"><div class="grid-content">{{item.nameJp}}</div></el-col>
                </el-row>
<!--                <Table class="inforRight" style="display: inline-block;" :tableData="tableData" :tableStyle="{ width:'600px' }"></Table>-->
            </el-form-item>
            <el-form-item label="商品图片：">
                <template slot-scope="scope">
                    <div style="display:flex">
                        <div style="display:inline-block;" v-loading="uploading">
                            <img-cropper
                                ref="cropperImg"
                                :index="0"
                                :imgWidth='"100px"'
                                :imgHeight='"100px"'
                                :cropImg='tempImage'
                                @GiftUrlHandle="GiftUrlHandle"
                            ></img-cropper>
                             <div  class="uploadCover" v-if="uploading" style="position:absolute;top:0;left:0;width: 190px;height: 190px;  z-index: 1000;"></div>
                        </div>
                        <div class="goodsImg" style="display:flex;margin-left:5px;">
                            <div v-for="(item,index) in  dataForm.imgs" style="position: relative;width:100px;height:100px;margin-right:5px;">
                                  <img :src="item.sizeOriginal | filterImgUrl" alt="" style="width:100%;height:100%"/>
                                  <div class="deletaImg" @click="deletaImgFn(index)">
                                      X
                                  </div>
                            </div>
                        </div>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="日本商品详情：" class="item" style="height: auto!important;">
                <span v-html="dataForm.descriptionJp"></span>
            </el-form-item>
            <el-form-item label="商品详情：">
                <!-- 富文本编辑器, 容器 -->
                <quill-editor-img class="inforRight" style="display: inline-block;"  @artmessageContent='artmessageContent' ref="refmessageContent"></quill-editor-img>
            </el-form-item>
        </el-form>
        <el-col :span="24">
            <div style="position: fixed;bottom: 0;margin: 0 auto;width: 86%;text-align: center;z-index: 999;background-color: #e6e6e6;padding: 10px 0;">
                <el-button class="btn" @click="reset()">取消</el-button>
                <el-button class="btn" @click="saveData(0,'dataForm')">仅保存</el-button>
                <el-button v-if="dataForm.showWeb!=1" class="btn" type="primary" @click="saveData(1,'dataForm')">保存并上架</el-button>
            </div>
        </el-col>
        <!-- 弹窗, 新建 -->
        <addEditData :id="dataForm.id" v-if="addEditDataVisible" ref="addEditData"></addEditData>
        <!-- 尺码信息 -->
        <sizeData v-if="sizeDataVisible" ref="sizeDataCompon"></sizeData>
    </div>
</template>

<script>
    //import addEditData from './recordList'
    import Bread from "@/components/bread";
    import quillEditorImg from "@/components/quillEditor"
    import addEditData from './model-edit-data'
    import { backScanZozogoods, saveZozogoods } from '@/api/api'
    import sizeData from './model-size'
    import imgCropper from "@/components/model-photo-cropper";
    import { uploadPicBase64 } from '@/api/api'
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import Quill from 'quill'
    export default {
        data () {
            return {
                breaddata: [ "商品管理","商品列表", "编辑商品"],
                addEditDataVisible: false,
                backScanLoading:false,
                dataForm: {
                    name:"",
                    madeIn:"",
                    material:"",
                    firstCategory:'',//
                    firstCategoryId:'',
                    secondCategoryIsd:'',
                    secondCategory:'',
                },
                sizeDataVisible: false,
                row:'',
                rules: {
				          name: [
				            { required: true, message: '长度在 0到 60 个汉字', trigger: 'blur' }
				          ],
                },
                tempImage:'',//上传图片展位图
                uploading:false,
            }
        },
        components: {
            Bread,
            quillEditorImg,
            addEditData,
            sizeData,
            imgCropper
        },
        // props: [
        //     "detdata",
        //     "data"
        // ],
        watch:{
            'dataForm.name':function(newV,oldV) {
                if(!newV) return
                var chineseCount = 0,characterCount = 0;
                for(let i=0;i<newV.length;i++){
                    if(/^[\u4e00-\u9fa5]*$/.test(newV[i])){ //汉字
                        chineseCount=chineseCount+2;
                    }else{ //字符
                        characterCount=characterCount+1;
                    }
                    var count=chineseCount+characterCount;
                    if(count>120){ //最多输入120个字符
                        this.dataForm.name = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
            'dataForm.madeIn': function (newV, oldV) {
                if(!newV) return
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 20) { //最大输入20个字符
                        this.dataForm.madeIn = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
        },
        methods: {
            init(row){
                this.row = row;
                this.$nextTick(()=>{
                    if(row){
                        this.backScan(row);
                    }
                })
            },
            // 回显数据
            backScan(row){
                var obj  = {
                    id:row.id
                }
                this.backScanLoading = true;
                backScanZozogoods(obj).then((res)=>{
                    this.backScanLoading = false;
                    console.log('详情',res.data)
                    if(res.code == 200){
                        this.dataForm = res.data;
                    }
                })
            },
            // 富文本编辑器修改值
            artmessageContent(messageContent){
                this.dataForm.messageContent = messageContent;
            },
            //备案信息
            // logMore() {
            //     this.$router.push({ name: "mggoods-message-goodslist-recordList" });
            // },
            // 返回上一级
            changePage() {
                this.$emit("showList");
            },
            operational () {
                this.$emit("operational")
            },
            logMore(){
                this.setAddEditDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.addEditData.init(this.row)
                })
            },
            setAddEditDataVisible(boolargu){
                this.addEditDataVisible =  boolargu;
                this.id = this.dataForm.id;
            },
            detShowChange (row2) {
                this.sizeDataVisible =  true;
                console.log(this.dataForm);
                this.$nextTick(() => {
                    this.$refs.sizeDataCompon.init(this.row,row2);
                })
            },
            reset(){
                let that = this;
                this.$confirm('取消将不会保存页面数据', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.changePage();
                }).catch();
            },
<<<<<<< HEAD
            saveData(saveType,formName){
            	this.$refs[formName].validate((valid) => {
		          if (valid) {
			        let that = this;
	                // this.dataForm.saveFlag = saveType;
	                // this.dataForm.goodsTypeId  = this.dataForm.secondCategoryIsd 
	                // console.log(this.dataForm);
	                var imgs =[]
	                 this.dataForm.imgs.forEach((item,index)=>{
	                        imgs.push(item.sizeOriginal); 
	                })
	                var obj = {
	                    "description": this.dataForm.description,//中方商品描述 ,
	                    "goodsTypeId": this.dataForm.secondCategoryIsd ,//商品的二级分类id ,
	                    "id": this.dataForm.id,//商品spu的id ,
	                    "imgs": imgs,//商品的图片列表 ,
	                    "madeIn": this.dataForm.madeIn,//生产地中文 ,
	                    "material": this.dataForm.material,//材质中文 ,
	                    "name":  this.dataForm.name,//商品中文名 ,
	                    "saveFlag": saveType // 0：仅保存，1：保存并上架
	                }
	                saveZozogoods(obj).then((res)=>{
	                    if(res.code == 200){
	                        this.$message({
	                            message: res.msg,
	                            type: 'success',
	                            onClose:function () {
	                                that.changePage();
	                            }
	                        });
	                    }else{
	                        this.$message({
	                            message: res.msg,
	                            type: 'error',
	                        });
	                    }
	                })
		          } else {
		            return false;
		          }
		        });
                
=======
            saveData(saveType){
                let that = this;
                // this.dataForm.saveFlag = saveType;
                // this.dataForm.goodsTypeId  = this.dataForm.secondCategoryIsd 
                // console.log(this.dataForm);
                var imgs =[]
                 this.dataForm.imgs.forEach((item,index)=>{
                        imgs.push(item.sizeOriginal); 
                })
                var obj = {
                    "description": this.dataForm.description,//中方商品描述 ,
                    "goodsTypeId": this.dataForm.secondCategoryIsd ,//商品的二级分类id ,
                    "id": this.dataForm.id,//商品spu的id ,
                    "imgs": imgs,//商品的图片列表 ,
                    "madeIn": this.dataForm.madeIn,//生产地中文 ,
                    "material": this.dataForm.material,//材质中文 ,
                    "name":  this.dataForm.name,//商品中文名 ,
                    "saveFlag": saveType // 0：仅保存，1：保存并上架
                }
                saveZozogoods(obj).then((res)=>{
                    if(res.code == 200){
                        this.$message({
                            message: res.msg,
                            type: 'success',
                            onClose:function () {
                                that.changePage();
                            }
                        });
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'error',
                        });
                    }
                })
            },
            deletaImgFn(index){
                this.dataForm.imgs.splice(index,1);
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
                        if(res && res.code == "200"){
                            var url = res.data.url
                            that.tempImage = "";
                            that.$refs.cropperImg.cropper.cropImg = ""
                            console.log(that.dataForm);
                             that.dataForm.imgs.push({
                                sizeOriginal:url
                            })
                            that.$message({
                            message: "图片上传成功!",
                            type: 'success',
                            duration: 800,
                            })
                            resolve("true")
                        }else {
                            that.tempImage = "";
                            that.$refs.cropperImg.cropper.cropImg = ""
                            that.$message({
                                message: res.msg,
                                type: 'error',
                                duration: 1500,
                            })
                            resolve("false")
                        }
                    })
                });
            },
            GiftUrlHandle(val){
                console.log("base64上传图片接口");
                // console.log(val);
                this.uploadPic(val);
>>>>>>> 74d9edacb642d632b4899c83b1af50e586a2bd38
            },

        }
    }
</script>

<style lang="scss" scoped>
    /*.inforTit {*/
    /*    width: 100px;*/
    /*    font-weight: 600;*/
    /*    text-align: right;*/
    /*    display: inline-block;*/
    /*}*/
    /*.inforRight {*/
    /*    margin-left: 40px;*/
    /*    display: inline-block;*/
    /*}*/
    /*div {*/
    /*    padding: 8px 0;*/
    /*}*/
    /*.orderState {*/
    /*    margin-left: 5%;*/
    /*}*/
    /deep/ .el-form-item__label {
        width: 100px!important;
    }
    /deep/ .el-form-item__error{
    		margin-left:108px;
    }
    .item {
        height: 26px!important;
    }
    .grayLine {
        border-bottom: 0!important;
    }
    .grid-content {
        border: 1px solid #ebeef5;
        height: 50px;
        line-height: 50px;
        text-align: center
    }
    .info {
        margin-left: 100px;
    }
    /deep/ .el-input {
        width: 200px!important;
    }
    /deep/ .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .deletaImg{
        text-align: center;position: absolute;top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        line-height: 20px;
        cursor: pointer;
        background-color: #09dc6d;
        color:white;
        top: 5px;
        right: 10px;
        border-radius: 50%;
    }
</style>