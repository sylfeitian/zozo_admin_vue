<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="商品名称：">
                <el-input v-model="dataForm.goodsName" placeholder="商品名称/商品编号" ></el-input>
            </el-form-item>
            <el-form-item label="商品ID：">
                <el-input v-model="dataForm.goodsId" placeholder="商品名称/商品编号" ></el-input>
            </el-form-item>
            <el-form-item label="分类：">
                <el-select v-model="dataForm.conditionName" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="品牌：">
                <el-select v-model="dataForm.brandName" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="所属店铺：">
                <el-select v-model="dataForm.storeName" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否已售完：">
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
                <el-button  class="btn" type="primary" @click="showDetail()">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="width: 100%;margin-top:20px;"
        >
            <el-table-column prop="" label="商品ID" align="center" width="100"></el-table-column>
            <el-table-column label="主图" align="center" width="160">
                <template slot-scope="scope">
                    <div class="goodsPropsWrap">
                        <div class="goodsImg">
                            <img :src="scope.row.pictureUrl | filterImgUrl" alt=""/>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="" label="品牌" align="center"></el-table-column>
            <el-table-column prop="price" label="售价" width="100" align="center"></el-table-column>
            <el-table-column prop="gcName" label="分类"  align="center"></el-table-column>
            <el-table-column prop="storeName" label="所属店铺" align="center"></el-table-column>
            <el-table-column prop="" label="上架状态" align="center"></el-table-column>
            <el-table-column prop="" label="库存数" align="center"></el-table-column>
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
    //import detail from "./detail";
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "商品管理", "查看库存"],
                dataForm: {
                    goodsName: "",//商品名称/商品货号
                    brandName: "",//品牌名称
                    conditionName: "",//分类名称
                    storeName: "",//店铺名称
                    state: "",//是否可售
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
                checked:false
            }
        },
        components: {
            Bread,
            //detail
        },
        created () {
            // 第一次请求数据
            this.activeName =  this.status == undefined ? "" : this.status;
            this.dataForm.goodsShow = this.status == undefined ? "" : this.status;
            this.getDataList();
        },
        methods: {
            showDetail(id){
                this.$emit("showDetail",id);
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