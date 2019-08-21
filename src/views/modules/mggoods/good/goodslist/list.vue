<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="商品名称：">
                <el-input v-model="dataForm.goodsName" placeholder="请输入商品名称" ></el-input>
            </el-form-item>
            <el-form-item label="商品ID：">
                <el-input v-model="dataForm.brandId" placeholder="请输入spuID" ></el-input>
            </el-form-item>
            <el-form-item label="分类：">
                <el-input v-model="dataForm.gcId" placeholder="请输入" ></el-input>
            </el-form-item>
            <el-form-item label="店铺名称：">
                <el-input v-model="dataForm.storeName" placeholder="请输入店铺名称" ></el-input>
            </el-form-item>
            <el-form-item label="品牌名称：">
                <el-input v-model="dataForm.brandName" placeholder="请输入品牌名称" ></el-input>
            </el-form-item>
            <el-form-item label="上架状态：">
                <el-select v-model="dataForm.goodsShow" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="可售状态：">
                <el-select v-model="dataForm.goodsStatus" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="价格变更：">
                <el-select v-model="dataForm.state" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="editList()">查询</el-button>
                <el-button   class="btn"type="primary" plain @click="reset()" >重置条件</el-button>
            </el-form-item>
        </el-form>
        <el-radio-group v-model="activeName" @change="handleClick">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="upper">上架</el-radio-button>
            <el-radio-button label="lower">下架</el-radio-button>
            <el-radio-button label="not">待上架</el-radio-button>
        </el-radio-group>
        <el-button @click="detShowChange()" class="btn" type="primary" style="float: right;">导出信息</el-button>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="width: 100%;margin-top:20px;"
        >
            <el-table-column type="selection" width="70"></el-table-column>
            <el-table-column label="商品ID" align="center" width="100">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.brandId}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="主图" align="center" width="160">
                <template slot-scope="scope">
                    <div class="goodsPropsWrap">
                        <div class="goodsImg">
                            <img :src="scope.row.pictureUrl | filterImgUrl" alt=""/>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="" label="商品名称" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.goodsName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="" label="品牌" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.brandName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="售价" width="100" align="center">
                <template slot-scope="scope">
                    <div class="price1">￥{{scope.row.specSellPrice}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="" label="售价类型" v-if="dataForm.goodsShow==''" align="center" width="100">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.goodsName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="gcName" label="分类"  align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.gcName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="storeName" label="所属店铺" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.storeName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="状态" v-if="dataForm.goodsShow==''" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.state}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="日本状态" v-if="dataForm.goodsShow=='1'||dataForm.goodsShow=='0'||dataForm.goodsShow=='2'" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.state}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="价格变动" v-if="dataForm.goodsShow==''" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.state}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="更新时间" v-if="dataForm.goodsShow==''" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.state}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="可售状态" v-if="dataForm.goodsShow==''||dataForm.goodsShow=='0'||dataForm.goodsShow=='2'" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.state4}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="上下架时间" v-if="dataForm.goodsShow==''" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.state}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
<!--                    <el-button size="mini" type="text" @click="detShowChange(scope.row)">查看详情</el-button>-->
                    <el-button @click="goEidt(scope.row)" type="text" size="mini">编辑</el-button>
                    <el-button  @click="cotrolGoodsShow('singe',scope.row)" type="text" size="mini" >
                        <span  v-if="scope.row.goodsShow==0 || scope.row.goodsShow==2">上架</span>
                        <span  v-if="scope.row.goodsShow==1" class="artclose">下架</span>
                        <!-- <span  v-if="scope.row.goodsShow==2"   style="color:#FF0000">未上架</span> -->
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottomFun">
            <div class="bottomFunLeft">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-button class="btn" type="success" @click="cotrolGoodsShow('batch',1)" style="margin-left: 20px;">批量上架</el-button>
                <el-button class="btn" type="success" @click="cotrolGoodsShow('batch',0)">批量下架</el-button>
            </div>
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
    </div>
<!--    <orderDet-->
<!--            @changeState="changeState"-->
<!--            v-else-->
<!--            :data="data"-->
<!--            :detdata="detdata"-->
<!--    ></orderDet>-->
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import detail from "./detail";
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "商品管理", "商品列表"],
                dataForm: {
                    goodsName: "",//商品名称/商品货号
                    brandId: "",//品牌名称
                    gcId: "",//分类
                    storeName: "",//店铺名称
                    brandName:"",//品牌名称
                    goodsStatus: "",//是否可售
                    goodsShow:"",//上下架状态:0下架;1上架
                },
                options: [{
                    value: '选项1',
                    label: '全部'
                }, {
                    value: '选项2',
                    label: '已售完'
                }, {
                    value: '选项3',
                    label: '未售完'
                }],
                activeName: "",
                data: {}, //总数据
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
                checked:false
            }
        },
        components: {
            Bread,
            detail
        },
        created () {
            // 第一次请求数据
            this.handleClick();
            this.activeName =  this.status == undefined ? "" : this.status;
            this.dataForm.goodsShow = this.status == undefined ? "" : this.status;
            this.getDataList();
        },
        methods: {
            handleClick(tab,val) {
                if(tab== ""){
                    this.dataForm.goodsShow = ""
                }else if(tab== "upper"){
                    this.dataForm.goodsShow = "1"
                }else if(tab== "lower"){
                    this.dataForm.goodsShow = "0"
                }else if(tab== "not"){
                    this.dataForm.goodsShow = "2"
                }
                this.changeVal = val;
                console.log(this.changeVal)
                this.getDataList();
            },
            reset() {
                this.dataForm.goodsName = "";//商品名称/商品货号
                this.dataForm.brandName = "";//品牌名称
                this.dataForm.conditionName = "";//分类名称
                this.dataForm.storeName = "";//店铺名称
                this.dataForm.state = "";//是否可售
                this.handleClick();
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
            detShowChange() {
                this.$emit("detShowChange");
            },
            //编辑页展示判断
            editList() {
                this.$emit("editList");
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
            },
            // 控制上下架
            cotrolGoodsShow(type,rowOrstatus){
                var ids= [];
                var goodsShow = 0;
                if(type=="batch"){ //批量
                    if(this.multipleSelection.length==0){
                        this.$message({
                            message: "请选择商品",
                            type:"warning",
                            duration: 1500,
                        })
                        return;
                    }
                    ids = this.getIds();
                    goodsShow = rowOrstatus
                }else{ //单个
                    ids = [rowOrstatus.id]
                    goodsShow = rowOrstatus.goodsShow==1?0:1;
                }

                // if(ids.length==0){
                //    this.$message({
                //       message: "请先选择商品",
                //       type: 'warning',
                //       duration: 500
                //     })
                //     return;
                // }
                var obj = {
                    ids:ids,
                    goodsShow:goodsShow,
                }
                showBatchGoods(obj).then(res=>{
                    let status="";
                    let msg = "";
                    if(res.code=="200"){
                        status= "success"
                        msg = goodsShow==1?"商品上架成功":"商品下架成功"
                        this.getDataList();
                    }else{
                        status= "error"
                        msg = res.msg;
                    }
                    this.$message({
                        message: msg,
                        type:status,
                        duration: 1500,
                    })
                })
            },
            handleCheckAllChange(val) {
                this.checkednodeslist = val ? this.dataList : [];  //dataList  nodeslist
                this.isIndeterminate = false;
                console.log(this.checkednodeslist + '当前选中的复选框')
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "@/element-ui/theme-variables.scss";
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
</style>