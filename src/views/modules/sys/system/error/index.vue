<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>

        <div class="mod-sys__log-error">
            <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getDataList()">
                <el-form-item label="操作账号：">
                    <el-input v-model="dataForm.creator" placeholder="请输入账号" clearable></el-input>
                </el-form-item>
                <el-form-item label="操作模块：">
                    <el-select v-model="dataForm.module" placeholder="请选择操作模块" clearable>
                        <el-option label="全部" value=""> </el-option>
                        <el-option
                                v-for="(item,index) in moduleOption"
                                :key="index"
                                :label="item.module"
                                :value="item.module">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作时间：">
                    <el-date-picker
                            v-model="timeArr"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            align="left"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']"
                            @blur='acttime'
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button  class="btn" type="primary" @click="getDataList">搜索</el-button>
                    <el-button  class="btn" type="primary" plain @click="reset()" >重置</el-button>
                </el-form-item>
                <br />
            </el-form>
            <el-table v-loading="dataListLoading" :data="dataList" border @sort-change="dataListSortChangeHandle" style="width: 100%;">
                <el-table-column prop="creator" label="操作账号" header-align="center" align="center"></el-table-column>
                <el-table-column prop="module" label="操作模块" header-align="center" align="center"></el-table-column>
                <el-table-column prop="errorType" label="异常类型" header-align="center" align="center"></el-table-column>
                <el-table-column prop="createDate" label="操作时间" header-align="center" align="center"></el-table-column>
                <el-table-column prop="operationalContext" label="操作内容" fixed="right" header-align="center" align="center" width="500"></el-table-column>
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
    import { errorUrl,exportError } from '@/api/url'
    import { errorListModule } from '@/api/api'

    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    activatedIsNeed: true,
                    getDataListURL: errorUrl,
                    getDataListIsPage: true,
                    exportURL: exportError
                },
                dataForm: {
                    module: "",
                    createDateStart:"",
                    createDateEnd:"",
                    creator:""
                },
                breaddata: ["系统管理", "异常日志"],
                timeArr: "", //操作时间数据
                dataListLoading: false,
                moduleOption:[],
            }
        },
        components: {
            Bread
        },
        watch:{
            timeArr(val){
                if(!val){
                    this.dataForm.createDateStart = '';
                    this.dataForm.createDateEnd = '';
                }
            },
        },
         created() {
            // this.getDataList();
            this.listModule()
        },
        methods: {
            listModule(){
                errorListModule().then((res)=>{
                    if(res.code == 200 && res.data){
                        // Object.assign(this.dataForm,res.data);
                        this.moduleOption =  [].concat(res.data)

                    }else{
                        // this.$message.error(res.msg)
                    }
                })
            },
            reset(){
                this.timeArr = [];
                this.dataForm.creator = "";
                this.dataForm.module = "";
                this.dataForm.createDateStart = "";
                this.dataForm.createDateEnd = "";
                this.getDataList();
            },
            acttime(){
                this.dataForm.createDateStart = this.timeArr[0];
                this.dataForm.createDateEnd = this.timeArr[1];
            },
        }
    }
</script>

<style lang="scss">
    .mod-sys__log-error {
        &-view-info {
            width: 80%;
        }
    }
</style>
