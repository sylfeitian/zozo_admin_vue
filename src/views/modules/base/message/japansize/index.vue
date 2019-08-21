<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="尺码ID：">
                <el-input v-model="dataForm.idJp" ></el-input>
            </el-form-item>
            <el-form-item label="尺码名称：">
                <el-input v-model="dataForm.name" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getDataList()">查询</el-button>
                <el-button   class="btn"type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-form>
        	<el-button @click="addOrEditHandle()"  class="btn" type="primary">导入信息</el-button>
        </el-form>
        <el-table width="100%" :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="idJp" label="尺码ID" align="center"></el-table-column>
            <el-table-column prop="nameJp" label="日本尺码名称" align="center"></el-table-column>
            <el-table-column prop="sizeUpdateTime" label="更新时间" align="center"></el-table-column>
            <el-table-column prop="name" label="尺码名称" align="center"></el-table-column>
            <el-table-column prop="cnSizeName" label="关联中国尺码" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="relationHandle(scope.$index, scope.row)"type="text"size="mini">{{scope.row.name?'修改':'关联尺码'}}</el-button>
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
        <!-- 弹窗, 新建 -->
        <addEdit  v-if="addEditisshow" ref="addEditref" @searchDataList="getDataList"></addEdit>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import addEditData from './model-add-edit-data'
    import addEdit from './model-add-edit'
    import { getsizeJPdata } from '@/api/url'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
            	mixinViewModuleOptions: {
			        // activatedIsNeed: false,
			        getDataListURL: getsizeJPdata,
			        getDataListIsPage: true,
			        // exportURL: '/admin-api/log/login/export',
			        deleteURL: '',
			        deleteIsBatch: true,
			        dataListLoading: false,
			        deleteIsBatch: true,
			        deleteIsBatchKey: "id"
			    },
                breaddata: [ "商品管理", "日本尺码"],
                dataForm: {
                    idJp: "",//尺码ID
                    name: "",//尺码名称
                },
                value: '',
                addEditDataVisible:false,
                addEditisshow:false,
                formLabelWidth: '120px',
                dataList: [],
                dataListLoading: false,
            }
        },
        components: {
            Bread,
            addEditData,
            addEdit
        },
        methods: {
            reset() {
                this.dataForm.idJp = "";
                this.dataForm.name = "";
                this.getDataList();
            },
            //编辑
            addOrEditHandle(index=-1,row=""){
                this.setAddEditDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.addEditData.init(row)
                })
            },
            //关联/修改
            relationHandle(index,row) {
              this.addEditisshow = true;
              this.$nextTick(() => {
                    this.$refs.addEditref.init(row)
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