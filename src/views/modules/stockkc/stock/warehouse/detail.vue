<template>
    <div>
        <Bread :breaddata="breaddata" @changePage="changePage" :index="'0'"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="form"  >
            <el-form-item prop="id" label="仓库ID：">
                <span>{{form.id}}</span>
            </el-form-item>
            <el-form-item prop="warehouseName" label="仓库名称：">
                <span>{{form.warehouseName}}</span>
            </el-form-item>
            <el-form-item prop="addressInfo" label="仓库所在地：">
                <span>{{form.addressInfo}}</span>
            </el-form-item>
            <el-form-item prop="type" label="仓库种类：">
                <template slot-scope="scope">
                    <span  v-if="form.type==0">发货仓</span>
                    <span  v-if="form.type==1">退货仓</span>
                </template>
            </el-form-item>
            <el-form-item prop="name" label="负责人：">
                <span>{{form.name}}</span>
            </el-form-item>
            <el-form-item prop="phone" label="联系方式：">
                <span>{{form.phone}}</span>
            </el-form-item>
            <el-form-item prop="isEnable" label="状态：">
                <template slot-scope="scope">
                    <span  v-if="form.isEnable==0">不启用</span>
                    <span  v-if="form.isEnable==1">启用</span>
                </template>
            </el-form-item>
        </el-form>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataFormShow" >
            <el-form-item prop="skuId" label="skuID：">
                <el-input v-model.trim="dataFormShow.skuId" placeholder="请输入编号" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item prop="goodsName" label="商品名称：">
                <el-input v-model.trim="dataFormShow.goodsName" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item prop="storeName" label="所属店铺：" >
                <el-input v-model.trim="dataFormShow.storeName" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item prop="brandName" label="品牌：">
                <el-input v-model.trim="dataFormShow.brandName" placeholder="请输入编号" ></el-input>
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
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData()">查询</el-button>
                <el-button class="btn" @click="reset('dataFormShow')" type="primary" plain>重置</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary"  plain @click="exportHandle()">导出</el-button>
        <el-table
                width="100%"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%;margin-top:10px;"
        >
            <el-table-column prop="skuId" label="skuId" align="center"></el-table-column>
            <el-table-column prop="specSerial" label="图片" align="center">
                <template slot-scope="scope">
                    <div class="goodsPropsWrap">
                        <div class="goodsImg">
                            <img :src="scope.row.imageUrl | filterImgUrl" alt=""/>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="storeName" label="所属店铺" align="center"></el-table-column>
            <el-table-column prop="specValue" label="规格" align="center"></el-table-column>
            <el-table-column prop="category" label="分类" align="center "></el-table-column>
            <el-table-column prop="sellPrice" label="商品售价" align="center">
                  <template slot-scope="scope">
                    <span>￥{{scope.rowsellPrice?scope.rowsellPrice:'0.00'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="stockQuantity" label="库存数量" align="center"></el-table-column>
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
    import cloneDeep from 'lodash/cloneDeep'
    import Bread from "@/components/bread";
    import { skuGoods } from '@/api/url'
    import { backScanCategorys } from '@/api/api'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: skuGoods,
                    getDataListIsPage: true,
                    activatedIsNeed:false,
                    // exportURL: '/admin-api/log/login/export',
                    // deleteURL: deleteWare,
                    deleteIsBatch: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                breaddata: [ "仓库管理", "仓库详情"],
                row:"",
                dataFormShow:{
                    skuId: "",
                    goodsName: "",
                    storeName: "",
                    brandName: "",
                    categoryId:""
                },
                dataForm: {
                    skuId: "",
                    goodsName: "",
                    storeName: "",
                    brandName: "",
                    categoryId:""
                },
                form:{},
                dataList: [],
                dataListLoading: false,
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
            Bread
        },
        watch: {
            // ID类搜索框仅可输入数字、英文，最多可输入30个字符
            "dataFormShow.skuId": function(newV, oldV) {

                for (let i = 0; i < newV.length; i++) {
                    if (!/[a-zA-Z0-9\s]/.test(newV[i])) {
                        this.dataFormShow.skuId = newV.replace(newV[i], "");
                    }
                }
                if(newV.length>30){
                    this.dataFormShow.skuId = newV.substr(0,30)
                }
            },
            'dataFormShow.goodsName':function(newV,oldV) {
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 300) { //输入字符大于300的时候过滤
                        this.dataFormShow.goodsName = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
            'dataFormShow.storeName':function(newV,oldV) {
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 300) { //输入字符大于300的时候过滤
                        this.dataFormShow.storeName = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
            'dataFormShow.brandName':function(newV,oldV) {
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 300) { //输入字符大于300的时候过滤
                        this.dataFormShow.brandName = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
        },
        created () {
            this.backScan1();
        },
        methods: {
             init (row) {
                this.visible = true;
                this.row = row;
                console.log(row);
                this.backScan(row);
                // this.$nextTick(() => {
                //     this.$refs['addForm'].resetFields();
                //     // this.getApplyPullList();
                // })
                 console.log(11112);
                console.log(row);
                this.dataFormShow.id = row.id
                this.getData();
            },
            getData(){
                this.page = 1;
               

                this.dataForm = cloneDeep(this.dataFormShow);
                this.getDataList();
            },
            handleChange(){
                if(this.classList.length!=0){
                    this.dataFormShow.categoryId = this.classList[this.classList.length-1]
                }
                console.log(this.dataFormShow.categoryId)
            },
            backScan1(){
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
            
            // 编辑回显
            backScan(row){
                console.log(row);
                // var obj  = {
                //     id:this.row.id,
                //     warehouseName:this.row.warehouseName,
                //     addressInfo:this.row.addressInfo,
                //     type:this.row.type,
                //     name:this.row.name,
                //     phone:this.row.phone
                // }
                // warePage(obj).then((res)=>{
                //     if(res.code == 200){
                //         Object.assign(this.form,res.data);
                //
                //     }else{
                //
                //     }
                // })
                this.form = row;
            },
            changePage(){
                this.goList();
            },
            goList(){
                this.$emit("showList");
            },
            reset() {
                this.dataFormShow.skuId = "";//商品sku ID
                this.dataFormShow.goodsName = "";//商品名称/商品货号
                this.dataFormShow.brandName = "";//品牌名称
                this.dataFormShow.storeName = "";//店铺名称
                this.dataFormShow.categoryId = "";
                // this.dataForm.categoryId = "";
                // this.dataForm.skuId = "";//商品sku ID
                // this.dataForm.goodsName = "";//商品名称/商品货号
                // this.dataForm.brandName = "";//品牌名称
                // this.dataForm.storeName = "";//店铺名称
                this.classList = [];//分类名称
                this.getData();
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
    .goodsPropsWrap{
        text-align: center;
    }
    .goodsImg{
        img{
             width: 100px;
             height: 100px;
        }
    }
</style>