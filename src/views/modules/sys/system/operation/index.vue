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
                        <el-option
                                v-for="item in moduleOption"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
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
                    <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
                    <el-button  class="btn" type="primary" plain @click="reset()" >重置</el-button>
                </el-form-item>
                <br />
            </el-form>
            <el-table v-loading="dataListLoading" :data="dataList" border @sort-change="dataListSortChangeHandle" style="width: 100%;">
                <el-table-column prop="creator" label="操作账号" header-align="center" align="center"></el-table-column>
                <el-table-column prop="realName" label="姓名" header-align="center" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色" header-align="center" align="center"></el-table-column>
                <el-table-column prop="module" label="操作模块" header-align="center" align="center"></el-table-column>
                <el-table-column prop="operatorInterface" label="操作页面" header-align="center" align="center"></el-table-column>
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
    import { listModule } from '@/api/api'

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
                    module: '',
                    createDateStart:'',
                    createDateEnd:''
                },
                valuetime: "", //操作时间数据
                dataList: [],
                dataListLoading: false,
                row:"",
                module:"",
                moduleOption:[],
            }
        },
        components: {
            Bread
        },
        created() {
            this.getDataList();
            this.listModule()
        },
        watch:{
            valuetime(val){
                if(!val){
                    this.dataForm.createDateStart = '';
                    this.dataForm.createDateEnd = '';
                }
            }
        },
        methods:{
            listModule(){
                var obj  = {
                    id:this.row.id,
                    module:this.row.module
                }
                listModule(obj).then((res)=>{
                    if(res.code == 200 && res.data){
                        // Object.assign(this.dataForm,res.data);
                        this.moduleOption = res.data

                    }else{
                        // this.$message.error(res.msg)
                    }
                })
            },
            //开始结束时间
            acttime(){
                this.dataForm.createDateStart = this.valuetime[0];
                this.dataForm.createDateEnd = this.valuetime[1];
            },
            reset(){
                this.valuetime = [];
                this.dataForm.creator = "";
                this.dataForm.module = "";
                this.dataForm.createDateStart = "";
                this.dataForm.createDateEnd = "";
                this.getDataList();
            },
        }
    }
</script>

<style scoped>

</style>