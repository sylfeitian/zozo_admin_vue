<template>
    <div>
        <Bread :breaddata="breaddata" :index = "'1'" @changePage = "changePage"></Bread>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item label="商品货号：">
                <el-input v-model.trim="dataForm.goodsId"  placeholder="请输入商品货号" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品名称：">
                <el-input v-model.trim="dataForm.goodsName" placeholder="请输入商品名称" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
                <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
            </el-form-item>
            <el-form-item style="float:right">
                <el-button type="primary" @click="deleteRow()">批量删除</el-button>
                <!-- <el-button type="primary" @click="saveSort">保存排序</el-button> -->
                <el-button type="primary" @click="addGoods()">添加商品</el-button>
            </el-form-item>
        </el-form>

        <el-table
           :data="dataList"
            v-loading="dataListLoading"
            @selection-change="handleSelectionChange"
            border
            style="width: 100%">
            <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50">
            </el-table-column>
            <!-- <el-table-column
                type="index"
                prop="$index"
                align="center"
                label="序号"
                width="70">
                <template slot-scope="scope">
                    {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
                </template>
            </el-table-column> -->
            <el-table-column
                prop="id"
                label="商品ID"
                align="center"
                width="180">
            </el-table-column>
             <!-- <el-table-column
                prop="sort"
                label="排序"
                align="center"
                width="210">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.sort" :step="1" :min="0" :max="999999" ></el-input-number>
                </template>
            </el-table-column> -->
            <el-table-column
                prop="goodsName"
                label="商品名称"
                align="center"
                min-width="300">
            </el-table-column>
            <el-table-column
                prop="goodsTypeName"
                align="center"
                label="所属分类">
            </el-table-column>
            <el-table-column
                align="center"
                label="销售价格">
                 <template slot-scope="scope">
                   <span>￥{{scope.row.salePrice?scope.row.salePrice:'0.00'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button class="artdanger" type="text" size="small" @click="deleteRow(scope.row)">删除</el-button>
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

        <modelEditSku v-if="modelEditSkuVisible" ref="modelEditSkuCompon" @searchDataList="getDataList"></modelEditSku>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { categoryactivitygoodsPageUrl } from '@/api/url'
    import { categoryactivitygoodsBatch,deleteCateActgoods,categoryactivitygoodsUpdateBach } from '@/api/api'
    import Bread from "@/components/bread";
    import modelEditSku from "./modules/model-edit-sku";

    export default {
        mixins: [mixinViewModule],
        components:{Bread,modelEditSku},
        data () {
            return {
                dds:'12121212',
                mixinViewModuleOptions: {
                    getDataListURL: categoryactivitygoodsPageUrl,
                    activatedIsNeed: false,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/store/export',
                    deleteURL: "?????",
                    deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                multipleSelection:[],
                modelEditSkuVisible:false,
                dataListLoading:false,
                dataList:[],
                breaddata: ["营销管理", "精选分类","添加商品"],
                dataForm: {
                    goodsName:'',//商品名称
                    goodsId:'',//商品货号
                    categoryId:'',//精选分类ID
                },
                listdataForm:{
                    storeId:'',
                },
                row:'',
            }
        },
        created(){
        },
        methods: {
            init(row){
                console.log(row)
                this.row = row;
                this.dataForm.categoryId = row.id;
                this.getData();
            },
            getData(){
                this.dataForm.page =1;
                this.getDataList();
            },
            //返回
            changePage(){
                this.$emit('showListFun')
            },
            reset(){
                this.dataForm.goodsName= "";//商品名称
                this.dataForm.goodsId= "";//商品货号
                this.getData();
            },
            changeCheck($event,id){
                // $event当前状态值选中为true,未选中为false，id：为你要操作的分类id
                console.log('??????',$event,id)
            },
             // 表格前端的checkbox
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(this.multipleSelection);
            },
            // 添加商品
            addGoods(){
                this.modelEditSkuVisible = true;
                this.$nextTick(()=>{
                    this.$refs.modelEditSkuCompon.init(this.row);
                })
            },
             // 保存排序
            saveSort(){
                let dataArr = [];
                this.dataList.forEach((item,index)=>{
                    dataArr.push({
                        id:item.id,//主键id
                        goodsId:item.goodsId,//活动商品id ,
                        sort:item.sort,// 排序
                    })
                })
                var obj = dataArr
                categoryactivitygoodsUpdateBach(obj).then((res)=>{
                            if(res.code==200){
                            this.$message.success(res.msg);
                            this.getDataList();
                        }else{
                            this.$message.error(res.msg);
                        }
                })
            },
            // 单个删除和批量删除
            deleteRow(row){
                if(!row && this.multipleSelection.length==0){
                    this.$message.warning("至少选择一个商品")
                    return;
                }
                let that = this;
                console.log(row);
                 console.log(that.row);
                this.$confirm("是否确认删除?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText:"取消",
                    type: 'warning'
                }).then(() => {
                    let ids = [];
                    if(row){//单个删除
                        ids = [row.id]
                    }else{//批量删除
                        that.multipleSelection.forEach((item,index)=>{
                            ids.push(item.id);
                        })
                    }
                    var obj = {
                        data:ids,//商品spuid
                    };
                    console.log(deleteCateActgoods);
                    deleteCateActgoods(obj).then((res)=>{
                        if(res.code==200){
                            that.$message.success(res.msg);
                            that.getDataList();
                        }else{
                            that.$message.error(res.msg);
                        }
                    })
                }).catch(() => {
                })
            },
        }
    };
</script>
<style lang="scss" scoped>

</style>
