<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <div class="mod-sys__user">
            <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getData()">
                <el-form-item label="账号：">
                    <el-input v-model="dataForm.username" placeholder="请输入账号" clearable></el-input>
                </el-form-item>
                <el-form-item label="黑名单类型：">
                    <el-select v-model="dataForm.roleName" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="封禁时间：">
                    <el-date-picker
                            v-model="timeArr"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            align="left"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getData()" type="primary">搜索</el-button>
                    <el-button  @click="reset()">重置</el-button>
                    <el-button type="primary" @click="addOrUpdateHandle()">添加黑名单</el-button>
                </el-form-item>
            </el-form>
            <!--            <el-form>-->
            <!--                <el-form-item>-->
            <!--                    <el-button v-if="$hasPermission('sys:user:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>-->
            <!--                    <el-button v-if="$hasPermission('sys:user:delete')" type="danger" plain @click="deleteHandle()">批量{{ $t('deleteBatch') }}</el-button>-->
            <!--                    <el-button v-if="$hasPermission('sys:user:export')" type="primary" plain @click="exportHandle()">{{ $t('export') }}</el-button>-->
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
                <el-table-column prop="" label="黑名单" header-align="center" align="center"></el-table-column>
                <el-table-column prop="" label="类型" header-align="center" align="center" width="130px"></el-table-column>
                <el-table-column prop="createDate" label="封禁时间" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="" label="封禁原因" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">移除黑名单</el-button>
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

    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                // mixinViewModuleOptions: {
                //     getDataListURL: '/admin-api/user/page',
                //     getDataListIsPage: true,
                //     deleteURL: '/admin-api/user',
                //     deleteIsBatch: true,
                //     exportURL: '/admin-api/user/export'
                // },
                options: [{
                    value: '选项1',
                    label: '角色1'
                }, {
                    value: '选项2',
                    label: '角色2'
                }, {
                    value: '选项3',
                    label: '角色3'
                }],
                breaddata: ["系统管理", "黑名单管理"],
                dataForm: {},
                addOrUpdateVisible: false,
                centerDialogVisible:false,
                buttonStatus:false,
                timeArr: "", //封禁时间数据
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
        }
    }
</script>
<style lang="scss" scoped>
    .grayLine{
        border-bottom: 0!important;
    }
</style>