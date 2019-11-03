<template>
   <!-- 修改弹框 -->
    <el-dialog
        :visible.sync="visible"
        :close-on-click-modal = "false"
        :show-close = "false"
        class="editDialog"
        width="70%">
        <el-form :model="dataList" :rules="dataRule" ref="dataList" label-width="82px">
        <div class="goodsPresent" >
            <img :src="this.dataForm.mainImageUrl | filterImgUrl" alt="" />
            <div class="goodsPresentModle">
                <div class="goodsTitle">{{this.dataForm.name?this.dataForm.name:"暂无名字"}}</div>
                <div class="goodsmoney">￥ {{this.dataForm.sellPrice?this.dataForm.sellPrice:'0.00'}}</div>
            </div>
        </div>
        <!-- scope.$index+1+(parseInt(page)-1)* parseInt(limit) -->
        <el-table
            :data="dataList.goodsSpecList"
            v-loading="loading"
            @row-click="onRowClick"
            border
             ref="multipleTable"
             @selection-change="handleSelectionChange"
            style="width: 100%">

             <el-table-column
                type="selection"
                width="40">
            </el-table-column>
            <el-table-column
                prop="id"
                label="skuID"
                align="center"
                width="160">
            </el-table-column>
            <el-table-column
                prop="specInfo"
                align="center"
                label="规格">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="130"
                label="活动库存">
                <template slot-scope="scope">
                    <el-form-item
                            class="specError"
                            :prop="'goodsSpecList.'+ scope.$index + '.activityQuantity' "
                            :rules="dataRule.activityQuantity"
                    >
                        <el-input class="inputWidth"
                                  v-model="scope.row.activityQuantity"
                                  @input="watchkc(scope.$index,$event)"
                                  :min="0" type="text" :maxlength="6"></el-input>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="cartLimit"
                width="100"
                label="日本限购数量">
