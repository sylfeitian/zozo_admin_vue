<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item prop="memberId" label="所属仓库：">
                <el-input v-model="dataForm.memberId" placeholder="请输入仓库名称"></el-input>
            </el-form-item>
            <el-form-item prop="orderId" label="备注：">
                <el-input v-model="dataForm.orderId" placeholder="请输入备注内容"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="">保存</el-button>
            </el-form-item>
        </el-form>
        <el-form style="float: right;">
            <el-form-item>
                <el-button type="primary"  @click="addOrEditHandle()" >导入商品</el-button>
                <el-button type="primary" plain @click="showDetail()" >添加商品</el-button>
            </el-form-item>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%;margin-top:20px;"
        >
            <el-table-column label="序号" width="140" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                    <!-- {{scope.$index+1+(parseInt(params.currentPage)-1)* parseInt(params.currentPageSize) }} -->
                </template>
            </el-table-column>
            <el-table-column prop="name" label="skuID" align="center"></el-table-column>
            <el-table-column prop="" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="" label="规格" align="center"></el-table-column>
            <el-table-column prop="" label="所属仓库" align="center"></el-table-column>
            <el-table-column prop="" label="库存" align="center"></el-table-column>
            <el-table-column prop="" label="变更数量" align="center"></el-table-column>
            <el-table-column prop="" label="变更后库存" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="deleteHandle(scope.$index, scope.row)"type="text"size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗, 查看 -->
        <showData  v-if="showDataVisible" ref="showData" @searchDataList="getDataList"></showData>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import showData from './model-show-data'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "库存管理", "其他出库单", "添加出库单"],
                showDataVisible:false,
            }
        },
        components: {
            Bread,
            showData
        },
        methods: {
            init (row) {
                this.visible = true;
                this.row = row;
                this.$nextTick(() => {
                    //this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            showDetail(index=-1,row=""){
                this.setShowDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.showData.init(row)
                })
            },
            setShowDataVisible(boolargu){
                this.showDataVisible =  boolargu;
            },
        }
    }
</script>

<style scoped>

</style>