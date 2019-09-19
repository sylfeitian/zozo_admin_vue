<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataFormShow" @keyup.enter.native="getDataList()" style="margin-top: 20px;">
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="商品名称：">
                <el-input v-model="dataFormShow.goodsName" placeholder="商品名称"  maxlength="300"></el-input>
            </el-form-item>
            <el-form-item label="商品sku ID：">
                <el-input v-model="dataFormShow.goodsCsIdJp" placeholder="商品skuid" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="分类：">
                <el-cascader
                        :options="selectCategoryOption"
                        v-model="classList"
                        change-on-select
                        :clearable="true"
                        :props="props"
                        @change="handleChange">
                </el-cascader>
            </el-form-item>
            <el-form-item  label="所属店铺：">
                <el-input v-model="dataFormShow.storeName" placeholder="请输入店铺名称" ></el-input>
            </el-form-item>
            <el-form-item  label="品牌：">
                <el-input v-model="dataFormShow.brandName" placeholder="请输入品牌名称" ></el-input>
            </el-form-item>
            <el-form-item  label="状态：" v-if="dataFormShow.isTofile=='1'">
                <el-select v-model="dataFormShow.transportFlag" placeholder="请选择">
                    <el-option
                            v-for="item in stateOptions"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="备案状态：" v-if="dataFormShow.isTofile=='0'">
                <el-select v-model="dataFormShow.tofileFlag" placeholder="请选择">
                    <el-option
                            v-for="item in alreadyOptions"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button   class="btn"type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>

        <el-radio-group v-model="activeName" @change="handleClick">
            <el-radio-button label="">已备案</el-radio-button>
            <el-radio-button label="upper">待备案</el-radio-button>
<!--            <el-button @click="exportHandle()"  class="btn" type="primary" style="margin-left: 1342px;">导入商品信息</el-button>-->
        </el-radio-group>
        <el-form style="float: right;" v-if="dataFormShow.isTofile=='0'">
            <el-form-item>
                <el-button  class="btn" type="primary" @click="exportExcel">导出数据</el-button>
                <!-- <el-button   class="btn"type="primary" plain @click="importExcel" >导入备案信息</el-button> -->
                <el-upload
                style="display:inline-block;margin-left:20px;"
                    class="upload-demo"
                    ref="upload"
                    :action='url'
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :show-file-list="false"
                    :headers="myHeaders"
                    :before-upload="beforeAvatarUpload"
                    name="file"
                    :on-progress="handleProgress"
                    @on-change="handleChange"
                    >
                    <el-button slot="trigger"  class="btn"  type="primary">{{uploadLoading?"导入中...":"导入备案信息"}}</el-button>
                    <!-- <div slot="tip" class="el-upload__tip">只能上传excel格式视频，且不超过10M</div> -->
                </el-upload>
            </el-form-item>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="width: 100%;margin-top:10px;"
        >
<!--            <el-table-column type="selection" width="70"></el-table-column>-->
            <el-table-column label="商品SKU ID" align="center">
                <template slot-scope="scope">
                    <div @click="detShowChange(scope.row)" style="cursor:pointer;color:#2260D2;">
                        {{scope.row.skuIdJp}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="主图" align="center">
                <template slot-scope="scope">
                    <div class="goodsPropsWrap">
                        <div class="goodsImg">
                            <img :src="scope.row.imageUrl | filterImgUrl" alt="" style=" object-fit: contain;width: 70px;height:70px;"/>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="商品名称" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.goodsName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="spe" label="规格" align="center" width="150">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.spe}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="storeName" label="所属店铺" align="center" width="150">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.storeName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="storeName" label="品牌" align="center">
            <template slot-scope="scope">
                <div>
                    {{scope.row.brandName}}
                </div>
            </template>
        </el-table-column>
            <el-table-column prop="price" label="售价" align="center">
                <template slot-scope="scope">
                    <div class="price1">￥{{scope.row.price?scope.row.price:'0.00'}}</div>
                </template>
            </el-table-column>
