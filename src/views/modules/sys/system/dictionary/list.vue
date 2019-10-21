<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <div class="mod-sys__dict">
            <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getDataList()">
                <el-form-item label="字典名称：">
                    <el-input v-model.trim="dataForm.dictName" placeholder="请输入关键词搜索" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button  class="btn" type="primary" @click="getDataList">搜索</el-button>
                    <el-button  class="btn" type="primary" plain @click="reset()" >重置</el-button>
                </el-form-item>
            </el-form>
            <el-button @click="addOrUpdateHandle()" type="primary">添加字典</el-button>
            <el-table
                    v-loading="dataListLoading"
                    :data="dataList"
                    border
                    @selection-change="dataListSelectionChangeHandle"
                    @sort-change="dataListSortChangeHandle"
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
                <el-table-column prop="dictName" label="字典名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="dictValue" label="字典编号" header-align="center" align="center"></el-table-column>
                <el-table-column  label="操作" header-align="center" align="center" width="220">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="addOrUpdateHandle(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="addWord(scope.row)">词典列表</el-button>
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
            <!-- 弹窗, 新增 / 修改 -->
            <addOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate"  @searchDataList="getDataList"></addOrUpdate>
        </div>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import addOrUpdate from './add-or-update'
    import Bread from "@/components/bread";
    import { dictUrl,deleteDict } from '@/api/url'

    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    activatedIsNeed: false,
                    getDataListURL: dictUrl,
                    getDataListIsPage: true,
                    deleteURL: deleteDict,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                breaddata: ["系统设置", "字典管理"],
                dataForm: {
                    pid: '0',
                    dictName: '',
                    dictType: '',
                    dictValue: ''
                },
                addOrUpdateVisible: false,
                row:"",
                dataList: [],
                dataListLoading: false,
            }
        },
        components: {
            addOrUpdate,
            Bread
        },
        watch:{
            'dataForm.dictName':function(newV,oldV) {
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 300) { //输入字符大于300的时候过滤
                        this.dataForm.dictName = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
        },
        // activated () {
        //     // 通过路由参数pid, 控制列表请求操作
        //     this.dataForm.pid = this.$route.params.pid || '0'
        //     if (this.dataForm.pid !== '0') {
        //         this.mixinViewModuleOptions.getDataListURL = '/admin-api/dict/list'
        //         this.mixinViewModuleOptions.getDataListIsPage = false
        //         this.dataForm.dictType = this.$route.params.type || ''
        //     }
        //     this.getDataList()
        // },
        created() {
            this.getDataList()
        },
        methods: {
            addWord(id){
                this.$emit("addWord",id);
            },
            // 子级

            // 新增 / 修改
            addOrUpdateHandle (index=-1,row="") {
                this.addOrUpdateVisible = true
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.init(row)
                })
            },
            reset(){
                this.dataForm.dictName = "";
                this.getDataList();
            }
        }
    }
</script>


<style scoped>

</style>