<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-button size="mini" @click="more">查看详情</el-button>
        <el-button size="mini">操作日志</el-button>
        <el-table border style="margin-top: 20px;">
            <el-table-column label="数据列表" header-align="left" align="left">
                <el-table-column label="时间" header-align="center" align="center"></el-table-column>
                <el-table-column label="账户" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作内容" header-align="center" align="center"></el-table-column>
            </el-table-column>
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
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "商品管理", "商品详情"],
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