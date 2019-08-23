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
            <el-form-item label="搜索会员账号：">
                <el-input v-model="dataForm.idJp" placeholder="请输入会员账号搜索" ></el-input>
            </el-form-item>
            <el-form-item label="搜索时间：">
                <el-date-picker
                        v-model="valuetime"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        align="left"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData()">查询</el-button>
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
            <el-table-column prop="" label="搜索内容" align="center"></el-table-column>
            <el-table-column prop="" label="搜索会员账号" align="center"></el-table-column>
            <el-table-column prop="" label="搜索时间" align="center"></el-table-column>
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
        <addEditData  v-if="addDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
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
                addDataVisible: false,
                timeArr: "", //搜索时间数据
                startCreateDate: "",
                endCreateDate: "",
                valuetime: "",
            }
        },
        components: {
            Bread,
        },
        methods: {
            getData() {
                this.dataForm.startCreateDate = this.timeArr && this.timeArr[0];
                this.dataForm.endCreateDate = this.timeArr && this.timeArr[1];
                this.page = 1;
                this.limit = 10;
                this.getDataList();
            },
            // 重置
            reset() {
                this.timeArr = [];
                this.dataForm.startCreateDate = "";
                this.dataForm.endCreateDate = "";
                this.dataForm.idJp = "";//关键字搜索
                this.getDataList();
            },
        }
    }
</script>

<style scoped>

</style>