<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataFormShow" @keyup.enter.native="getDataList()" >
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="尺码项目名称：">
                <el-input v-model="dataFormShow.name"></el-input>
            </el-form-item>
            <el-form-item label="尺码ID：">
                <el-input v-model="dataFormShow.idJp"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData()">查询</el-button>
                <el-button class="btn"type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-form>
        	<el-form-item>
                <el-button @click="addOrEditHandle()"  class="btn" type="primary">导入信息</el-button>
            </el-form-item>
        </el-form>
        <el-table width="100%" :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="idJp" label="尺码项目ID" align="center"></el-table-column>
            <el-table-column prop="nameJp" label="日本尺码项目名称" align="center"></el-table-column>
            <el-table-column prop="name" label="尺码项目名称" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="addOrEditHandle(scope.$index, scope.row)"type="text"size="mini">编辑</el-button>
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
        <!-- 弹窗, 新建 -->
        <addEditData  v-if="addEditDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import addEditData from './model-add-edit-data'
    import {getshoplabel} from '@/api/url'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
            	mixinViewModuleOptions: {
		          getDataListURL: getshoplabel,
		          getDataListIsPage: true,
		          // exportURL: '/admin-api/log/login/export',
		          deleteURL: '',
		          dataListLoading: false, 
		          deleteIsBatch: true,
		          deleteIsBatchKey: 'id'
			    },
                breaddata: [ "商品管理", "尺码项目名称信息"],
                dataFormShow: {
                    name: "",//尺码项目名称
                    idJp: "", //ID
                },
                value: '',
                addEditDataVisible:false,
                dataListLoading: false,
                dataList: [],
                formLabelWidth: '120px'
            }
        },
        components: {
            Bread,
            addEditData
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
            reset() {
                this.dataFormShow.name = "";
                this.dataFormShow.idJp = "";
                this.dataForm.name = "";
                this.dataForm.idJp = "";
                this.getDataList();
            },
            // 新建和编辑
            addOrEditHandle(index=-1,row=""){
                this.setAddEditDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.addEditData.init(row)
                })
            },
            setAddEditDataVisible(boolargu){
                this.addEditDataVisible =  boolargu;
            }
        }
    }
</script>

<style scoped>
</style>