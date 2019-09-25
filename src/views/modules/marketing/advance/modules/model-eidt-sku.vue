<template>
   <!-- 修改弹框 -->
    <el-dialog
        :visible.sync="visible"
        :close-on-click-modal = "false"
        :show-close = "false"
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
             <el-table-column
                type="selection"
                width="70">
            </el-table-column>
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
                min-width="180"
                label="活动库存">
                <template slot-scope="scope">
                        <el-input-number v-model="scope.row.activityQuantity" :step="1" :min="0" :max="999999" ></el-input-number>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="cartLimit"
                label="日本限购数量">
            </el-table-column>
            <el-table-column
                align="center"
                prop="personLimit"
                label="每人限购"
                 min-width="180">
                <template slot-scope="scope">
                        <el-input-number  v-model="scope.row.personLimit" :step="1" :min="0" :max="999999"></el-input-number >
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="changeAll(scope.row)">适用于全部规格</el-button>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer" v-if="!loading">
            <el-button @click="dataFormCancel()">取 消</el-button>
            <el-button type="primary" @click="dataFormSubmit('editDataForm')" :loading="saveLoading">{{saveLoading?'提交中..':'确 定'}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {limitActivitySkuChoice,editPresellActivityGoods} from "@/api/api.js"
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
                    goodsId:this.row2.id,//商品ID
                    activityType:1,//活动类型 0秒杀 1限量 2预售
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
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                // console.log(this.dataForm);
                // this.$refs[formName].validate((valid) => {
                    // if (valid) {
                        if(this.multipleSelection.length==0){
                            this.$message.warning("至少勾选一个sku");
                            return
                        }
                        var activityGoodsList = [];
                        this.multipleSelection.forEach((item,index)=>{
                            activityGoodsList.push({
                                "activityQuantity": item.activityQuantity?item.activityQuantity:0, //活动库存 ,
                                "goodsCsId": item.id, // 商品skuid ,
                                "goodsId": this.row2.id,  // 商品spuid ,
                                "personLimit": item.personLimit?item.personLimit:0 // 每人限购数量
                            })
                        })
                        var obj={
                            "activityGoodsList":activityGoodsList ,//活动商品新增集合 ,
                            "activityId": this.row.id,//活动id ,
                            "isAllCheck": this.multipleSelection.length==this.dataList.length?1:0,// 商品下的规格是否全部选中（ 默认0未全部选中，1全部选中）
                        }
                         this.saveLoading = true;
                        editPresellActivityGoods(obj).then((res) => {
                            this.saveLoading = false;
                            // alert(JSON.stringify(res));
                            let status = null;
                            if(res.code == "200"){
                                status = "success";
                                this.visible = false;
                                this.$emit('searchDataList');
                                this.closeDialog();
                            }else{
                                status = "error";
                            }
                            this.$message({
                                message: res.msg,
                                type: status,
                                duration: 1500
                            })
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