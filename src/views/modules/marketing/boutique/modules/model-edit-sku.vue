<template>
   <!-- 修改弹框 -->
    <el-dialog
        :visible.sync="visible"
        :close-on-click-modal = "false"
        class="editDialog"
         :before-close="closeDialog"
        width="70%">
        <el-form :inline="true" :model="dataForm"  ref="addForm">
            <el-form-item label="商品名称：">
                <el-input v-model="dataForm.goodsName"  placeholder="请输入商品货号" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品货号：">
                <el-input v-model="dataForm.goodsId" placeholder="请输入商品名称" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item label="选择分类：">
                <el-cascader
                        :options="selectCategoryOption"
                        v-model="classList"
                        change-on-select
                        :clearable="true"
                        :props="props"
                        @change="handleChange">
                </el-cascader>
            </el-form-item>
            <el-form-item >
                <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
            </el-form-item>
        </el-form>
        
        <el-table
            :data="dataList"
            v-loading="dataListLoading"
            border
             @selection-change="handleSelectionChange"
            style="width: 100%">
             <el-table-column
                type="selection"
                width="70">
            </el-table-column>
            <el-table-column
                prop="name"
                label="商品名称"
                align="center"
                width="180">
            </el-table-column>
            <el-table-column
                prop="id"
                align="center"
                label="商品id">
            </el-table-column>
            <el-table-column
                prop="goodsTypeName"
                align="center"
                label="所属分类">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="180"
                label="价格">
                <template slot-scope="scope">
                    <span>{{scope.row.sellPrice?scope.row.sellPrice:'0.00'}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small">适用于全部规格</el-button>
                </template>
            </el-table-column> -->
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

        <span slot="footer" class="dialog-footer" v-if="!dataListLoading">
            <el-button @click="dataFormCancel()">取 消</el-button>
            <el-button type="primary" @click="dataFormSubmit('addForm')" :loading="saveLoading">{{saveLoading?'提交中..':'确 定'}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import {editLimitActivityGoods,getdatacategory} from "@/api/api.js"
     import {categoryactivitygoodsBatch} from "@/api/api.js" 
     import {categoryactivityGoodsPagePopUrl} from "@/api/url.js"
    export default {
        name: "model-add-edit-data",
          mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: categoryactivityGoodsPagePopUrl,
                     activatedIsNeed: false,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/store/export',
                    deleteURL: "?????",
                    deleteIsBatch: true,
                // deleteIsBatchKey: 'id'
                },
                visible : false,
                loading : false,
                saveLoading:false,
                dataList:[],
                title:'',
                multipleSelection:[],
                dataForm:{
                    goodsId: null,//商品id ,
                    goodsName: null,//商品名称
                    categoryId:'',//分类ID
                    categoryActivityId:'',//精选分类分类ID
                },
                moneyNum:99.9,
                kucun:'',
                row:'',
                selectCategoryOption: [],//中国分类id
                classList:[],
                props: {
                    label:'name',
                    value: 'id',
                    children:'list'
                },
            }
            
        },
        created(){
        	
        },
        methods: {
            init (row) {
            	this.getDatacategoryFn();
                this.visible = true;
                this.saveLoading = false;
                this.$nextTick(() => {
                    this.row = row;
                    this.dataForm.categoryActivityId = row.id
                    this.title = "修改";
                    // this.backScan();
                    this.getData();
                   
                })
            },
            //编辑回显
            // backScan(){
            //     var obj  = {
            //        params:{
            //         activityId:this.row.id,//活动ID
            //         goodsId:this.row2.id,//商品ID
            //         activityType:1,//活动类型 0秒杀 1限量 2预售
            //        }

            //     }
            //     this.loading = true;
            //     limitActivitySkuChoice(obj).then((res)=>{
            //         this.loading = false;
            //         if(res.code == 200){
            //             Object.assign(this.dataForm,res.data);
            //             if(res.data && res.data.activityGoodsChoiceSkuVOList){
            //                 this.dataList =  res.data.activityGoodsChoiceSkuVOList
            //             }else{
            //                 this.dataList = []
            //             }
                      
            //         }
            //     })
            // },
            getData(){
                this.page=1;
                this.getDataList();
            },
             //获取中国分类
            getDatacategoryFn(){
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
            },
            // 切换中国分类
            handleChange(){
                if(this.classList.length!=0){
                    this.dataForm.categoryId = this.classList[this.classList.length-1]
                }else{
                this.dataForm.categoryId = "";//分类id

                }
                console.log(this.dataForm.categoryId)
            },
            // 表格前端的checkbox
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(this.multipleSelection);
            },
            reset(){
                this.dataForm.goodsName=""
                this.dataForm.goodsId=""
                this.dataForm.categoryId=""
                this.classList = [];
                this.getData();
            },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                // console.log(this.dataForm);
                // this.$refs[formName].validate((valid) => {
                    // if (valid) {
                        if(this.multipleSelection.length==0){
                            this.$message.warning("至少勾选一个");
                            return
                        }
                         var ids = [];
                        this.multipleSelection.forEach((item,index)=>{
                            ids.push(item.id);
                        })
                        var obj = {
                            "activityId": this.row.id,// 活动ID ,
                            "categoryName": this.row.title,//精选分类名称 ,
                            "ids":ids
                        }
                        categoryactivitygoodsBatch(obj).then((res)=>{
                            // console.log(res);
                            if(res.code==200){
                                this.dataFormCancel();
                                this.$message.success(res.msg);
                            }else{
                                this.$message.error(res.msg);
                            }
                        })
                //     } else {
                //         //console.log('error 添加失败!!');
                //         return false;
                //     }
                // })
            },
            dataFormCancel(){
                this.visible = false;
                this.closeDialog();
            },
            closeDialog() {
                 this.$emit('searchDataList');
                this.$parent.modelEditSkuVisible = false;
            }
        }
    }
</script>

<style scoped>
    /*/deep/.el-form-item__content:nth-child(1) {*/
    /*    margin-left: 50px!important;*/
    /*}*/
    .title {
        margin-left: -70px;
    }
</style>