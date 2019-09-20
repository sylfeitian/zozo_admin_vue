<template>
    <div>
        <Bread :breaddata="breaddata" @changePage="changePage" :index="'0'"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item prop="id" label="仓库ID：">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item prop="warehouseName" label="仓库名称：">
                <span>{{dataForm.warehouseName}}</span>
            </el-form-item>
            <el-form-item prop="addressInfo" label="仓库所在地：">
                <span>{{dataForm.addressInfo}}</span>
            </el-form-item>
            <el-form-item prop="type" label="仓库种类：">
                <template slot-scope="scope">
                    <span  v-if="dataForm.type==0">发货仓</span>
                    <span  v-if="dataForm.type==1">退货仓</span>
                </template>
            </el-form-item>
            <el-form-item prop="name" label="负责人：">
                <span>{{dataForm.name}}</span>
            </el-form-item>
            <el-form-item prop="phone" label="联系方式：">
                <span>{{dataForm.phone}}</span>
            </el-form-item>
            <el-form-item prop="isEnable" label="状态：">
                <template slot-scope="scope">
                    <span  v-if="dataForm.isEnable==0">不启用</span>
                    <span  v-if="dataForm.isEnable==1">启用</span>
                </template>
            </el-form-item>
        </el-form>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item prop="skuId" label="skuID：">
                <el-input v-model="dataForm.skuId" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="goodsName" label="商品名称：">
                <el-input v-model="dataForm.goodsName" placeholder="请输入" maxlength="300"></el-input>
            </el-form-item>
            <el-form-item prop="storeName" label="所属店铺：" placeholder="请输入">
                <el-input v-model="dataForm.storeName" ></el-input>
            </el-form-item>
            <el-form-item prop="brandName" label="品牌：" placeholder="请输入">
                <el-input v-model="dataForm.brandName" ></el-input>
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
                <el-button class="btn" @click="reset('dataForm')" type="primary" plain>重置</el-button>
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
            <el-table-column prop="aftersaleSn" label="skuID" align="center"></el-table-column>
            <el-table-column prop="specSerial" label="图片" align="center">
                <template slot-scope="scope">
                    <div class="goodsPropsWrap">
                        <div class="goodsImg">
                            <img :src="scope.row.pictureUrl | filterImgUrl" alt=""/>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="memberName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="storeName" label="所属店铺" align="center"></el-table-column>
            <el-table-column prop="spe" label="规格" align="center"></el-table-column>
            <el-table-column label="分类" align="center ">
                <template slot-scope="scope">
                    <span>{{dataForm.firstCategory}}</span>>
                    <span>{{dataForm.secondCategory}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sellPrice" label="商品售价" align="center"></el-table-column>
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
                    // exportURL: '/admin-api/log/login/export',
                    // deleteURL: deleteWare,
                    deleteIsBatch: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                breaddata: [ "仓库管理", "仓库详情"],
                row:"",
                dataForm: {
                    skuId: "",
                    goodsName: "",
                    storeName: "",
                    brandName: "",
                    categoryId:""
                },
                dataForm:{},
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
        created () {
            this.backScan1();
            this.getDataList();
        },
        methods: {
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
            init (row) {
                this.visible = true;
                this.row = row;
                console.log(row);
                this.backScan(row);
                // this.$nextTick(() => {
                //     this.$refs['addForm'].resetFields();
                //     // this.getApplyPullList();
                // })
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
                this.dataForm = row;
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
                this.dataForm.categoryId = "";
                this.dataForm.skuId = "";//商品sku ID
                this.dataForm.goodsName = "";//商品名称/商品货号
                this.dataForm.brandName = "";//品牌名称
                this.dataForm.storeName = "";//店铺名称
                this.classList = [];//分类名称
                this.handleClick();
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