<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form
                :inline="true"
                class="grayLine topGapPadding"
                :model="dataForm"
                @keyup.enter.native="getDataList()"
        >
            <el-form-item  label="统计维度：">
                <el-select v-model="dataForm.operateFlag" placeholder="请选择">
                    <el-option
                            v-for="item in operateShopStore"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间：">
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
            <el-form-item label="店铺名称：">
                <el-input v-model="dataForm.storeName" placeholder="请输入店铺名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="品牌名称：">
                <el-input v-model="dataForm.brandName" placeholder="请输入品牌名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData()">查询</el-button>
                <el-button class="btn"type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item>
                <el-button @click="" class="btn" type="primary">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="width: 100%;"
        >
            <el-table-column prop="" label="日期" align="center"></el-table-column>
            <el-table-column prop="" label="店铺名称" align="center"></el-table-column>
            <el-table-column prop="" label="品牌名称" align="center"></el-table-column>
            <el-table-column prop="" label="品牌商品总量(SKU)" align="center"></el-table-column>
            <el-table-column prop="" label="销售数量" align="center"></el-table-column>
            <el-table-column prop="" label="销售金额" align="center"></el-table-column>
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
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "报表中心", "店铺销量统计"],
                operateShopStore:[{ id: '0', name: '明细' },{ id: '1', name: '汇总' }],//统计维度
                timeArr: "", //搜索时间数据
                dataForm: {
                    startCreateDate:"",
                    endCreateDate:"",
                },
                dataList: [],
                dataListLoading: false,
            }
        },
        components: {
            Bread,
        },
        watch:{
            timeArr(val){
                if(!val){
                    this.dataForm.startCreateDate = '';
                    this.dataForm.endCreateDate = '';
                }
            }
        },
        methods: {
            getData() {
                this.page =1;
                this.dataForm.startCreateDate = this.timeArr && this.timeArr[0];
                this.dataForm.endCreateDate = this.timeArr && this.timeArr[1];
                this.getDataList();
            },
            // 重置
            reset() {
                this.timeArr = [];
                this.getDataList();
            },
        }
    }
</script>

<style scoped>

</style>