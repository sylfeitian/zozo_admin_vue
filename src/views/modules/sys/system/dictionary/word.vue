<template>
    <div>
        <Bread :breaddata="breaddata" @changePage="changePage" :index="'1'"></Bread>
        <div class="mod-sys__dict">
            <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getDataList()">
                <el-form-item label="词典名称：">
                    <el-input v-model="dataForm.dictName" placeholder="请输入关键词搜索" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button  class="btn" type="primary" @click="getDataList">查询</el-button>
                    <el-button  class="btn" type="primary" plain @click="reset()" >重置</el-button>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="addOrUpdateHandle()">添加词典</el-button>
            <el-table
                    v-loading="dataListLoading"
                    :data="dataList"
                    border
                    style="width: 100%;margin-top: 10px;">
                <el-table-column
                        type="index"
                        prop="$index"
                        label="序号"
                        align="center"
                        width="70">
                    <template slot-scope="scope">
                        {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
                    </template>
                </el-table-column>
                <el-table-column prop="dictName" label="词典名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="dictValue" label="词典编号" header-align="center" align="center"></el-table-column>
                <el-table-column  label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
                        <el-button class="artdanger" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    v-if="dataForm.pid === '0'"
                    :current-page="page"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="limit"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="pageSizeChangeHandle"
                    @current-change="pageCurrentChangeHandle">
            </el-pagination>
            <!-- 弹窗, 新建 -->
            <addEditData  v-if="addEditDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
        </div>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import addEditData from './model-add-edit-data'
    import Bread from "@/components/bread";
    import { dictList,deleteDict } from '@/api/url'

    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    activatedIsNeed: false,
                    getDataListURL: dictList,
                    getDataListIsPage: true,
                    deleteURL: deleteDict,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                breaddata: ["系统设置", "字典管理", "词典管理"],
                dataForm: {
                    pid: '0',
                    dictName: '',
                    dictType: '',
                    dictValue: ''
                },
                addEditDataVisible:false,
                dataList: [],
                dataListLoading: false,
            }
        },
        components: {
            addEditData,
            Bread
        },
        created() {
            this.getDataList()
        },
        methods: {
            init (id ){
              console.log(this.id)
            },
            wordList(id){
                this.$emit("wordList",id);
            },

            // 新增 / 修改
            addOrUpdateHandle (row = {}) {
                this.addEditDataVisible = true
                this.$nextTick(() => {
                    this.$refs.addEditData.init(row)
                })
            },
            reset(){
                this.dataForm.dictName = "";
                this.getDataList();
            },
            changePage(){
                this.$emit("wordList");
            },
        }
    }
</script>


<style scoped>
    .grayLine{
        border-bottom: 0!important;
    }
</style>