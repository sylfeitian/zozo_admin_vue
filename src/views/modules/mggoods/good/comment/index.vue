<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item prop="memberId" label="会员账号：">
                <el-input v-model="dataForm.memberId" ></el-input>
            </el-form-item>
            <el-form-item prop="orderId" label="订单号：">
                <el-input v-model="dataForm.orderId" ></el-input>
            </el-form-item>
            <el-form-item prop="skuId" label="skuid：">
                <el-input v-model="dataForm.skuId" ></el-input>
            </el-form-item>
            <el-form-item prop="goodsName" label="商品名称：">
                <el-input v-model="dataForm.goodsName" maxlength="300"></el-input>
            </el-form-item>
            <el-form-item prop="sizeFeeling" label="尺码感受：">
                <el-select v-model="dataForm.sizeFeeling" placeholder="尺码感受">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="偏大" value="0">偏大</el-option>
                    <el-option label="合适" value="1">合适</el-option>
                    <el-option label="偏小" value="2">偏小</el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="评论时间：">
                <el-date-picker
                        v-model="timeArr"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        align="left"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="质量星级：" prop="quality">
                <el-select v-model="dataForm.quality" placeholder="质量星级">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="1星" value="0">1星</el-option>
                    <el-option label="2星" value="1">2星</el-option>
                    <el-option label="3星" value="2">3星</el-option>
                    <el-option label="4星" value="3">4星</el-option>
                    <el-option label="5星" value="4">5星</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="舒适度星级：" prop="comfort">
                <el-select v-model="dataForm.comfort" placeholder="舒适度星级">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="1星" value="0">1星</el-option>
                    <el-option label="2星" value="1">2星</el-option>
                    <el-option label="3星" value="2">3星</el-option>
                    <el-option label="4星" value="3">4星</el-option>
                    <el-option label="5星" value="4">5星</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="颜值星级：" prop="appearance">
                <el-select v-model="dataForm.appearance" placeholder="售后类型">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="1星" value="0">1星</el-option>
                    <el-option label="2星" value="1">2星</el-option>
                    <el-option label="3星" value="2">3星</el-option>
                    <el-option label="4星" value="3">4星</el-option>
                    <el-option label="5星" value="4">5星</el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-form-item>
                    <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
                    <el-button class="btn" @click="reset('dataForm')" type="primary" plain>重置</el-button>
                </el-form-item>
            </el-form-item>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%;maigin-top:20px;"
        >
            <el-table-column type="selection" width="70"></el-table-column>
            <el-table-column prop="aftersaleSn" label="会员账号" align="center"></el-table-column>
            <el-table-column prop="specSerial" label="订单号" align="center"></el-table-column>
            <el-table-column prop="goodsName" label="商品主图" align="center"></el-table-column>
            <el-table-column prop="memberName" label="skuid" align="center"></el-table-column>
            <el-table-column prop="storeName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="createDate" label="规格" align="center"></el-table-column>
            <el-table-column prop="refundAmount" label="订单评价" align="center "></el-table-column>
            <el-table-column prop="auditStatus" label="订单星级" align="center"></el-table-column>
            <el-table-column prop="auditResult" label="售后状态" align="center"></el-table-column>
            <el-table-column prop="aftersaleType" label="尺码感受" align="center"></el-table-column>
            <el-table-column prop="auditResult" label="评论内容" align="center"></el-table-column>
            <el-table-column prop="aftersaleType" label="评论时间" align="center"></el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button class="artdanger" @click.native.prevent="deleteHandle(scope.row.id)"type="text"size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottomFun">
            <div class="bottomFunLeft">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-button class="btn" type="primary" @click="deleteHandle(scope.row.id)" style="margin-left: 20px;">批量删除</el-button>
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
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "商品管理", "评论管理"],
                timeArr: "", //评论时间
                dataForm: {
                    memberId: "",//会员账号
                    orderId: "",//订单号
                    skuId: "",//skuId
                    goodsName: "",//商品名称
                    sizeFeeling: "",//尺码感受
                    timeArr: "",//评论时间
                    quality: "",//质量星级
                    comfort: "",//舒适度星级
                    appearance:"",//颜值星级
                },
                value: '',
                dataList: [],
                dataListLoading: false,
                isIndeterminate: false,
                checkAll: false,
            }
        },
        components: {
            Bread
        },
        methods: {
            //条件查询
            getData() {
                this.dataForm.startDate = this.timeArr && this.timeArr[0];
                this.dataForm.endDate = this.timeArr && this.timeArr[1];
                this.getDataList();
            },
            reset() {
                this.dataForm.memberId = "";//会员账号
                this.dataForm.orderId = "";//订单号
                this.dataForm.skuId = "";//skuId
                this.dataForm.goodsName = "";//商品名称
                this.dataForm.sizeFeeling = "";//尺码感受
                this.dataForm.timeArr = "";//评论时间
                this.dataForm.quality = "";//质量星级
                this.dataForm.comfort = "";//舒适度星级
                this.dataForm.appearance = "";//颜值星级
                this.getDataList();
            },
            handleCheckAllChange(val) {
                this.checkednodeslist = val ? this.dataList : [];  //dataList  nodeslist
                this.isIndeterminate = false;
                console.log(this.checkednodeslist + '当前选中的复选框')
            },
        }
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