<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-button size="mini" @click="more">查看详情</el-button>
        <el-button size="mini">操作日志</el-button>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="margin-top: 20px;">
            <el-table-column prop="createDate" label="时间" header-align="center" align="center"></el-table-column>
            <el-table-column prop="creater" label="账户" header-align="center" align="center"></el-table-column>
            <el-table-column prop="operation" label="操作内容" header-align="center" align="center"></el-table-column>
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
    import Bread from "@/components/bread";
    import mixinViewModule from '@/mixins/view-module'
    import { backScanGoodsLog } from '@/api/api'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "商品管理","商品管理", "商品详情", "操作日志"],
            }
        },
        components: {
            Bread
        },
        methods: {
            changePage(){
                this.$emit("operationallogList");
            },
            more () {
                this.$emit("more")
            }
        }
    }
</script>

<style scoped>
    /*/deep/.el-table--border th:first-child td:first-child .cell {*/
    /*    text-align: left!important;*/
    /*}*/
</style>