<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <div>
            <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getData()">
                <el-form-item label="关键词搜索：">
                    <el-input v-model="dataForm.name" placeholder="请输入关键字搜索" clearable style="width: 220px!important;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getData()" type="primary">搜索</el-button>
                    <el-button  @click="reset()">重置</el-button>
                </el-form-item>
            </el-form>
            <el-form>
            	<el-form-item>
                    <el-button v-if="$hasPermission('sys:role:save')" type="primary" @click="addOrUpdateHandle()" >添加禁用词</el-button>
                    <el-button type="primary" @click="">导入</el-button>
                </el-form-item>
            </el-form>

            <!--            <el-form>-->
            <!--                <el-form-item>-->
            <!--                    <el-button v-if="$hasPermission('sys:role:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>-->
            <!--                    <el-button v-if="$hasPermission('sys:role:delete')" type="danger" plain @click="deleteHandle()">批量删除</el-button>-->
            <!--                </el-form-item>-->
            <!--            </el-form>-->
            <el-table
                    v-loading="dataListLoading"
                    :data="dataList"
                    border
                    @selection-change="dataListSelectionChangeHandle"
                    @sort-change="dataListSortChangeHandle"
                    style="width: 100%;">
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
                <el-table-column prop="name" label="禁用词名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="createDate" label="添加时间" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" fixed="right" header-align="center" align="center">
                    <template slot-scope="scope" v-if="scope.row.roleFlag!==1">
                        <el-button v-if="$hasPermission('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
                        <el-button v-if="$hasPermission('sys:role:delete')" type="text" class="artdanger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
            <!-- 弹窗, 新增 / 修改 -->
            <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        </div>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import AddOrUpdate from './add-or-update'
    import Bread from "@/components/bread";
    import { getadvertisingban, advertisingban} from '@/api/url'

    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: getadvertisingban,
                    getDataListIsPage: true,
                    deleteURL: advertisingban,
                    deleteIsBatch: false
                },
                breaddata: ["系统管理", "禁用词管理"],
                dataForm: {
                	name:'',
                }
            }
        },
        components: {
            AddOrUpdate,
            Bread
        },
        methods:{
            getData(){
                this.page = 1;
                this.limit = 10;
                this.getDataList();
            },
            reset(){
                this.dataForm = {};
                this.getData();
            },
            addOrUpdateHandle(row){
            	this.addOrUpdateVisible = true;
            }
        }
    }

</script>

<style lang="scss" scoped>
</style>