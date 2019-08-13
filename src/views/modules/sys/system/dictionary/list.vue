<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <div class="mod-sys__dict">
            <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getData()">
                <el-form-item label="字典名称：">
                    <el-input v-model="dataForm.dictName" placeholder="请输入关键词搜索" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getData()">搜索</el-button>
                    <el-button @click="reset()">重置</el-button>
                    <el-button type="primary" @click="addOrUpdateHandle()">添加字典</el-button>
                </el-form-item>
                <br />
            </el-form>

            <!--            <el-form>-->
            <!--                <el-form-item>-->
            <!--                    <el-button v-if="$hasPermission('sys:dict:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>-->
            <!--                    <el-button v-if="$hasPermission('sys:dict:delete')" type="danger"  plain @click="deleteHandle()">{{'批量' + $t('deleteBatch') }}</el-button>-->
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
                <el-table-column prop="dictName" label="字典名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="dictCode" label="字典编号" header-align="center" align="center"></el-table-column>
                <el-table-column  label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="addWord(scope.id)">词典列表</el-button>
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
            <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        </div>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import AddOrUpdate from './add-or-update'
    import { moduleRoutes } from '@/router'
    import Bread from "@/components/bread";

    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    activatedIsNeed: false,
                    getDataListURL: '/admin-api/dict/page',
                    getDataListIsPage: true,
                    deleteURL: '/admin-api/dict',
                    deleteIsBatch: true
                },
                breaddata: ["系统设置", "字典管理"],
                dataForm: {
                    pid: '0',
                    dictName: '',
                    dictType: '',
                    dictValue: ''
                }
            }
        },
        components: {
            AddOrUpdate,
            Bread
        },
        activated () {
            // 通过路由参数pid, 控制列表请求操作
            this.dataForm.pid = this.$route.params.pid || '0'
            if (this.dataForm.pid !== '0') {
                this.mixinViewModuleOptions.getDataListURL = '/admin-api/dict/list'
                this.mixinViewModuleOptions.getDataListIsPage = false
                this.dataForm.dictType = this.$route.params.type || ''
            }
            this.getDataList()
        },
        methods: {
            addWord(id){
                this.$emit("addWord",id);
            },
            // 子级
            childHandle (row) {
                // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
                var routeName = `${this.$route.name}__${row.id}`
                var route = window.SITE_CONFIG['dynamicRoutes'].filter(item => item.name === routeName)[0]
                if (route) {
                    return this.$router.push({ name: routeName, params: { 'pid': row.id } })
                }
                // 否则: 添加并全局变量保存, 再跳转
                route = {
                    path: routeName,
                    component: () => import(`@/views/modules/${this.$route.name.replace(/-/g, '/')}`),
                    name: routeName,
                    meta: {
                        ...window.SITE_CONFIG['contentTabDefault'],
                        menuId: this.$route.meta.menuId,
                        title: `${this.$route.meta.title} - ${row.dictType}`
                    }
                }
                this.$router.addRoutes([
                    {
                        ...moduleRoutes,
                        name: `main-dynamic__${route.name}`,
                        children: [route]
                    }
                ])
                window.SITE_CONFIG['dynamicRoutes'].push(route)
                this.$router.push({ name: route.name, params: { 'pid': row.id, 'type': row.dictType } })
            },
            // 新增 / 修改
            addOrUpdateHandle (row = {}) {
                this.addOrUpdateVisible = true
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.dataForm.id = row.id
                    this.$refs.addOrUpdate.dataForm.pid = this.dataForm.pid
                    this.$refs.addOrUpdate.dataForm.dictType = row.dictType || this.dataForm.dictType || ''
                    this.$refs.addOrUpdate.init()
                })
            },
            getData(){
                this.page = 1;
                this.limit = 10;
                this.getDataList();
            },
            reset(){
                this.dataForm = {
                    dictName: ''
                };
                this.getData();
            }
        }
    }
</script>


<style scoped>
    .grayLine{
        border-bottom: 0!important;
    }
</style>