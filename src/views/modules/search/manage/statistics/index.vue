<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form
                :inline="true"
                class="grayLine topGapPadding"
                :model="dataForm"
                @keyup.enter.native="getDataList()"
        >
            <el-form-item label="关键字搜索：">
                <el-input v-model="dataForm.idJp" placeholder="请输入关键词搜索" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getDataList()">查询</el-button>
                <el-button class="btn"type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="width: 100%;margin-top: 20px;"
        >
            <el-table-column label="序号" width="140" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                    <!-- {{scope.$index+1+(parseInt(params.currentPage)-1)* parseInt(params.currentPageSize) }} -->
                </template>
            </el-table-column>
            <el-table-column prop="" label="搜索词" align="center"></el-table-column>
            <el-table-column prop="" label="总搜索次数" sortable="custom" align="center"></el-table-column>
            <el-table-column prop="" label="本月搜索次数" sortable="custom" align="center"></el-table-column>
            <el-table-column prop="" label="今日搜索次数" sortable="custom" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="250">
                <template slot-scope="scope">
                    <el-button class="artdanger" @click.native.prevent="deleteHandle(scope.row.id)"type="text"size="mini">删除</el-button>
                </template>
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
        <!-- 弹窗, 编辑 -->
<!--        <addEditData  v-if="addDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>-->
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    // import addEditData from './model-add-edit-data'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                // mixinViewModuleOptions: {
                //     getDataListURL: shopPageUrl,
                //     getDataListIsPage: true,
                //     exportURL: '/admin-api/shopStore',
                //     deleteURL: '/admin-api/shopStore',
                //     deleteIsBatch: true,
                //     // deleteIsBatchKey: 'id'
                // },
                breaddata: [ "搜索管理", "同义词管理"],
                dataForm: {
                    idJp: "",//关键字搜索
                },
                dataList: [],
                dataListLoading: false,
                addDataVisible: false
            }
        },
        components: {
            Bread,
            // addEditData
        },
        methods: {
            // 重置
            reset() {
                this.dataForm.idJp = "";//关键字搜索
                this.getDataList();
            },
        }
    }
</script>

<style scoped>

</style>