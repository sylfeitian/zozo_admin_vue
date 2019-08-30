<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>

        <div class="mod-sys__log-operation">
            <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getData()">
                <el-form-item label="操作账号：">
                    <el-input v-model="dataForm.creator" placeholder="请输入账号" clearable></el-input>
                </el-form-item>
                <el-form-item label="操作模块：">
                    <el-select v-model="dataForm.module" placeholder="请选择操作模块" clearable>
                        <el-option label="全部" :value="0"></el-option>
                        <el-option label="登录" :value="1"></el-option>
                        <el-option label="商品管理" :value="2"></el-option>
                        <el-option label="订单管理" :value="3"></el-option>
                        <el-option label="财务管理" :value="4"></el-option>
                        <el-option label="权限管理" :value="5"></el-option>
                        <el-option label="内容管理" :value="6"></el-option>
                        <el-option label="一级菜单" :value="7"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作时间：">
                    <el-date-picker
                            v-model="valuetime"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            align="left"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @blur='acttime'
                            :default-time="['00:00:00', '23:59:59']"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getDataList()" type="primary">查询</el-button>
                    <el-button @click="reset()">重置</el-button>
                </el-form-item>
                <br />
            </el-form>
<!--            <el-form>-->
<!--                <el-form-item>-->
<!--                    <el-button type="primary" plain @click="exportHandle()">{{ $t('export') }}</el-button>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
            <el-table v-loading="dataListLoading" :data="dataList" border @sort-change="dataListSortChangeHandle" style="width: 100%;">
                <el-table-column prop="creator" label="操作账号" header-align="center" align="center"></el-table-column>
                <el-table-column prop="realName" label="姓名" header-align="center" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色" header-align="center" align="center"></el-table-column>
                <el-table-column prop="module" label="操作模块" header-align="center" align="center"></el-table-column>
                <el-table-column prop="operation" label="操作页面" header-align="center" align="center"></el-table-column>
                <el-table-column prop="id" label="对应ID" header-align="center" align="center"></el-table-column>
                <el-table-column prop="createDate" label="操作时间" header-align="center" align="center"></el-table-column>
                <el-table-column prop="operation" label="操作内容" header-align="center" align="center"></el-table-column>
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
        </div>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import { operationUrl } from '@/api/url'

    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: operationUrl,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/log/operation/export'
                },
                breaddata: [ "系统管理", "操作日志"],
                dataForm: {
                    creator: '',
                    module: ''
                },
                valuetime: "", //操作时间数据
            }
        },
        components: {
            Bread
        },
        created() {
            this.getDataList()
        },
        watch:{
            valuetime(val){
                if(!val){
                    this.dataForm.strTime = '';
                    this.dataForm.endTime = '';
                }
            }
        },
        methods:{
            //开始结束时间
            acttime(){
                this.dataForm.startTime = this.valuetime[0];
                this.dataForm.endTime = this.valuetime[1];
            },
            reset(){
                this.dataForm.creator = null;
                this.dataForm.module = null;
                this.dataForm.startTime = null;
                this.dataForm.endTime = null;
                this.getDataList();
            }
        }
    }
</script>

<style scoped>
    .grayLine{
        border-bottom: 0!important;
    }
</style>