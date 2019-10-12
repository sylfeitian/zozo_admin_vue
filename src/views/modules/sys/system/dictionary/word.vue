<template>
    <div>
        <Bread :breaddata="breaddata" @changePage="changePage" :index="'1'"></Bread>
        <div class="mod-sys__dict">
            <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getDataList()">
                <el-form-item label="词典名称：">
                    <el-input v-model="dataForm.dictName" placeholder="请输入关键词搜索" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button  class="btn" type="primary" @click="getDataList">搜索</el-button>
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
                <el-table-column  label="操作" header-align="center" align="center" width="220">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
                        <el-button class="artdanger" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
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
                breaddata: ["系统设置", "字典管理", "词典管理"],
                dataForm: {
                    dictName: '',
                    dictType: '',
                    dictValue: '',
                    pid:''
                },
                addEditDataVisible:false,
                dataListLoading: false,
                row:""
            }
        },
        components: {
            addEditData,
            Bread
        },
         watch:{
            'dataForm.dictName':function(newV,oldV) {
                var chineseCount=0,characterCount=0;
                for(let i=0;i<newV.length;i++){
                    if(/^[\u4e00-\u9fa5]*$/.test(newV[i])){ //汉字
                        chineseCount=chineseCount+2;
                    }else if(/[0-9a-zA-Z]/g.test(newV[i])){ //数字、字母
                        characterCount=characterCount+1;
                    }else{ // 只能输入文字、字母、数字
                        this.dataForm.dictName = newV.replace(newV[i],"")
                    }
                    var count=chineseCount+characterCount;
                    if(count>600){ //输入字符大于600的时候过滤
                        this.dataForm.dictName = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
        },
        // created() {
        //     this.getDataList()
        // },
        methods: {
            init (row){
                this.row = row;
                this.dataForm.pid = row.id;
                this.getDataList()
            },
            wordList(id){
                this.$emit("wordList",id);
            },

            // 新增 / 修改
            addOrUpdateHandle (row2) {
                this.addEditDataVisible = true;
                this.$nextTick(() => {
                    this.$refs.addEditData.init(this.row,row2)
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

</style>