<!--            <el-table-column label="售价类型" align="center" width="150">-->
<!--                <template slot-scope="scope">-->
<!--                    <div>-->
<!--                        {{scope.row.goodsName}}-->
<!--                    </div>-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column prop="category " label="分类"  align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.category }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="tofileFlag" label="状态"  align="center">
<!--                <template slot-scope="scope">-->
<!--                    <div>-->
<!--                        {{scope.row.isTofile}}-->
<!--                    </div>-->
<!--                </template>-->
                <template>
                    <span v-if="dataForm.isTofile==0">待备案</span>
                    <span v-if="dataForm.isTofile==1">已备案</span>
                    <span v-if="dataForm.isTofile==2">不可备案</span>
                    <span v-if="dataForm.isTofile==3">待重新备案</span>
                </template>
            </el-table-column>
            <el-table-column prop="jdThirdCategory" label="京东三级分类"  align="center" v-if="dataFormShow.isTofile=='1'">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.jdThirdCategory}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="hsCode" label="HSCODE"  align="center" v-if="dataFormShow.isTofile=='1'">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.hsCode}}
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
                @size-change="pageSizeChangeHandle"
                @current-change="pageCurrentChangeHandle"
                :current-page="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import Cookies from 'js-cookie'
    import { registerUrl } from '@/api/url'
    import { backScanCategorys} from '@/api/api'
    import {importRegisterUrl,exportRegisterUrl} from "@/api/io.js"
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                myHeaders: {},//Cookies.get(teacher_token)
                url:`${importRegisterUrl}`,
                uploadLoading:false,
                mixinViewModuleOptions: {
                    activatedIsNeed: false,
                    getDataListURL: registerUrl,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/log/login/export',
                    // deleteURL: deleteWare,
                    deleteIsBatch: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                breaddata: [ "商品管理", "备案商品管理"],
                activeName: "",
                dataFormShow: {
                    goodsName: "",// 商品名称
                    goodsCsIdJp: "",// 商品sku ID
                    firstCategory: "",// 分类
                    storeName: "",// 店铺名称
                    brandName:"",// 品牌
                    tofileFlag:"",// 状态
                    isTofile:"",
                    transportFlag: ""
                },
                changeVal: "",
                alreadyOptions: [{
                    id: '0',
                    label: '待备案'
                },{
                    id: '3',
                    label: '待重新备案'
                }],
                stateOptions: [{
                    id: '0',
                    label: '未下发'
                }, {
                    id: '1',
                    label: '已下发'
                }],
                selectCategoryOption:[],
                classList:[],
                props: {
                    label:'name',
                    value: 'id',
                    children:'list'
                },
            }
        },
        components: {
            Bread,
            //orderDet
        },
        // ID类搜索框仅可输入数字、英文，最多可输入30个字符
        watch:{
            'dataFormShow.goodsCsIdJp':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    if(!/[a-zA-Z0-9]/.test(newV[i])){
                        this.dataFormShow.goodsCsIdJp = newV.replace(newV[i],"")
                    }
                }
            }
        },
        created() {
            // 第一次请求数据
            this.activeName =  this.status == undefined ? "" : this.status;
            this.dataFormShow.isTofile = "1";
            this.backScan();
            this.getData();
            this.myHeaders ={token:Cookies.get('token')} ;
        },
        methods: {
            handleChange(){
                if(this.classList.length!=0){
                    this.dataFormShow.categoryId = this.classList[this.classList.length-1]
                }
                console.log(this.dataFormShow.categoryId)
            },
            backScan(){
                var obj  = {
                    id:this.dataForm.id,
                    categoryName:this.dataForm.categoryName,
                }
                backScanCategorys(obj).then((res)=>{
                    if(res.code == 200){
                        this.selectCategoryOption = res.data;
                        // console.log( this.selectCategoryOption);
                        this.selectCategoryOption.forEach((item,index)=>{
                            item.list && item.list.forEach((item2,index2)=>{
                                item2.list="";
                            })
                        })

                    }else{

                    }
                })
            },
            handleClick(tab) {
                if(tab== ""){
                    this.dataFormShow.isTofile  = "1"
                }else if(tab== "upper"){
                    this.dataFormShow.isTofile  = "0"
                }
                // this.changeVal = val;
                this.dataForm.isTofile =  this.dataFormShow.isTofile;
                this.getDataList();
            },
            getData(){
                this.page = 1;
                this.dataForm = {};
                for(let key in this.dataFormShow){
                    this.$set(this.dataForm,`${key}`,this.dataFormShow[key]);
                }
                console.log(this.dataForm);
                this.getDataList()
            },
            detShowChange(row){
                this.$emit("detShowChange",row);
            },
            reset() {
                this.dataFormShow.goodsCsIdJp = "";//商品sku ID
                this.dataFormShow.goodsName = "";//商品名称/商品货号
                this.dataFormShow.brandName = "";//品牌名称
                this.dataFormShow.storeName = "";//店铺名称
                this.dataFormShow.transportFlag = "";//下发状态
                this.dataFormShow.categoryId = "";
                this.dataForm.categoryId = "";
                this.dataForm.goodsCsIdJp = "";//商品sku ID
                this.dataForm.goodsName = "";//商品名称/商品货号
                this.dataForm.brandName = "";//品牌名称
                this.dataForm.storeName = "";//店铺名称
                this.dataForm.transportFlag = "";//下发状态
                this.classList = [];//分类名称
                this.handleClick();
            },
            // 导入
            importExcel(){
                // importRegister
            },
            // 导出
            exportExcel(){
                let url = ""
                let kvArr = Object.entries(this.dataFormShow);
                kvArr.forEach(v=>{
                    if(Object.prototype.toString.call(v[1]) =='[object Object]'){
                        arguments.callee(v[1]);
                    }else{
                        url += v.join('=')+'&'
                    }
                })

                url  = url.substring(0,url.length-1);
                url = exportRegisterUrl + "?"+url
                window.open(url);
            },
            beforeAvatarUpload(file) {
                this.$refs.upload.abort();
                this.progress = 0;
                console.log(file);
                // const isMP4 = file.type === 'video/mp4';
                const isLt2M = file.size / 1024 / 1024 < 500;

                // if (!isMP4) {
                //     this.$message.error('只能上传mp4格式视频!');
                // }
                if (!isLt2M) {
                    this.$message.error('视频大小不能超过 500MB!');
                }
                // return isMP4 && isLt2M;
                return isLt2M;
            },
            handleProgress(event, file, fileList){
                this.uploadLoading = true;
                console.log([event, file, fileList]);

                if(file.percentage>=90){
                    this.progress = 90;
                }else{
                    this.progress =parseInt(file.percentage);
                }

            },
            uploadSuccess(response, file, fileList){
                // console.log(file.per);
                let that = this;
                 that.uploadLoading = false;
                if(response.code=='200'){
                    that.$message({
                        message: response.msg,
                        type: "success",
                        duration: 1500
                    })
                    // that.dataFormSubmit();
                }else{
                    // that.progress = 0;
                    that.$message({
                        message: response.msg,
                        type: "error",
                        duration: 1500
                    })
                }
            },
            uploadError(response, file, fileList) {
                let that = this;
                that.uploadLoading = false;
                console.log("上传文件失败response" +response);
                console.log("上传文件失败file" +file);
                console.log("上传文件失败fileList" +fileList);
                that.$message({
                message: "导入失败，请重新导入",
                type: "error",
                duration: 1500
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>