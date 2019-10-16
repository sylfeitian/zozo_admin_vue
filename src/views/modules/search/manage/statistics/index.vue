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
                <el-input v-model="dataFormShow.keyword" placeholder="请输入关键词搜索" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button class="btn"type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="width: 100%;margin-top: 10px;"
                @sort-change = "actsortchange"
        >
            <el-table-column label="序号" width="140" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                    <!-- {{scope.$index+1+(parseInt(params.currentPage)-1)* parseInt(params.currentPageSize) }} -->
                </template>
            </el-table-column>
            <el-table-column prop="keyword" label="搜索词" align="center"></el-table-column>
            <el-table-column prop="totalSearchNum" label="总搜索次数" sortable="custom" align="center"></el-table-column>
            <el-table-column prop="monthSearchNum" label="本月搜索次数" sortable="custom" align="center"></el-table-column>
            <el-table-column prop="daySearchNum" label="今日搜索次数" sortable="custom" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="240">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="deleteHandle(scope.row.id)" type="text" size="mini">删除</el-button>
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
    import { keywordcountpageUrl,deleteShopkeywordUrl } from '@/api/url'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: keywordcountpageUrl,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/shopStore',
                    deleteURL: deleteShopkeywordUrl,
                    deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                breaddata: [ "搜索管理", "同义词管理"],
                dataFormShow: {
                    keyword: "",//关键字搜索
                },
                dataList: [],
                dataListLoading: false,
                addDataVisible: false
            }
        },
        components: {
            Bread
        },
        watch: {
            // 关键字搜索
            'dataFormShow.keyword':function(newV,oldV) {
                debugger
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 300) { //输入字符大于300的时候过滤
                        this.dataFormShow.keyword = newV.substr(0,(chineseCount/2+characterCount)-1)
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
                this.dataFormShow.keyword = "";//关键字搜索
                this.dataForm.keyword = "";//关键字搜索
                this.getDataList();
            },
            //排序
            actsortchange(column, prop, order ){
            	console.log( order);
//          	order=="ascending"  "descending"
//	            prop="totalSearchNum"  总搜索数
//	            prop="monthSearchNum" "本月搜索次数"
//	            prop="daySearchNum" "今日搜索次数"
				//排序字段
                this.orderField = prop == 'totalSearchNum' ? 'total_search_num' 
                				: prop == "monthSearchNum" ? 'month_search_num'
                				: 'day_search_num';
                //排序方式
                this.order = order == 'ascending' ? 'asc' : 'desc'
   		
            	this.getData();
            }
        }
    }
</script>

<style scoped>

</style>