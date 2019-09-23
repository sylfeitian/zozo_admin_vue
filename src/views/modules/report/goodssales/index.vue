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
            <el-form-item label="商品名称：">
                <el-input v-model="dataForm.goodsName" placeholder="请输入商品名称" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item label="商品ID：">
                <el-input v-model="dataForm.id" placeholder="请输入spuID" clearable maxlength="30" ></el-input>
            </el-form-item>
            <el-form-item label="店铺名称：">
                <el-input v-model="dataForm.storeName" placeholder="请输入店铺名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="品牌名称：">
                <el-input v-model="dataForm.brandName" placeholder="请输入品牌名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="分类：">
                <el-input v-model="dataForm.type" placeholder="请选择" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
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
            <el-table-column prop="" label="商品ID(SPU)" align="center"></el-table-column>
            <el-table-column prop="" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="" label="商品图片" align="center">
                <template slot-scope="scope">
                    <img
                            :src="scope.row.mainImageUrl"
                            alt=""
                            style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                    >
                </template>
            </el-table-column>
            <el-table-column prop="" label="商品分类" align="center"></el-table-column>
            <el-table-column prop="" label="品牌" align="center"></el-table-column>
            <el-table-column prop="" label="所属店铺" align="center"></el-table-column>
            <el-table-column prop="" label="销售数量(件)" align="center"></el-table-column>
            <el-table-column prop="" label="销售金额" align="center"></el-table-column>
            <el-table-column prop="" label="当前售价(元)" align="center"></el-table-column>
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
                breaddata: [ "报表中心", "商品销量统计"],
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
            },
            // ID类搜索框仅可输入数字、英文，最多可输入30个字符
            'dataForm.id':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    if(!/[a-zA-Z0-9]/.test(newV[i])){
                        this.dataForm.id = newV.replace(newV[i],"")
                    }
                }
                if(newV.length>30){
                    this.dataForm.id = newV.substr(0,30)
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