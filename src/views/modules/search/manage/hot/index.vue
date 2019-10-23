<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form
                :inline="true"
                class="grayLine topGapPadding"
                :model="dataFormShow"
                @keyup.enter.native="getDataList()"
        >
            <el-form-item label="关键字搜索：">
                <el-input v-model.trim="dataFormShow.hotKeyword" placeholder="请输入关键词搜索" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button class="btn"type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-button @click="addHandle()" class="btn" type="primary">添加搜索词</el-button>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="width: 100%;margin-top: 10px;"
        >
            <el-table-column label="序号" width="140" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                    <!-- {{scope.$index+1+(parseInt(params.currentPage)-1)* parseInt(params.currentPageSize) }} -->
                </template>
            </el-table-column>
            <el-table-column prop="hotKeyword" label="搜索词" align="center"></el-table-column>
            <el-table-column prop="sort" label="排序" align="center" width="250"></el-table-column>
            <el-table-column label="操作" align="center" width="250">
                <template slot-scope="scope">
                    <el-button type="text" @click="addHandle(scope.$index, scope.row)" size="mini">编辑</el-button>
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
    import { keywordpageUrl,deleteShophotkeywordUrl } from '@/api/url'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: keywordpageUrl,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/shopStore',
                    deleteURL: deleteShophotkeywordUrl,
                    deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                breaddata: [ "搜索管理", "热门搜索"],
                dataFormShow: {
                    hotKeyword: "",//关键字搜索
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
        watch: {
            // 关键字搜索
            'dataFormShow.hotKeyword':function(newV,oldV) {

                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 300) { //输入字符大于300的时候过滤
                        this.dataFormShow.hotKeyword = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
        },
        methods: {
            getData(){
                this.dataForm = {};
                for(let key in this.dataFormShow){
                    this.$set(this.dataForm,`${key}`,this.dataFormShow[key]);
                }
                console.log(this.dataForm);
                this.getDataList()
            },
            // 重置
            reset() {
                this.dataFormShow.hotKeyword = "";//关键字搜索
                this.dataForm.hotKeyword = "";//关键字搜索
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