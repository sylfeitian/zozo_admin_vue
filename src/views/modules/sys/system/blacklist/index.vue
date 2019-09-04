<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <div class="mod-sys__user">
            <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getData()">
                <el-form-item label="账号：">
                    <el-input v-model="dataForm.member_name" placeholder="请输入账号" clearable></el-input>
                </el-form-item>
                <el-form-item label="黑名单类型：">
                    <el-select v-model="dataForm.type" placeholder="请选择">
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
                </el-form-item>
            </el-form>
            <el-form>
            	<el-form-item>
                    <el-button type="primary" @click="addOrUpdateHandle()">添加黑名单</el-button>
                </el-form-item>
            </el-form>
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
                <el-table-column prop="" label="黑名单" header-align="center" align="center">
                	<template slot-scope="scope">
                		{{scope.row.type == 1? scope.row.address : scope.row.memberName }}
	                </template>
                </el-table-column>
                <el-table-column prop="type" label="类型" header-align="center" align="center" width="130px">
                	<template slot-scope="scope">
                		<el-tag v-if="scope.row.type == 1" type="success">地址</el-tag>
                		<el-tag v-else>账号</el-tag>
	                </template>
                </el-table-column>
                <el-table-column prop="createDateStart" label="封禁时间" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="封禁原因" header-align="center" align="center"></el-table-column>
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
    import { getblacklist,delblacklist } from '@/api/url'

    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: getblacklist,
                    getDataListIsPage: true,
                    deleteURL: delblacklist,
                    deleteIsBatch: false,
                    exportURL: ''
                },
                options: [{
                    value: '',
                    label: '全部'
                }, {
                    value: '0',
                    label: '账户'
                }, {
                    value: '1',
                    label: '地址'
                }],
                breaddata: ["系统管理", "黑名单管理"],
                dataForm: {
                	member_name:'', //账号
                	type:'', //类型
                	startTime:'',
                	endTime:'',
                },
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
        created(){
        	this.dataForm.type = this.options[0].value;
        },
        methods:{
            getData(){
            	this.dataForm.startTime = this.timeArr && this.timeArr[0];
            	this.dataForm.endTime =  this.timeArr && this.timeArr[1];
                this.page = 1;
                this.limit = 10;
                this.getDataList();
            },
            reset(){
                this.dataForm = {};
                this.timeArr = "";
                this.getDataList();
            },
            addOrUpdateHandle(){
            	this.addOrUpdateVisible = true;
            	this.$nextTick(()=>{
            		this.$refs.addOrUpdate.init();
            	})
            },
        }
    }
</script>
<style lang="scss" scoped>
</style>