<!--                <template slot-scope="scope">-->
<!--                    <el-form-item-->
<!--                            class="japane"-->
<!--                    >-->
<!--                        <el-input-->
<!--                                v-model="scope.row.cartLimit"-->
<!--                                type="text"-->
<!--                        ></el-input>-->
<!--                    </el-form-item>-->
<!--                </template>-->
            </el-table-column>
            <el-table-column
                align="center"
                prop="personLimit"
                label="每人限购"
                 min-width="130">
                <template slot-scope="scope">
                    <el-form-item
                            class="specError"
                            :prop=" 'goodsSpecList.' + scope.$index + '.personLimit' "
                            :rules="dataRule.personLimit"
                    >
                        <el-input class="inputWidth" v-model="scope.row.personLimit"
                                          :maxlength="6"
                                          :max="scope.row.cartLimit==0?'999999':scope.row.cartLimit"
                                          :min="0"
                                  @input="watchxg(scope.$index,$event)"
                                          type="text"></el-input >
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="100"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="changeAll(scope.row)">适用于全部规格</el-button>
                </template>
            </el-table-column>
        </el-table>
        </el-form>
        <span slot="footer" class="dialog-footer" v-if="!loading">
            <el-button @click="dataFormCancel()">取 消</el-button>
            <el-button type="primary" @click="dataFormSubmit('dataList')" :loading="saveLoading">{{saveLoading?'提交中..':'确 定'}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {limitActivitySkuChoice,editLimitActivityGoods,deleteLimitActivityGoods} from "@/api/api.js"
    export default {
        name: "model-add-edit-data",
        data () {
            var quantityNumber = (rule, value, callback) => {
                if (!value) {
                    callback(new Error("活动库存不能为空"));
                } else if (Number(value) == 0) {
                    callback(new Error("活动库存不得为0"));
                } else if (Number(value) >= 1000000) {
                    callback(new Error("活动库存不得大于999999"));
                } else {
                    callback();
                }
            };
            var limitNumber = (rule, value, callback) => {
                if (!value) {
                    callback(new Error("每人限购不能为空"));
                } else if (Number(value) == 0) {
                    callback(new Error("每人限购不得为0"));
                } else if (this.isLimit == 0) {
                    if (Number(value) >= 1000000) {
                        callback(new Error("每人限购不得大于999999"));
                    } else {
                        callback();
                    }
                } else if (this.isLimit != 0 && Number(value) > this.isLimit) {
                    callback(new Error("每人限购不得大于日本限购数量"));
                } else {
                    callback();
                }
            };
            return {
                visible : false,
                loading : false,
                saveLoading:false,
                // dataList:[],
                title:'',
                multipleSelection:[],
                goodsSpecList: [], //商品sku集合
                dataList: {
                    activityQuantity: "",
                    personLimit: "",
                    goodsSpecList: []
                },
                isLimit: "", //当前选中行的日本限制数量
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
                type:'',//choose选择；edit编辑
                dataRule: {
                    activityQuantity: [
                        {
                            required: true,
                            message: "活动库存不能为空",
                            trigger: ["blur", "change"]
                        },
                        { validator: quantityNumber, trigger: ["blur", "change"] }
                    ],
                    personLimit: [
                        {
                            required: true,
                            message: "每人限购不能为空",
                            trigger: ["blur", "change"]
                        },
                        { validator: limitNumber, trigger: ["blur", "change"] }
                    ]
                }
            }

        },
        methods: {
            watchxg(index,val){
                for(let j=0;j<3;j++){
                    // 最大输入6位数 循环3遍达到删除非数字输入效果
                    for(let i=0;i<val.length;i++){
                        // 删除非数字的输入
                        if(!/[0-9]/g.test(val[i])){
                            val= val.replace(val[i],"")
                        }
                    }
                }
                this.goodsSpecList[index].personLimit= val
            },
            watchkc(index,val){
                for(let j=0;j<3;j++){
                    // 最大输入6位数 循环3遍达到删除非数字输入效果
                    for(let i=0;i<val.length;i++){
                        // 删除非数字的输入
                        if(!/[0-9]/g.test(val[i])){
                            val= val.replace(val[i],"")
                        }
                    }
                }
                this.goodsSpecList[index].activityQuantity= val
            },
            //获取当前操作行
            onRowClick(row) {
                //   console.log(row.cartLimit, "日本限购");
                this.isLimit = row.cartLimit;
            },
            init (row,row2,type) {
                this.visible = true;
                this.saveLoading = false;
                this.$nextTick(() => {
                    this.row = row;
                    this.row2 = row2;
                    this.type = type;
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
                            this.goodsSpecList =  res.data.activityGoodsChoiceSkuVOList;
                            this.dataList.goodsSpecList =  this.goodsSpecList;
                           if(this.type=="edit"){
                                this.multipleSelection = this.dataList.goodsSpecList.filter((item,index)=>{
                                    //   return item;
                                    return item.checkFlag==1;

                                })
                                this.$nextTick(()=>{
                                    this.multipleSelection.forEach(row => {
                                        this.$refs.multipleTable.toggleRowSelection(row);
                                    });
                                })
                           }

                        }else{
                            this.dataList.goodsSpecList = []
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
                    that.dataList.goodsSpecList.forEach((item,index)=>{
                        item.activityQuantity = row.activityQuantity
                        item.personLimit = row.personLimit
                    })

                }).catch(() => {
                })
            },
            // 提交
            dataFormSubmit(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.multipleSelection.length == 0) {
                            this.$message.warning("至少勾选一个sku");
                            return
                        }
                        var activityGoodsList = [];
                        this.multipleSelection.forEach((item, index) => {
                            activityGoodsList.push({
                                "activityQuantity": item.activityQuantity ? item.activityQuantity : 0, //活动库存 ,
                                "goodsCsId": item.id, // 商品skuid ,
                                "goodsId": this.row2.id,  // 商品spuid ,
                                "personLimit": item.personLimit ? item.personLimit : 0 // 每人限购数量
                            })
                        })
                        this.saveLoading = true;
                        if (this.type === 2) {//取消选择
                            var cancelChoose = {
                                data: {
                                    "activityId": this.row.id,//活动id
                                    "activityType": 1, //活动类型 1 限量 2预售 ,
                                    "goodsIdList": [this.row2.id], //商品spuid
                                }
                            }
                            deleteLimitActivityGoods(cancelChoose).then(res => {
                                this.saveLoading = false;
                                let status = null;
                                if (res.code == "200") {
                                    status = "success";
                                    this.visible = false;
                                    this.$emit('searchDataList');
                                    this.closeDialog();
                                } else {
                                    status = "error";
                                }
                                this.$message({
                                    message: res.msg,
                                    type: status,
                                    duration: 1500
                                })
                            })
                        } else {// 选择或者修改
                            var obj = {
                                "activityGoodsList": activityGoodsList,//活动商品新增集合 ,
                                "activityId": this.row.id,//活动id ,
                                "isAllCheck": this.multipleSelection.length == this.dataList.goodsSpecList.length ? 1 : 0,// 商品下的规格是否全部选中（ 默认0未全部选中，1全部选中）
                            }

                            editLimitActivityGoods(obj).then((res) => {
                                this.saveLoading = false;
                                // alert(JSON.stringify(res));
                                let status = null;
                                if (res.code == "200") {
                                    status = "success";
                                    this.visible = false;
                                    this.$emit('searchDataList');
                                    this.closeDialog();
                                } else {
                                    status = "error";
                                }
                                this.$message({
                                    message: res.msg,
                                    type: status,
                                    duration: 1500
                                })
                            })
                        }
                        }
                })
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

<style lang="scss" scoped>
    /deep/ .el-form-item__content{
        margin-left: 0 !important;
    }
    .el-table .specError {

    /deep/ .el-form-item__content {
        margin-left: 0px !important;
    }

    /deep/ .el-form-item__error {
        position: relative !important;
    }

    }
</style>
