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
        <el-button @click="addHandle()" class="btn" type="primary">添加同义词</el-button>
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
            <el-table-column prop="idJp" label="同义词库" align="center"></el-table-column>
            <el-table-column prop="storeLogo" label="状态" align="center" width="250"></el-table-column>
            <el-table-column label="操作" align="center" width="250">
                <template slot-scope="scope">
                    <el-button type="text" @click="addHandle(scope.$index, scope.row)" size="mini">编辑</el-button>
                    <el-button  @click="forbitHandle('singe',scope.row)" type="text" size="mini" >
                        <span  v-if="scope.row.operateFlag==0">启用</span>
                        <span  v-if="scope.row.operateFlag==1" class="artclose">停用</span>
                    </el-button>
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
        <addEditData  v-if="addDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import addEditData from './model-add-edit-data'
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
            addEditData
        },
        methods: {
            // 重置
            reset() {
                this.dataForm.idJp = "";//关键字搜索
                this.getDataList();
            },
            // 新建
            addHandle(index=-1,row=""){
                this.setAddDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.addEditData.init(row)
                })
            },
            setAddDataVisible(boolargu){
                this.addDataVisible =  boolargu;
            },
        }
    }
</script>

<style scoped>

</style>