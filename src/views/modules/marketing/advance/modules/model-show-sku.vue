<template>
   <!-- 修改弹框 -->
    <el-dialog
        :visible.sync="visible"
        :show-close = "true"
        class="editDialog"
        width="70%">
        <div class="goodsPresent" >
            <img :src="this.dataForm.mainImageUrl | filterImgUrl" alt="" />
            <div class="goodsPresentModle">
                <div class="goodsTitle">{{this.dataForm.name?this.dataForm.name:"暂无名字"}}</div>
                <div class="goodsmoney">￥ {{this.dataForm.sellPrice?this.dataForm.sellPrice:'0.00'}}</div>
            </div>
        </div>
        <!-- scope.$index+1+(parseInt(page)-1)* parseInt(limit) -->
        <el-table
            :data="dataList"
            v-loading="loading"
            border
             @selection-change="handleSelectionChange"
            style="width: 100%">
                <!-- <el-table-column
                    type="selection"
                    width="70">
                </el-table-column> -->
                <el-table-column
                    prop="id"
                    label="skuID"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="specInfo"
                    align="center"
                    label="规格">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="销售价格">
                    <template slot-scope="scope">
                        <span>￥{{scope.row.sellPrice?scope.row.sellPrice:'0.00'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="activityQuantity"
                    label="活动库存">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="cartLimit"
                    label="日本限购数量">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="personLimit"
                    label="每人限购">
                </el-table-column>
                <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
    import {limitActivitySkuChoice,deleteLimitActivityGoodscs} from "@/api/api.js"
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                saveLoading:false,
                dataList:[],
                title:'',
                multipleSelection:[],
                dataForm:{
                    activityPrice: null,//秒杀价格 ,
                    id: "",//spu主键 ,
                    mainImageUrl:"",//商品主图 ,
                    name: "",//商品名称 ,
                    sellPrice: "0.00",//销售价格
                },
                moneyNum:99.9,
                kucun:'',
                row:'',
                row2:'',
            }
            
        },
        methods: {
            init (row,row2) {
                this.visible = true;
                this.saveLoading = false;
                this.$nextTick(() => {
                    this.row = row;
                    this.row2 = row2;
                    this.title = "修改";
                    this.backScan();
                })
            },
            //编辑回显
            backScan(){
                var obj  = {
                   params:{
                    activityId:this.row.id,//活动ID
                    goodsId:this.row2.goodsId,//商品ID
                    activityType:2,//活动类型 0秒杀 1限量 2预售
                    type:2,
                   }

                }
                this.loading = true;
                limitActivitySkuChoice(obj).then((res)=>{
                    this.loading = false;
                    if(res.code == 200){
                        Object.assign(this.dataForm,res.data);
                        if(res.data && res.data.activityGoodsChoiceSkuVOList){
                            this.dataList =  res.data.activityGoodsChoiceSkuVOList
                        }else{
                            this.dataList = []
                        }
                    }
                })
            },
            // 表格前端的checkbox
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(this.multipleSelection);
            },
            // 批量修改数量
            changeAll(row){
                let that = this
                this.$confirm("是否确认适用于全部规格？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText:"取消",
                    type: 'warning'
                }).then(() => {
                    that.dataList.forEach((item,index)=>{
                        item.activityQuantity = row.activityQuantity
                        item.personLimit = row.personLimit
                    })

                }).catch(() => { 
                })
            },
            deleteRow(row){
               let that = this;
               this.$confirm("是否确认删除?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText:"取消",
                    type: 'warning'
                }).then(() => {
                    var obj = {
                        data:{
                            activityId: that.row.id,//活动id 
                            goodsCsId: row.id//商品SkuID
                        }
                    }
                    deleteLimitActivityGoodscs(obj).then((res)=>{
                        if(res.code==200){
                            that.$message.success(res.msg);
                            that.backScan();
                        }else{
                            that.$message.error(res.msg);
                        }
                    })
                }).catch(() => { 
                    })
            },
            dataFormCancel(){
                this.visible = false;
                this.closeDialog();
            },
            closeDialog() {
                this.$parent.modelShowSkuVisible = false;
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