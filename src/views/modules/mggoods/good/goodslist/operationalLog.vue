<template>
    <div>
        <Bread :breaddata="breaddata"  @changePage="changePage" :index="'2'"></Bread>
        <el-button size="mini" @click="more">查看详情</el-button>
        <el-button size="mini">操作日志</el-button>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="margin-top: 20px;">
            <el-table-column prop="createDate" label="时间" header-align="center" align="center"></el-table-column>
            <el-table-column prop="creator" label="操作人" header-align="center" align="center"></el-table-column>
            <el-table-column prop="content" label="操作内容" header-align="center" align="center"></el-table-column>
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
    import { getGoodsUrl } from '@/api/url'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: getGoodsUrl,
                    activatedIsNeed:false,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/log/login/export',
                    // deleteURL: deleteGoodsUrl,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                breaddata: [ "商品管理","商品列表", "商品详情", "操作日志"],
                dataForm: {
                    spuId:null,
                    createDate:null,
                    creater: null,
                    operation: null,
                },
            }
        },
        components: {
            Bread
        },
        props:["idJp"],
        methods: {
            init (row) {
                this.visible = true;
                this.row = row;
                console.log("我在看row");
                console.log(this.row);
                // this.dataForm.spuId = res.data.list.spuId;
                console.log(this.idJp);
                this.$nextTick(() => {
                    this.dataForm.goodsId = this.row.id;
                    this.getDataList();
                    // this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            changePage(){
                // this.$emit("operationallogList");
                this.more();
            },
            more () {
                this.$parent.more()
            },

        }
    }
</script>

<style lang="scss" scoped>
    // /deep/ .cell {
    //     white-space: nowrap;
    //     overflow: hidden;
    //     text-overflow: ellipsis;
    // }
</style>