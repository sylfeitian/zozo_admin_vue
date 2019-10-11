<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataFormShow" @keyup.enter.native="getDataList()" >
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="商品名称：">
                <el-input v-model="dataFormShow.goodsName" placeholder="商品名称/商品编号" maxlength="300"></el-input>
            </el-form-item>
            <el-form-item label="商品ID：">
                <el-input v-model="dataFormShow.goodsCsIdJp" placeholder="请输入商品skuID" maxlength="30" ></el-input>
            </el-form-item>
            <el-form-item label="分类：">
                <!-- <el-select v-model="dataFormShow.categoryId" placeholder="请选择">
                    <el-option
                            v-for="item in selectCategoryOption"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                    </el-option>
                </el-select> -->
                <el-cascader
                        :options="selectCategoryOption"
                        v-model="classList"
                        change-on-select
                        :clearable="true"
                        :props="props"
                        @change="handleChange">
                </el-cascader>
            </el-form-item>
            <el-form-item  label="品牌：">
                <el-select v-model="dataFormShow.brandId" placeholder="请选择">
                    <el-option
                            v-for="item in brandName"
                            :key="item.id"
                            :label="item.brandName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="所属店铺：">
                <el-select v-model="dataFormShow.storeId" placeholder="请选择">
                    <el-option
                            v-for="item in storeName"
                            :key="item.id"
                            :label="item.storeName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否已售完：">
                <el-select v-model="dataFormShow.sellState" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <!--//showDetail()-->
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData">查询</el-button>
                <el-button class="btn" type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
            <el-form-item>
                <importAndExport :importAndExportOptions="importAndExportOptions" :dataForm="dataForm"  @getDataList="getDataList"></importAndExport>
            </el-form-item>
        </el-form>
        
      
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="width: 100%;margin-top:20px;"
        >
            <el-table-column label="商品ID" align="center" width="180">
                <template slot-scope="scope">
                    <div @click="detShowChange(scope.row)" style="cursor:pointer;color:#2260D2;">
                        {{scope.row.goodsCsIdJp}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="主图" prop="imageUrl" align="center" width="160">
                <template slot-scope="scope">
                    <img
                        :src="scope.row.imageUrl | filterImgUrl"
                        alt=""
                        style=" object-fit: contain;width: 70px;height:70px;"
                    >
                </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" align="center">
                <template slot-scope="scope">
                    <div :title="scope.row.goodsName">
                        {{scope.row.goodsName}}
                    </div>
                </template>

            </el-table-column>
            <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="price" label="售价" width="100" align="center">
                <template slot-scope="scope">
                    <span  v-if="scope.row.priceType=='sale'">￥{{scope.row.discountPrice?scope.row.discountPrice:"0.00"}}</span>
                    <span  v-else-if="scope.row.priceType=='proper'">￥{{scope.row.sellPrice?scope.row.sellPrice:"0.00"}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="categoryName" label="分类"  align="center"></el-table-column>
            <el-table-column prop="storeName" label="所属店铺" align="center"></el-table-column>
            <el-table-column prop="showWeb" label="上架状态" align="center">
                 <template slot-scope="scope">
                    <span v-if="scope.row.showWeb==0">待上架</span>
                    <span v-else-if="scope.row.showWeb==1">已上架</span>
                    <span v-else-if="scope.row.showWeb==2">已下架</span>
                </template>
            </el-table-column>
            <el-table-column prop="stockQuantity" label="库存数" align="center"></el-table-column>
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
    import importAndExport from "@/components/import-and-export"
    import { getdatagoods,} from "@/api/url"
    import { getdatabrands, getdatacategory, getdatastores} from "@/api/api"
    //import detail from "./detail";
  import { stockExport} from '@/api/io'
    
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                importAndExportOptions:{
                    // importUrl:colorcategoryImportExcel,//导入接口
                    // importWord:"导入信息",
                    exportUrl:stockExport,//导出接口
                    exportWord:"导出数据",
                },
            	mixinViewModuleOptions: {
		          getDataListURL: getdatagoods,
		          getDataListIsPage: true,
		          // exportURL: '/admin-api/log/login/export',
		          deleteURL: '',
		          dataListLoading: false, 
		          deleteIsBatch: true,
		          deleteIsBatchKey: 'id'
			    },
                breaddata: [ "商品管理", "查看库存"],
                dataFormShow: {  
                    goodsName: "",//商品名称/商品货号
                    goodsCsIdJp:"",  //商品id
                    categoryId:'',// 中国分类Id
                    sellState:'',// 是否售完，已售完1，未售完0
                    storeId:'',//所属店铺名称
                    brandId:'',//品牌名称

                    // brandName: "",//品牌名称
                    // storeName: "",//店铺名称
                },
                 dataForm: {
				},
                storeName:[],  //店铺名称
                selectCategoryOption: [],//中国分类id
                brandName: [],//品牌名称
                options: [{  //是否可售
                    value: '',
                    label: '全部'
                }, {
                    value: '1',
                    label: '已售完'
                }, {
                    value: '0',
                    label: '未售完'
                }],
                activeName: "",
                data: {}, //总数据
                dataList: [],
                dataListLoading: false,
                detailOrList: 1,
                addressInfo: [], //地址数据
                orderLog: [], //操作日志
                orderData: [],
                isChange: true, //true--列表 false--详情
                multipleSelection:[],
                changeVal: "",
                isIndeterminate: false,
                checkednodeslist: [],
                checkAll: false,
                checked:false,
                props: {
                    label:'name',
                    value: 'id',
                    children:'list'
                },
                dataFormShow:{
                    goodsName:'',//商品中文名称
                    goodsCsIdJp:'',//商品spuid
                    categoryId:'',// 中国分类Id
                    sellState:'',// 是否售完，已售完1，未售完0
                    storeId:'',//所属店铺名称
                    brandId:'',//品牌名称

                    // brandName:'',//品牌名称
                    // storeName:'',//	所属店铺名称
                    // categoryId:'',//中国分类Id
                    // sellState:'',//是否售完，已售完1，未售完0
                },
                classList:[],
            }
        },
        components: {
            Bread,
            //detail,
            importAndExport
        },
        // ID类搜索框仅可输入数字、英文，最多可输入30个字符
        watch:{
            'dataFormShow.goodsCsIdJp':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    if(!/[a-zA-Z0-9]/.test(newV[i])){
                        this.dataFormShow.goodsCsIdJp = newV.replace(newV[i],"")
                    }
                }
                if(newV.length>30){
                    this.dataFormShow.goodsCsIdJp = newV.substr(0,30)
                }
            }
        },
        created () {
            // 第一次请求数据
            this.activeName =  this.status == undefined ? "" : this.status;
            this.dataFormShow.goodsShow = this.status == undefined ? "" : this.status;
            
            this.dataFormShow.sellState = this.options[0].value;
            this.getselectdata();
        },
        methods: {
        	//获取select  下拉内容
        	getselectdata(){
        		//获取品牌列表
        		getdatabrands().then((res)=>{
		  			if(res.code == 200){
		  				console.log(res);
		  				this.brandName = res.data;
		  			}else{
		  				this.$message(res.msg);
		  			}
		  		}).catch(()=>{
		  			this.$message("服务器错误");
		  		})
	  		
                //获取中国分类
                getdatacategory().then((res)=>{
                    if(res.code == 200){
                        console.log(res);
                        this.selectCategoryOption = res.data;
                        this.selectCategoryOption.forEach((item,index)=>{
                            // item.label = item.name
                            // item.value = item.id
                            item.list && item.list.forEach((item2,index2)=>{
                                // item2.label = item2.name
                                // item2.value = item2.id
                                item2.list="";
                            })
                        })
                    }else{
                        this.$message(res.msg);
                    }
                }).catch(()=>{
                    this.$message("服务器错误");
                })
                
                //获取点铺列表
                getdatastores().then((res)=>{
                    if(res.code == 200){
                        this.storeName = res.data;
                    }else{
                        this.$message(res.msg);
                    }
                }).catch(()=>{
                    this.$message("服务器错误");
                })
            },
            // 切换中国分类
            handleChange(){
                if(this.classList.length!=0){
                    this.dataFormShow.categoryId = this.classList[this.classList.length-1]
                }else{
                this.dataFormShow.categoryId = "";//分类id

                }
                console.log(this.dataFormShow.categoryId)
            },
            showDetail(id){
                this.$emit("showDetail",id);
            },
            getData(){  //搜索
                this.page = 1;
            	this.dataForm = {};
                for(let key in this.dataFormShow){
                    this.$set(this.dataForm,`${key}`,this.dataFormShow[key]);
                }
                this.getDataList()
            },
            reset() {
                this.dataFormShow.goodsName = "";//商品名称/商品货号
                this.dataFormShow.goodsCsIdJp = "";//商品id
                this.dataFormShow.brandId = "";//品牌名称
                this.dataFormShow.categoryId = "";//分类id
                this.dataFormShow.storeId = "";//店铺名称
                this.dataFormShow.sellState = "";//是否可售
                
                this.dataForm.goodsName = "";//商品名称/商品货号
                this.dataForm.goodsCsIdJp = "";//商品id
                this.dataForm.brandId = "";//品牌名称
                this.dataForm.categoryId = "";//分类id
                this.dataForm.storeId = "";//店铺名称
                this.dataForm.sellState = "";//是否可售
                this.classList = [];
                this.getDataList();
            },
            // 编辑
            goEidt(row){
                console.log(row);
                this.$router.push({
                    path: 'mggoods-goods-add',
                    query:{
                        gcId:row.id,
                    }
                })
            },
            //页面跳转
            changeState() {
                this.isChange = !this.isChange;
                this.getDataList(); //刷新页面数据
            },
            //详情页展示判断
            detShowChange(row) {
                this.$emit("showDetail",row);
            },
            //查看详情
            getSalesDet(index, statue) {
                if (res.code == 200) {
                    console.log("123")
                } else {
                    this.$message({
                        type: "warning",
                        message: res.msg
                    });
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .grayLine{
        border-bottom: 0!important;
    }
    .bottomFun {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .bottomFunLeft {
            width: 450px;
            display: flex;
            align-items: center;
        }
    }
    .cell div{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    /*/deep/ .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }*/

</style>